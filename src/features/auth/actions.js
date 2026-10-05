"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "../../lib/supabase/admin";
import { createClient } from "../../lib/supabase/server";
import { destinationForRole, safeNextPath } from "./navigation";
import { fieldErrors, loginSchema, signupSchema } from "./schemas";
import { ACTIVITY_COOKIE } from "./session";

const GENERIC_ERROR = "Une erreur est survenue. Réessayez dans un instant.";
const PHONE_TAKEN = "Ce numéro WhatsApp est déjà utilisé par un autre compte.";
const EMAIL_TAKEN = "Cette adresse e-mail est déjà utilisée par un autre compte.";

const DEFAULT_CITY = "Brazzaville";

function signupValues(formData) {
  return {
    role: formData.get("role") ?? "",
    fullName: formData.get("fullName") ?? "",
    email: formData.get("email") ?? "",
    whatsappNumber: formData.get("whatsappNumber") ?? "",
    terms: formData.get("terms") === "on",
  };
}

export async function signUp(_previousState, formData) {
  const values = signupValues(formData);
  const next = safeNextPath(formData.get("next"));
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { values, errors: fieldErrors(parsed.error) };
  }

  const { role, fullName, email, whatsappNumber, password } = parsed.data;
  const admin = createAdminClient();

  const { data: existing, error: lookupError } = await admin
    .from("profiles")
    .select("id")
    .eq("whatsapp_number", whatsappNumber)
    .maybeSingle();
  if (lookupError) return { values, formError: GENERIC_ERROR };
  if (existing) return { values, errors: { whatsappNumber: [PHONE_TAKEN] } };

  const { data: city } = await admin
    .from("cities")
    .select("id")
    .eq("name", DEFAULT_CITY)
    .maybeSingle();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (createError) {
    if (createError.code === "email_exists") return { values, errors: { email: [EMAIL_TAKEN] } };
    if (createError.code === "weak_password") {
      return { values, errors: { password: ["Ce mot de passe est trop simple, choisissez-en un autre."] } };
    }
    return { values, formError: GENERIC_ERROR };
  }

  const userId = created.user.id;
  const { error: profileError } = await admin.from("profiles").insert({
    id: userId,
    full_name: fullName,
    whatsapp_number: whatsappNumber,
    email,
    city_id: city?.id ?? null,
    role,
    terms_accepted_at: new Date().toISOString(),
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(userId);
    if (profileError.code === "23505") return { values, errors: { whatsappNumber: [PHONE_TAKEN] } };
    return { values, formError: GENERIC_ERROR };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) redirect("/connexion");

  redirect(destinationForRole(next, role));
}

const LOGIN_ERROR = "Adresse e-mail ou mot de passe incorrect.";

export async function signIn(_previousState, formData) {
  const values = { email: formData.get("email") ?? "" };
  const next = safeNextPath(formData.get("next"));

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { values, errors: fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    if (error.status === 429) {
      return { values, formError: "Trop de tentatives. Patientez quelques minutes avant de réessayer." };
    }
    return { values, formError: LOGIN_ERROR };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut({ scope: "local" });
    return { values, formError: LOGIN_ERROR };
  }

  redirect(destinationForRole(next, profile.role));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  (await cookies()).delete(ACTIVITY_COOKIE);
  revalidatePath("/", "layout");
  redirect("/");
}
