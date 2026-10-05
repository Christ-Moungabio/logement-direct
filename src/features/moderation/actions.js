"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "../auth/queries";
import { createClient } from "../../lib/supabase/server";
import { hideListingSchema } from "./schemas";

const LISTINGS_PATH = "/admin/annonces";

export async function hideListing(_previousState, formData) {
  await requireRole("admin", LISTINGS_PATH);

  const values = { listingId: formData.get("listingId"), reason: formData.get("reason") ?? "" };
  const parsed = hideListingSchema.safeParse(values);
  if (!parsed.success) {
    return { values, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .update({ status: "hidden", hidden_reason: parsed.data.reason })
    .eq("id", parsed.data.listingId)
    .in("status", ["published", "scheduled"])
    .select("id");

  if (error || data.length === 0) {
    return { values, formError: "Cette annonce ne peut pas être masquée. Actualisez la page." };
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
