"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "../auth/queries";
import { createClient } from "../../lib/supabase/server";
import { hideFromReportSchema, hideListingSchema } from "./schemas";

const LISTINGS_PATH = "/admin/annonces";
const REPORTS_PATH = "/admin/signalements";
const HIDE_ERROR = "Cette annonce ne peut pas être masquée. Actualisez la page.";

async function hideListingRow(supabase, listingId, reason) {
  const { data, error } = await supabase
    .from("listings")
    .update({ status: "hidden", hidden_reason: reason })
    .eq("id", listingId)
    .in("status", ["published", "scheduled"])
    .select("id");
  return !error && data.length > 0;
}

async function closeReports(supabase, filter, status, adminId) {
  const query = supabase
    .from("reports")
    .update({ status, handled_by: adminId, handled_at: new Date().toISOString() })
    .eq("status", "pending");
  const { data, error } = await filter(query).select("id");
  return !error && data.length > 0;
}

export async function hideListing(_previousState, formData) {
  await requireRole("admin", LISTINGS_PATH);

  const values = { listingId: formData.get("listingId"), reason: formData.get("reason") ?? "" };
  const parsed = hideListingSchema.safeParse(values);
  if (!parsed.success) {
    return { values, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  if (!(await hideListingRow(supabase, parsed.data.listingId, parsed.data.reason))) {
    return { values, formError: HIDE_ERROR };
  }

  revalidatePath("/", "layout");
  return { done: true };
}

export async function restoreListing(formData) {
  await requireRole("admin", LISTINGS_PATH);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .update({ status: "published" })
    .eq("id", formData.get("listingId"))
    .eq("status", "hidden")
    .select("id");

  if (error || data.length === 0) throw new Error("Impossible de réafficher cette annonce.");

  revalidatePath("/", "layout");
}

export async function hideListingFromReport(_previousState, formData) {
  await requireRole("admin", REPORTS_PATH);

  const values = {
    reportId: formData.get("reportId"),
    listingId: formData.get("listingId"),
    reason: formData.get("reason") ?? "",
  };
  const parsed = hideFromReportSchema.safeParse(values);
  if (!parsed.success) {
    return { values, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("hide_listing_and_resolve_reports", {
    p_listing_id: parsed.data.listingId,
    p_reason: parsed.data.reason,
  });
  if (error) {
    return { values, formError: HIDE_ERROR };
  }

  revalidatePath("/", "layout");
  redirect(REPORTS_PATH);
}

async function decideReport(formData, status) {
  const reportId = formData.get("reportId");
  const profile = await requireRole("admin", `${REPORTS_PATH}/${reportId}`);

  const supabase = await createClient();
  const closed = await closeReports(supabase, (query) => query.eq("id", reportId), status, profile.id);
  if (!closed) throw new Error("Ce signalement a déjà été traité ou n'existe plus.");

  revalidatePath("/admin", "layout");
  redirect(REPORTS_PATH);
}

export async function resolveReport(formData) {
  await decideReport(formData, "resolved");
}

export async function rejectReport(formData) {
  await decideReport(formData, "rejected");
}
