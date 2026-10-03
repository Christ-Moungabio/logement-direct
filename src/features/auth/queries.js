import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { homeForRole, loginPath } from "./navigation";

// getUser interroge le serveur d'authentification : un compte supprimé ou
// suspendu n'est plus reconnu, contrairement à une simple lecture du cookie.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
});

// Seulement ce qu'il faut pour l'affichage et les droits. Le numéro WhatsApp
// n'est jamais renvoyé ici (RG-13).
export const getCurrentProfile = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return data;
});

// À appeler dans chaque page ou action protégée, pas seulement dans un layout :
// un layout ne se ré-exécute pas à chaque navigation.
export async function requireUser(next) {
  const profile = await getCurrentProfile();
  if (!profile) redirect(loginPath(next));
  return profile;
}

export async function requireRole(roles, next) {
  const profile = await requireUser(next);
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(profile.role)) redirect(homeForRole(profile.role));
  return profile;
}
