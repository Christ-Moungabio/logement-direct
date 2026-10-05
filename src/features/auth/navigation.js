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

const ROLE_BY_PREFIX = {
  "/espace": "owner",
  "/mes-annonces": "owner",
  "/admin": "admin",
};

function protectedPrefix(pathname) {
  return Object.keys(ROLE_BY_PREFIX).find(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isProtectedPath(pathname) {
  return Boolean(protectedPrefix(pathname));
}

export function safeNextPath(value) {
  if (typeof value !== "string" || !value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  return value;
}

export function destinationForRole(next, role) {
  const safe = safeNextPath(next);
  if (!safe) return homeForRole(role);
  const prefix = protectedPrefix(safe.split(/[?#]/)[0]);
  return prefix && ROLE_BY_PREFIX[prefix] !== role ? homeForRole(role) : safe;
}

export function loginPath(next) {
  const safe = safeNextPath(next);
  return safe ? `/connexion?next=${encodeURIComponent(safe)}` : "/connexion";
}

export function signupPath(next) {
  const safe = safeNextPath(next);
  return safe ? `/inscription?next=${encodeURIComponent(safe)}` : "/inscription";
}
