export const REPORT_REASONS = ["false_information", "already_rented", "scam", "other"];

export const REPORT_REASON_LABELS = {
  false_information: "Informations fausses ou trompeuses",
  already_rented: "Logement déjà loué",
  scam: "Arnaque ou demande d'argent suspecte",
  other: "Autre motif",
};

// Les types de bien sont stockés en minuscules (« local commercial »).
export function propertyTypeLabel(name) {
  return name.charAt(0).toLocaleUpperCase("fr-FR") + name.slice(1);
}

export function monthsLabel(months) {
  return `${months} mois`;
}
