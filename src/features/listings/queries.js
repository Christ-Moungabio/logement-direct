import "server-only";

import { publishChecklist } from "../listing-form/checklist";
import { PHOTOS_BUCKET } from "../listing-form/photos";
import { createClient } from "../../lib/supabase/server";
import { displayStatus } from "./status";

function primaryPhoto(photos) {
  return [...photos].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order,
  )[0];
}

export async function getOwnerListings(ownerId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id, status, property_type_id, city_id, neighborhood_id, monthly_rent, advance_months,
      water, electricity, description, visible_from, published_at, updated_at, close_reason, hidden_reason,
      availability, available_from,
      property_types ( name ),
      cities ( name ),
      neighborhoods ( name ),
      listing_photos ( storage_path, is_primary, sort_order )
    `,
    )
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Impossible de charger vos annonces : ${error.message}`);

  const now = new Date();
  return data.map((row) => {
    const photo = primaryPhoto(row.listing_photos);
    const checklist = publishChecklist(row, row.listing_photos.length);
    const missing = checklist.filter((item) => !item.done).map((item) => item.key);
    return {
      id: row.id,
      status: displayStatus(row, now),
      rent: row.monthly_rent,
      advanceMonths: row.advance_months,
      water: row.water,
      electricity: row.electricity,
      propertyType: row.property_types?.name ?? null,
      city: row.cities?.name ?? null,
      neighborhood: row.neighborhoods?.name ?? null,
      photoCount: row.listing_photos.length,
      photoUrl: photo ? supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(photo.storage_path).data.publicUrl : null,
      progress: {
        done: checklist.length - missing.length,
        total: checklist.length,
        percent: Math.round(((checklist.length - missing.length) / checklist.length) * 100),
        missing,
      },
      visibleFrom: row.visible_from,
      publishedAt: row.published_at,
      updatedAt: row.updated_at,
      availability: row.availability,
      availableFrom: row.available_from,
      closeReason: row.close_reason,
      hiddenReason: row.hidden_reason,
    };
  });
}
