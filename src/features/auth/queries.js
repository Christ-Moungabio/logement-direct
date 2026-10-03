import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { homeForRole, loginPath } from "./navigation";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
});

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
