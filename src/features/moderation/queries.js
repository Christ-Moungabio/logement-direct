import "server-only";

import { createClient } from "../../lib/supabase/server";

async function countRows(query) {
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getModerationCounts() {
  const supabase = await createClient();
  const [pendingReports, hiddenListings, liveListings] = await Promise.all([
    countRows(supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending")),
    countRows(supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "hidden")),
    countRows(supabase.from("public_listings").select("id", { count: "exact", head: true })),
  ]);

  return { pendingReports, hiddenListings, liveListings };
}

export async function getAdminListings(filter) {
  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select(
      `
      id, status, monthly_rent, visible_from, published_at, updated_at, hidden_reason,
      property_types ( name ),
      cities ( name ),
      neighborhoods ( name ),
      owner:profiles ( full_name ),
      listing_photos ( count )
    `,
    )
    .order("updated_at", { ascending: false })
    .limit(100);

  query =
    filter === "hidden"
      ? query.eq("status", "hidden")
      : query.or(`status.eq.published,and(status.eq.scheduled,visible_from.lte.${new Date().toISOString()})`);

  const { data, error } = await query;
  if (error) throw new Error(`Impossible de charger les annonces : ${error.message}`);

  return data.map((row) => ({
    id: row.id,
    status: row.status === "hidden" ? "hidden" : "published",
    rent: row.monthly_rent,
    propertyType: row.property_types?.name ?? null,
    city: row.cities?.name ?? null,
    neighborhood: row.neighborhoods?.name ?? null,
    ownerName: row.owner?.full_name ?? null,
    photoCount: row.listing_photos?.[0]?.count ?? 0,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    hiddenReason: row.hidden_reason,
  }));
}
