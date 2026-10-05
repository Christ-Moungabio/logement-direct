export const ROLE_LABELS = {
  tenant: "Locataire",
  owner: "Propriétaire",
  admin: "Administrateur",
};

const HOME_BY_ROLE = {
  owner: "/espace",
  tenant: "/recherche",
  admin: "/admin",
};

export function homeForRole(role) {
  return HOME_BY_ROLE[role] ?? "/";
}

const SPACE_LABELS = {
  owner: "Mon espace",
  tenant: "Rechercher",
  admin: "Administration",
};

export function spaceLinkForRole(role) {
  const href = homeForRole(role);
  if (href === "/") return null;
  return { href, label: SPACE_LABELS[role] };
}

const PROTECTED_PREFIXES = ["/espace", "/mes-annonces", "/admin"];

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

export function signupPath(next) {
  const safe = safeNextPath(next);
  return safe ? `/inscription?next=${encodeURIComponent(safe)}` : "/inscription";
}
