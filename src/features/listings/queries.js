import "server-only";

import { createClient } from "../../lib/supabase/server";
import { displayStatus } from "./status";

export async function getOwnerListings(ownerId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id, status, monthly_rent, description, visible_from, published_at,
      updated_at, close_reason, hidden_reason, availability, available_from,
      property_types ( name ),
      cities ( name ),
      neighborhoods ( name ),
      listing_photos ( count )
    `,
    )
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Impossible de charger vos annonces : ${error.message}`);

  const now = new Date();
  return data.map((row) => ({
    id: row.id,
    status: displayStatus(row, now),
    rent: row.monthly_rent,
    propertyType: row.property_types?.name ?? null,
    city: row.cities?.name ?? null,
    neighborhood: row.neighborhoods?.name ?? null,
    photoCount: row.listing_photos?.[0]?.count ?? 0,
    hasDescription: Boolean(row.description),
    visibleFrom: row.visible_from,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    closeReason: row.close_reason,
    hiddenReason: row.hidden_reason,
  }));
}
