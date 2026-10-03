// Libellés français des valeurs de la base.

/** @type {Record<import("./types").UtilityStatus, string>} */
export const UTILITY_LABELS = {
  individual: "Oui, individuel",
  shared: "Oui, partagé",
  none: "Non",
};

/** @type {Record<import("./types").ReportReason, string>} */
export const REPORT_REASON_LABELS = {
  false_information: "Informations fausses ou trompeuses",
  already_rented: "Logement déjà loué",
  scam: "Arnaque ou demande d'argent suspecte",
  other: "Autre motif",
};

export const REPORT_REASONS = /** @type {const} */ ([
  "false_information",
  "already_rented",
  "scam",
  "other",
]);

/**
 * Les types de bien sont stockés en minuscules (« local commercial »).
 * @param {string} name
 * @returns {string} Exemple : « Local commercial »
 */
export function propertyTypeLabel(name) {
  return name.charAt(0).toLocaleUpperCase("fr-FR") + name.slice(1);
}

/**
 * @param {number} months
 * @returns {string} Exemple : « 3 mois »
 */
export function monthsLabel(months) {
  return `${months} mois`;
}
