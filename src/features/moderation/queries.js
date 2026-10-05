import "server-only";

import { capitalize } from "../../../lib/format";
import { createClient } from "../../lib/supabase/server";
import { PHOTOS_BUCKET } from "../listing-form/photos";
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

const PHOTOS_BUCKET = "listing-photos";

export async function getReport(id) {
  const supabase = await createClient();

  const { data: report, error } = await supabase
    .from("reports")
    .select(
      `
      id, reason, comment, status, created_at, handled_at, listing_id,
      reporter:profiles!reporter_id ( full_name ),
      handler:profiles!handled_by ( full_name ),
      listing:listings (
        id, status, visible_from, monthly_rent, advance_months, description, published_at, hidden_reason,
        property_types ( name ),
        cities ( name ),
        neighborhoods ( name ),
        owner:profiles ( full_name, whatsapp_number ),
        listing_photos ( storage_path, is_primary, sort_order )
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Impossible de charger le signalement : ${error.message}`);
  if (!report) return null;

  let others = [];
  if (report.listing_id) {
    const { data, error: othersError } = await supabase
      .from("reports")
      .select("id, reason, comment, status, created_at, reporter:profiles!reporter_id ( full_name )")
      .eq("listing_id", report.listing_id)
      .neq("id", report.id)
      .order("created_at", { ascending: false });
    if (othersError) throw new Error(`Impossible de charger les autres signalements : ${othersError.message}`);
    others = data;
  }

  const listing = report.listing;
  const photo = listing?.listing_photos
    ?.toSorted((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)
    .at(0);

  return {
    id: report.id,
    reason: report.reason,
    comment: report.comment,
    status: report.status,
    createdAt: report.created_at,
    handledAt: report.handled_at,
    reporterName: report.reporter?.full_name ?? null,
    handlerName: report.handler?.full_name ?? null,
    listing: listing
      ? {
          id: listing.id,
          title: listingTitle(listing),
          status: displayStatus(listing),
          city: listing.cities?.name ?? null,
          rent: listing.monthly_rent,
          advanceMonths: listing.advance_months,
          description: listing.description,
          publishedAt: listing.published_at,
          hiddenReason: listing.hidden_reason,
          ownerName: listing.owner?.full_name ?? null,
          ownerPhone: listing.owner?.whatsapp_number ?? null,
          photoUrl: photo
            ? supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(photo.storage_path).data.publicUrl
            : null,
        }
      : null,
    otherReports: others.map((other) => ({
      id: other.id,
      reason: other.reason,
      comment: other.comment,
      status: other.status,
      createdAt: other.created_at,
      reporterName: other.reporter?.full_name ?? null,
    })),
  };
}

export async function getDashboardData() {
  const supabase = await createClient();
  const accountsSince = new Date(Date.now() - 15 * 86_400_000).toISOString();
  const countRole = (role) =>
    countRows(supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", role));

  const [listingsResult, reportsResult, recentProfilesResult, tenants, owners, admins] = await Promise.all([
    supabase
      .from("listings")
      .select("id, status, visible_from, created_at, neighborhoods ( name )")
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase.from("reports").select("id, created_at").eq("status", "pending"),
    supabase.from("profiles").select("created_at").gte("created_at", accountsSince),
    countRole("tenant"),
    countRole("owner"),
    countRole("admin"),
  ]);

  for (const result of [listingsResult, reportsResult, recentProfilesResult]) {
    if (result.error) throw new Error(`Impossible de charger la vue d'ensemble : ${result.error.message}`);
  }

  return {
    listings: listingsResult.data.map((row) => ({
      id: row.id,
      status: row.status,
      visibleFrom: row.visible_from,
      createdAt: row.created_at,
      neighborhood: row.neighborhoods?.name ?? null,
    })),
    pendingReports: reportsResult.data.map((row) => ({ id: row.id, createdAt: row.created_at })),
    accounts: {
      total: tenants + owners + admins,
      tenants,
      owners,
      admins,
      recentCreatedAt: recentProfilesResult.data.map((row) => row.created_at),
    },
  };
}

function primaryPhotoUrl(supabase, photos) {
  const [photo] = [...(photos ?? [])].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order,
  );
  return photo ? supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(photo.storage_path).data.publicUrl : null;
}

export async function getPendingReportsPreview(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select(
      `
      id, reason, created_at,
      listing:listings (
        id, monthly_rent, property_types ( name ), neighborhoods ( name ),
        listing_photos ( storage_path, is_primary, sort_order )
      ),
      reporter:profiles!reporter_id ( full_name )
    `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw new Error(`Impossible de charger les signalements : ${error.message}`);

  return data.map((row) => ({
    id: row.id,
    reason: row.reason,
    createdAt: row.created_at,
    reporterName: row.reporter?.full_name ?? null,
    listing: row.listing
      ? {
          id: row.listing.id,
          title: listingTitle(row.listing),
          neighborhood: row.listing.neighborhoods?.name ?? null,
          rent: row.listing.monthly_rent,
          photoUrl: primaryPhotoUrl(supabase, row.listing.listing_photos),
        }
      : null,
  }));
}

export async function getModerationLog(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select(
      `
      id, reason, status, handled_at, listing_id,
      listing:listings ( id, hidden_reason, property_types ( name ), neighborhoods ( name ) ),
      handler:profiles!handled_by ( full_name )
    `,
    )
    .in("status", ["resolved", "rejected"])
    .not("handled_at", "is", null)
    .order("handled_at", { ascending: false })
    .limit(limit * 4);

  if (error) throw new Error(`Impossible de charger le journal de modération : ${error.message}`);

  const seen = new Set();
  return data
    .filter((row) => {
      const key = `${row.listing_id}|${row.status}|${row.handled_at}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map((row) => ({
      id: row.id,
      decision: row.status,
      reason: row.reason,
      handledAt: row.handled_at,
      handlerName: row.handler?.full_name ?? null,
      listingTitle: row.listing ? listingTitle(row.listing) : null,
      hiddenReason: row.listing?.hidden_reason ?? null,
    }));
}
