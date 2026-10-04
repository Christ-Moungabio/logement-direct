"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "../auth/queries";
import { createClient } from "../../lib/supabase/server";
import { CLOSE_REASONS } from "./status";

const PHOTOS_BUCKET = "listing-photos";

// Un update ou un delete refusé par la RLS ne renvoie pas d'erreur, juste 0 ligne.
// On vérifie donc qu'au moins une ligne a bien été touchée.
function check(result, message) {
  if (result.error) throw new Error(`${message} : ${result.error.message}`);
  if (result.data.length === 0) throw new Error(`${message} : action non autorisée sur cette annonce.`);
}

export async function closeListing(formData) {
  await requireRole("owner", "/mes-annonces");

  const id = formData.get("id");
  const reason = formData.get("reason");
  if (!Object.hasOwn(CLOSE_REASONS, reason)) throw new Error("Motif de fermeture invalide.");

  const supabase = await createClient();
  const result = await supabase
    .from("listings")
    .update({ status: "closed", close_reason: reason })
    .eq("id", id)
    .in("status", ["scheduled", "published"])
    .select("id");
  check(result, "Impossible de fermer l'annonce");

  revalidatePath("/mes-annonces");
}

export async function withdrawListing(formData) {
  await requireRole("owner", "/mes-annonces");

  const supabase = await createClient();
  const result = await supabase
    .from("listings")
    .update({ status: "draft" })
    .eq("id", formData.get("id"))
    .eq("status", "scheduled")
    .select("id");
  check(result, "Impossible de retirer l'annonce");

  revalidatePath("/mes-annonces");
}

export async function deleteListing(formData) {
  await requireRole("owner", "/mes-annonces");

  const id = formData.get("id");
  const supabase = await createClient();

  // On note les fichiers avant la suppression : les lignes de photos partent avec l'annonce.
  const { data: photos } = await supabase.from("listing_photos").select("storage_path").eq("listing_id", id);

  const result = await supabase.from("listings").delete().eq("id", id).select("id");
  check(result, "Impossible de supprimer l'annonce");

  // Les fichiers ne sont retirés qu'une fois l'annonce vraiment supprimée.
  if (photos?.length) {
    await supabase.storage.from(PHOTOS_BUCKET).remove(photos.map((photo) => photo.storage_path));
  }

  revalidatePath("/mes-annonces");
}

function brazzavilleToday() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Brazzaville" });
}

export async function updateAvailability(formData) {
  await requireRole("owner", "/mes-annonces");

  const id = formData.get("id");
  const availability = formData.get("availability");
  const date = formData.get("availableFrom");

  if (availability !== "available" && availability !== "available_soon") {
    throw new Error("Disponibilité invalide.");
  }
  if (availability === "available_soon" && !(date && date > brazzavilleToday())) {
    throw new Error("Indiquez une date de disponibilité dans le futur.");
  }

  const supabase = await createClient();
  const result = await supabase
    .from("listings")
    .update({
      availability,
      available_from: availability === "available_soon" ? date : null,
    })
    .eq("id", id)
    .in("status", ["scheduled", "published"])
    .select("id");
  check(result, "Impossible de changer la disponibilité");

  revalidatePath("/mes-annonces");
}
