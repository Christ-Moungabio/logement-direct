"use server";

// Connexion minimale, PROVISOIRE : elle permet de tester la fiche annonce en
// attendant le module AUTH (inscription, règles de mot de passe, session).

import { redirect } from "next/navigation";
import { z } from "zod";

import { whatsappToAuthEmail } from "@/lib/auth-identity";
import { safeRedirectPath } from "@/lib/navigation";
import { normalizeWhatsappNumber } from "@/lib/phone";
import { createClient } from "@/lib/supabase/server";

const signInSchema = z.object({
  whatsappNumber: z
    .string()
    .transform((value) => normalizeWhatsappNumber(value))
    .refine((value) => value !== null, {
      message:
        "Saisissez un numéro WhatsApp du Congo, par exemple 06 123 45 67.",
    }),
  password: z.string().min(1, "Saisissez votre mot de passe."),
  redirectTo: z.string().optional(),
});

/**
 * @typedef {{ status: "idle" | "error", message?: string }} SignInState
 */

/**
 * @param {SignInState} _previousState
 * @param {FormData} formData
 * @returns {Promise<SignInState>}
 */
export async function signIn(_previousState, formData) {
  const parsed = signInSchema.safeParse({
    whatsappNumber: formData.get("whatsappNumber") ?? "",
    password: formData.get("password") ?? "",
    redirectTo: formData.get("redirectTo") ?? undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const { whatsappNumber, password, redirectTo } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: whatsappToAuthEmail(whatsappNumber),
    password,
  });

  if (error) {
    return {
      status: "error",
      message: "Numéro WhatsApp ou mot de passe incorrect.",
    };
  }

  redirect(safeRedirectPath(redirectTo));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
