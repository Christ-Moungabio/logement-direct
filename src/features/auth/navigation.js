export const ROLE_LABELS = {
  tenant: "Locataire",
  owner: "Propriétaire",
  admin: "Administrateur",
};

// Pages d'arrivée après connexion (CA-02.1) : Mes annonces pour un
// propriétaire, la recherche pour un locataire, l'administration pour un admin.
// Ces pages n'existent pas encore, tout mène à l'accueil en attendant.
const HOME_BY_ROLE = {
  owner: "/",
  tenant: "/",
  admin: "/",
};

export function homeForRole(role) {
  return HOME_BY_ROLE[role] ?? "/";
}

// Espace connecté : un visiteur sans session est renvoyé vers la connexion.
const PROTECTED_PREFIXES = ["/mes-annonces", "/admin"];

export function isProtectedPath(pathname) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// N'accepte que des chemins internes : "//site.com" ou "/\site.com" mèneraient ailleurs.
export function safeNextPath(value) {
  if (typeof value !== "string" || !value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  return value;
}

export function loginPath(next) {
  const safe = safeNextPath(next);
  return safe ? `/connexion?next=${encodeURIComponent(safe)}` : "/connexion";
}
