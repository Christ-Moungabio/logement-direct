"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";
import { CLOSE_REASONS } from "./status";

const PHOTOS_BUCKET = "listing-photos";

// Les règles RLS et le trigger de la base refusent déjà ce qui n'est pas permis,
// ici on remonte simplement l'erreur.
function check(error, message) {
  if (error) throw new Error(`${message} : ${error.message}`);
}

export async function closeListing(formData) {
  const id = formData.get("id");
  const reason = formData.get("reason");
  if (!Object.hasOwn(CLOSE_REASONS, reason)) throw new Error("Motif de fermeture invalide.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .update({ status: "closed", close_reason: reason })
    .eq("id", id)
    .in("status", ["scheduled", "published"]);
  check(error, "Impossible de fermer l'annonce");

  revalidatePath("/mes-annonces");
}

export async function withdrawListing(formData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .update({ status: "draft" })
    .eq("id", formData.get("id"))
    .eq("status", "scheduled");
  check(error, "Impossible de retirer l'annonce");

  revalidatePath("/mes-annonces");
}

export async function deleteListing(formData) {
  const id = formData.get("id");
  const supabase = await createClient();

  // Les lignes de photos partent avec l'annonce, pas les fichiers du bucket.
  const { data: photos } = await supabase
    .from("listing_photos")
    .select("storage_path")
    .eq("listing_id", id);
  if (photos?.length) {
    await supabase.storage.from(PHOTOS_BUCKET).remove(photos.map((photo) => photo.storage_path));
  }

  const { error } = await supabase.from("listings").delete().eq("id", id);
  check(error, "Impossible de supprimer l'annonce");

  revalidatePath("/mes-annonces");
}
