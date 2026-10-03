import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/server/auth";

import { propertyTypeLabel } from "./labels";
import { listingIdSchema } from "./schemas";

export const LISTING_PHOTOS_BUCKET = "listing-photos";

// Une seule requête : la vue expose les clés étrangères de `listings`, ce qui
// permet à PostgREST de joindre les libellés et les photos. Les photos suivent
// leur propre politique RLS (visibilité de l'annonce).
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

/**
 * Lit une annonce visible (vue `public_listings`) avec la session de l'utilisateur.
 * Renvoie `null` si l'identifiant est invalide ou si l'annonce n'est pas visible
 * (inexistante, brouillon, en cours de mise en ligne, fermée ou masquée).
 *
 * L'identifiant du propriétaire n'est pas dans le résultat : utiliser
 * `getViewerRelation` pour savoir si l'utilisateur consulte sa propre annonce.
 *
 * @param {string} id
 * @returns {Promise<import("./types").ListingDetail | null>}
 */
export const getPublicListing = cache(async (id) => {
  const row = await fetchListingRow(id);
  return row ? toListingDetail(row.data, row.supabase) : null;
});

/**
 * Relation de l'utilisateur courant avec l'annonce, calculée côté serveur.
 *
 * @param {string} id
 * @returns {Promise<import("./types").ViewerRelation>}
 */
export async function getViewerRelation(id) {
  const [user, row] = await Promise.all([
    getCurrentUser(),
    fetchListingRow(id),
  ]);

  if (!user) return "guest";
  if (row && row.data.owner_id === user.id) return "owner";
  if (user.role === "tenant") return "tenant";
  return "other";
}

/**
 * Coordonnées du propriétaire via la RPC `get_listing_contact`.
 * À n'appeler que pour un utilisateur connecté : la RPC refuse les visiteurs.
 * Renvoie `null` pour le propriétaire de l'annonce ou en cas d'erreur.
 *
 * @param {string} id
 * @returns {Promise<import("./types").ListingContact | null>}
 */
export async function getListingContact(id) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_listing_contact", {
    p_listing_id: id,
  });

  if (error) {
    console.error("get_listing_contact a échoué", error.code, error.message);
    return null;
  }

  const contact = data?.[0];
  if (!contact) return null;

  return {
    ownerName: contact.owner_name,
    whatsappNumber: contact.whatsapp_number,
  };
}

/**
 * Indique si l'utilisateur courant a déjà signalé l'annonce.
 *
 * @param {string} listingId
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function hasReportedListing(listingId, userId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("id")
    .eq("listing_id", listingId)
    .eq("reporter_id", userId)
    .maybeSingle();

  if (error) {
    console.error(
      "Lecture du signalement impossible",
      error.code,
      error.message,
    );
    return false;
  }
  return data !== null;
}

// Mis en cache pour la requête : la page, ses métadonnées et le calcul de la
// relation partagent le même appel réseau.
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
    // Une erreur technique ne doit rien révéler : on affiche « indisponible ».
    console.error("Lecture de l'annonce impossible", error.code, error.message);
    return null;
  }

  return data ? { data, supabase } : null;
});

/**
 * @param {any} row Ligne de `public_listings` avec ses jointures.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @returns {import("./types").ListingDetail | null}
 */
function toListingDetail(row, supabase) {
  // Une annonce visible est forcément complète (contrainte de la base) ;
  // on reste prudent si une jointure revient vide.
  if (
    !row.property_type ||
    !row.city ||
    !row.neighborhood ||
    row.monthly_rent == null ||
    row.advance_months == null
  ) {
    return null;
  }

  const photos = [...(row.photos ?? [])]
    .sort(
      (a, b) =>
        Number(b.is_primary) - Number(a.is_primary) ||
        a.sort_order - b.sort_order,
    )
    .map((photo) => ({
      url: supabase.storage
        .from(LISTING_PHOTOS_BUCKET)
        .getPublicUrl(photo.storage_path).data.publicUrl,
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
