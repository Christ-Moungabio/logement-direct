import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/**
 * @typedef {"tenant" | "owner" | "admin"} AccountRole
 *
 * @typedef {object} CurrentUser
 * @property {string} id
 * @property {string} fullName
 * @property {AccountRole} role
 */

/**
 * Renvoie l'utilisateur connecté et son rôle (lu dans `profiles`), ou `null`.
 * Mis en cache pour la durée de la requête : la page et ses métadonnées
 * peuvent l'appeler sans requête supplémentaire.
 *
 * @returns {Promise<CurrentUser | null>}
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", userId)
    .maybeSingle();

  // Un compte Auth sans profil n'a pas fini son inscription : on le traite
  // comme un visiteur, car la RLS et les fonctions SQL exigent un profil.
  if (profileError || !profile) {
    return null;
  }

  return { id: profile.id, fullName: profile.full_name, role: profile.role };
});
