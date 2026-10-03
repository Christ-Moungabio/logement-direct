"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "../auth/queries";
import { createClient } from "../../lib/supabase/server";
import { draftSchema, fieldErrors, missingFieldErrors } from "./schemas";

const GENERIC_ERROR = "Impossible d'enregistrer l'annonce pour le moment. Réessayez dans un instant.";

function formValues(formData) {
  return Object.fromEntries([...formData.entries()].filter(([key]) => !key.startsWith("$")));
}

function toRow(data) {
  return {
    property_type_id: data.propertyTypeId ?? null,
    city_id: data.cityId ?? null,
    neighborhood_id: data.neighborhoodId ?? null,
    monthly_rent: data.monthlyRent ?? null,
    advance_months: data.advanceMonths ?? null,
    description: data.description ?? null,
    water: data.water ?? null,
    electricity: data.electricity ?? null,
    doors_count: data.doorsCount ?? null,
    availability: data.availability ?? null,
    available_from: data.availability === "available_soon" ? (data.availableFrom ?? null) : null,
  };
}

export async function createDraft(_previousState, formData) {
  const profile = await requireRole("owner", "/mes-annonces/nouvelle");

  const values = formValues(formData);
  const parsed = draftSchema.safeParse(values);
  if (!parsed.success) {
    return { values, errors: fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .insert({ ...toRow(parsed.data), owner_id: profile.id })
    .select("id")
    .single();
  if (error) return { values, formError: GENERIC_ERROR };

  redirect(`/mes-annonces/${data.id}/modifier`);
}

export async function updateListing(id, _previousState, formData) {
  await requireRole("owner", `/mes-annonces/${id}/modifier`);

  const values = formValues(formData);
  const parsed = draftSchema.safeParse(values);
  if (!parsed.success) {
    return { values, errors: fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { data: current } = await supabase.from("listings").select("status").eq("id", id).maybeSingle();
  if (!current || !["draft", "scheduled", "published"].includes(current.status)) {
    return { values, formError: "Cette annonce ne peut plus être modifiée." };
  }

  if (current.status !== "draft") {
    const errors = missingFieldErrors(parsed.data);
    if (Object.keys(errors).length > 0) return { values, errors };
  }

  const { data, error } = await supabase.from("listings").update(toRow(parsed.data)).eq("id", id).select("id");
  if (error || data.length === 0) return { values, formError: GENERIC_ERROR };

  revalidatePath("/mes-annonces");
  return { values, saved: true };
}
