"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";
import { PHOTOS_BUCKET } from "./photos";

async function findPhoto(supabase, photoId) {
  const { data, error } = await supabase
    .from("listing_photos")
    .select("id, listing_id, storage_path")
    .eq("id", photoId)
    .maybeSingle();
  if (error || !data) throw new Error("Photo introuvable.");
  return data;
}

export async function setPrimaryPhoto(formData) {
  const supabase = await createClient();
  const photo = await findPhoto(supabase, formData.get("photoId"));

  // Une seule photo principale par annonce : on retire l'ancienne avant de poser la nouvelle.
  const { error: clearError } = await supabase
    .from("listing_photos")
    .update({ is_primary: false })
    .eq("listing_id", photo.listing_id)
    .eq("is_primary", true);
  if (clearError) throw new Error(`Impossible de changer la photo principale : ${clearError.message}`);

  const { error } = await supabase.from("listing_photos").update({ is_primary: true }).eq("id", photo.id);
  if (error) throw new Error(`Impossible de changer la photo principale : ${error.message}`);

  revalidatePath(`/mes-annonces/${photo.listing_id}/modifier`);
}

export async function deletePhoto(formData) {
  const supabase = await createClient();
  const photo = await findPhoto(supabase, formData.get("photoId"));

  // La base désigne elle-même une nouvelle photo principale si on supprime l'actuelle.
  const { error } = await supabase.from("listing_photos").delete().eq("id", photo.id);
  if (error) throw new Error(`Impossible de supprimer la photo : ${error.message}`);

  await supabase.storage.from(PHOTOS_BUCKET).remove([photo.storage_path]);
  revalidatePath(`/mes-annonces/${photo.listing_id}/modifier`);
}
