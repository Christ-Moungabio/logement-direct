/**
 * Valide une URL de retour après connexion : seuls les chemins internes sont
 * acceptés, pour éviter une redirection ouverte vers un autre site.
 *
 * @param {unknown} value
 * @param {string} [fallback]
 * @returns {string}
 */
export function safeRedirectPath(value, fallback = "/") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\") || /[\u0000-\u001f]/.test(value)) return fallback;
  return value;
}

/**
 * @param {string} returnTo Chemin de la page à rouvrir après connexion.
 * @returns {string}
 */
export function loginUrl(returnTo) {
  return `/connexion?redirect=${encodeURIComponent(returnTo)}`;
}

/**
 * @param {string} returnTo Chemin de la page à rouvrir après inscription.
 * @returns {string}
 */
export function signupUrl(returnTo) {
  return `/inscription?redirect=${encodeURIComponent(returnTo)}`;
}
