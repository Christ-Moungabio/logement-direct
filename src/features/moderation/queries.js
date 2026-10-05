import "server-only";

import { capitalize } from "../../../lib/format";
import { createClient } from "../../lib/supabase/server";
import { displayStatus } from "../listings/status";

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

function listingTitle(listing) {
  const type = capitalize(listing.property_types?.name) || "Logement";
  return listing.neighborhoods?.name ? `${type} à ${listing.neighborhoods.name}` : type;
}

export async function getReportCounts() {
  const supabase = await createClient();
  const count = (status) =>
    countRows(supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", status));
  const [pending, resolved, rejected] = await Promise.all([count("pending"), count("resolved"), count("rejected")]);
  return { pending, resolved, rejected };
}

export async function getReports(status) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reports")
    .select(
      `
      id, reason, comment, status, created_at, handled_at, listing_id,
      listing:listings ( id, status, visible_from, property_types ( name ), neighborhoods ( name ) ),
      reporter:profiles!reporter_id ( full_name ),
      handler:profiles!handled_by ( full_name )
    `,
    )
    .eq("status", status)
    .order(status === "pending" ? "created_at" : "handled_at", { ascending: status === "pending" })
    .limit(50);

  if (error) throw new Error(`Impossible de charger les signalements : ${error.message}`);

  const listingIds = [...new Set(data.map((row) => row.listing_id).filter(Boolean))];
  const perListing = new Map();
  if (listingIds.length > 0) {
    const { data: related, error: relatedError } = await supabase
      .from("reports")
      .select("listing_id")
      .in("listing_id", listingIds);
    if (relatedError) throw new Error(`Impossible de compter les signalements : ${relatedError.message}`);
    related.forEach(({ listing_id }) => perListing.set(listing_id, (perListing.get(listing_id) ?? 0) + 1));
  }

  return data.map((row) => ({
    id: row.id,
    reason: row.reason,
    comment: row.comment,
    status: row.status,
    createdAt: row.created_at,
    handledAt: row.handled_at,
    reporterName: row.reporter?.full_name ?? null,
    handlerName: row.handler?.full_name ?? null,
    listing: row.listing
      ? { id: row.listing.id, title: listingTitle(row.listing), status: displayStatus(row.listing) }
      : null,
    reportsOnListing: perListing.get(row.listing_id) ?? 0,
  }));
}
