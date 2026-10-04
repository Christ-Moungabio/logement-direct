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
