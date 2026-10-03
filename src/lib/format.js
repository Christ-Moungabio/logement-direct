// Formatage français des montants et des dates (ENF-05).

export const APP_TIME_ZONE = "Africa/Brazzaville";

// Espace insécable : le montant et « FCFA » restent sur la même ligne.
const NBSP = " ";

/**
 * Formate un nombre entier avec une espace comme séparateur de milliers.
 * @param {number} value
 * @returns {string} Exemple : « 150 000 »
 */
export function formatNumber(value) {
  const rounded = Math.round(Number(value));
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded).toString();
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

/**
 * @param {number} amount Montant en FCFA.
 * @returns {string} Exemple : « 150 000 FCFA »
 */
export function formatFcfa(amount) {
  return `${formatNumber(amount)}${NBSP}FCFA`;
}

const shortDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: APP_TIME_ZONE,
});

const longDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: APP_TIME_ZONE,
});

const calendarDayFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Formate un horodatage (colonne `timestamptz`) dans le fuseau de Brazzaville.
 * @param {string | Date} value
 * @returns {string} Exemple : « 28 sept. 2026 »
 */
export function formatDate(value) {
  return shortDateFormatter.format(new Date(value));
}

/**
 * Variante avec le mois en toutes lettres.
 * @param {string | Date} value
 * @returns {string} Exemple : « 28 septembre 2026 »
 */
export function formatLongDate(value) {
  return longDateFormatter.format(new Date(value));
}

/**
 * Formate un jour calendaire (colonne `date`, sans fuseau), sans décalage.
 * @param {string} isoDay Au format AAAA-MM-JJ.
 * @returns {string} Exemple : « 13 octobre 2026 »
 */
export function formatCalendarDay(isoDay) {
  return calendarDayFormatter.format(new Date(`${isoDay}T00:00:00Z`));
}

/**
 * Jour courant à Brazzaville, au format AAAA-MM-JJ.
 * @param {Date} [now]
 * @returns {string}
 */
export function todayInBrazzaville(now = new Date()) {
  // Le format en-CA produit directement AAAA-MM-JJ.
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: APP_TIME_ZONE,
  }).format(now);
}
