"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "../../lib/supabase/server";
import { getCurrentProfile } from "../auth/queries";
import { reportSchema } from "./schemas";

const UNIQUE_VIOLATION = "23505";
const INSUFFICIENT_PRIVILEGE = "42501";

// La RLS de `reports` n'autorise que les locataires connectés, sur une
// annonce visible qui n'est pas la leur.
export async function reportListing(_previousState, formData) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return { status: "unauthorized", message: "Connectez-vous avec un compte locataire pour signaler une annonce." };
  }
  if (profile.role !== "tenant") {
    return { status: "unauthorized", message: "Seuls les comptes locataires peuvent signaler une annonce." };
  }

  const parsed = reportSchema.safeParse({
    listingId: formData.get("listingId"),
    reason: formData.get("reason") ?? undefined,
    comment: formData.get("comment") ?? undefined,
  });

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: "invalid",
      message: fieldErrors.listingId ? "Cette annonce ne peut pas être signalée." : "Vérifiez le formulaire.",
      fieldErrors: { reason: fieldErrors.reason?.[0], comment: fieldErrors.comment?.[0] },
    };
  }

  const { listingId, reason, comment } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("reports")
    .insert({ listing_id: listingId, reporter_id: profile.id, reason, comment });

  if (error?.code === UNIQUE_VIOLATION) {
    return { status: "already_reported", message: "Vous avez déjà signalé cette annonce. Notre équipe va l'examiner." };
  }
  if (error?.code === INSUFFICIENT_PRIVILEGE) {
    return { status: "unauthorized", message: "Vous ne pouvez pas signaler cette annonce." };
  }
  if (error) {
    console.error("Signalement impossible", error.code, error.message);
    return { status: "error", message: "Le signalement n'a pas pu être envoyé. Réessayez dans quelques instants." };
  }

  revalidatePath(`/annonces/${listingId}`);
  return {
    status: "success",
    message: "Merci, votre signalement a été envoyé. Notre équipe va examiner l'annonce.",
  };
}
