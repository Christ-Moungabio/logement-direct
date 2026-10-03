export const ROLE_LABELS = {
  tenant: "Locataire",
  owner: "Propriétaire",
  admin: "Administrateur",
};

const HOME_BY_ROLE = {
  owner: "/",
  tenant: "/",
  admin: "/",
};

export function homeForRole(role) {
  return HOME_BY_ROLE[role] ?? "/";
}

const PROTECTED_PREFIXES = ["/mes-annonces", "/admin"];

export function isProtectedPath(pathname) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function safeNextPath(value) {
  if (typeof value !== "string" || !value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  return value;
}

export function loginPath(next) {
  const safe = safeNextPath(next);
  return safe ? `/connexion?next=${encodeURIComponent(safe)}` : "/connexion";
}
