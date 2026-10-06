import "server-only";

import { cache } from "react";
import { createClient } from "../../lib/supabase/server";
import { getCurrentProfile } from "../auth/queries";
import { propertyTypeLabel } from "./labels";
import { listingIdSchema } from "./schemas";

export const LISTING_PHOTOS_BUCKET = "listing-photos";

// La vue expose les clés étrangères de `listings` : PostgREST joint les
// libellés et les photos en une seule requête. Les photos suivent leur propre RLS.
const LISTING_SELECT = `
  id,
  owner_id,
  monthly_rent,
  advance_months,
  description,
  water,
  electricity,
  doors_count,
  availability,
  available_from,
  published_at,
  updated_at,
  property_type:property_types ( name ),
  city:cities!listings_city_id_fkey ( name ),
  neighborhood:neighborhoods!listings_neighborhood_matches_city ( name ),
  photos:listing_photos ( storage_path, sort_order, is_primary )
`;

const fetchListingRow = cache(async (id) => {
  if (!listingIdSchema.safeParse(id).success) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_listings")
    .select(LISTING_SELECT)
    .eq("id", id)
    .order("sort_order", { referencedTable: "listing_photos" })
    .maybeSingle();

  if (error) {
    console.error("Lecture de l'annonce impossible", error.code, error.message);
    return null;
  }

  return data ? { data, supabase } : null;
});

/**
 * Annonce visible (vue `public_listings`), lue avec la session de l'utilisateur.
 * `null` si l'identifiant est invalide ou si l'annonce n'est pas visible.
 * L'identifiant du propriétaire n'est pas renvoyé : voir `getViewerRelation`.
 *
 * @returns {Promise<import("./types").ListingDetail | null>}
 */
export const getPublicListing = cache(async (id) => {
  const row = await fetchListingRow(id);
  return row ? toListingDetail(row.data, row.supabase) : null;
});

/** @returns {Promise<import("./types").ViewerRelation>} */
export async function getViewerRelation(id) {
  const [profile, row] = await Promise.all([getCurrentProfile(), fetchListingRow(id)]);

  if (!profile) return "guest";
  if (row && row.data.owner_id === profile.id) return "owner";
  if (profile.role === "tenant") return "tenant";
  return "other";
}

/**
 * Coordonnées du propriétaire (RPC `get_listing_contact`), à n'appeler que pour
 * un utilisateur connecté. `null` pour le propriétaire de l'annonce ou en cas d'erreur.
 *
 * @returns {Promise<import("./types").ListingContact | null>}
 */
export async function getListingContact(id) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_listing_contact", { p_listing_id: id });

  if (error) {
    console.error("get_listing_contact a échoué", error.code, error.message);
    return null;
  }

  const contact = data?.[0];
  if (!contact) return null;

  return { ownerName: contact.owner_name, whatsappNumber: contact.whatsapp_number };
}

export async function hasReportedListing(listingId, userId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("id")
    .eq("listing_id", listingId)
    .eq("reporter_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Lecture du signalement impossible", error.code, error.message);
    return false;
  }
  return data !== null;
}

function toListingDetail(row, supabase) {
  // Une annonce visible est complète (contrainte de la base) ; prudence si une jointure revient vide.
  if (!row.property_type || !row.city || !row.neighborhood || row.monthly_rent == null || row.advance_months == null) {
    return null;
  }

  const photos = [...(row.photos ?? [])]
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)
    .map((photo) => ({
      url: supabase.storage.from(LISTING_PHOTOS_BUCKET).getPublicUrl(photo.storage_path).data.publicUrl,
      isPrimary: photo.is_primary,
      sortOrder: photo.sort_order,
    }));

  return {
    id: row.id,
    propertyType: propertyTypeLabel(row.property_type.name),
    city: row.city.name,
    neighborhood: row.neighborhood.name,
    monthlyRent: row.monthly_rent,
    advanceMonths: row.advance_months,
    description: row.description ?? "",
    water: row.water,
    electricity: row.electricity,
    doorsCount: row.doors_count,
    availability: row.availability,
    availableFrom: row.available_from,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    photos,
  };
}
