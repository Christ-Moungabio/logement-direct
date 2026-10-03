// Numéros WhatsApp du Congo-Brazzaville, stockés au format +242XXXXXXXXX.

const STORED_FORMAT = /^\+242\d{9}$/;

/**
 * Normalise une saisie libre (« 06 123 45 67 », « +242 06… », « 00242… »).
 * @param {string} input
 * @returns {string | null} Le numéro au format +242XXXXXXXXX, ou null s'il est invalide.
 */
export function normalizeWhatsappNumber(input) {
  if (typeof input !== "string") return null;

  let digits = input.replace(/[\s.\-()]/g, "");
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  if (digits.startsWith("242")) digits = `+${digits}`;
  if (!digits.startsWith("+")) digits = `+242${digits}`;

  return STORED_FORMAT.test(digits) ? digits : null;
}

/**
 * @param {string} number Au format +242XXXXXXXXX.
 * @returns {string} Exemple : « +242 06 123 45 67 »
 */
export function formatPhoneNumber(number) {
  const match = /^\+242(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(number);
  if (!match) return number;
  return `+242 ${match.slice(1).join(" ")}`;
}

/**
 * @param {string} number Au format +242XXXXXXXXX.
 * @returns {string} Lien d'appel, exemple : « tel:+242061234567 »
 */
export function buildTelLink(number) {
  return `tel:${number}`;
}

/**
 * Lien WhatsApp avec message pré-rempli.
 * @param {string} number Au format +242XXXXXXXXX.
 * @param {string} message
 * @returns {string}
 */
export function buildWhatsAppLink(number, message) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
