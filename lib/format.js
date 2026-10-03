const priceFormatter = new Intl.NumberFormat("fr-FR");

const shortDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: "Africa/Brazzaville",
});

// 150000 → "150 000 FCFA"
export function formatPrice(amount) {
  return `${priceFormatter.format(amount)} FCFA`;
}

// 150000 → "150 000"
export function formatAmount(amount) {
  return priceFormatter.format(amount);
}

// "2026-09-28" → "28 sept."
export function formatShortDate(isoDate) {
  return shortDateFormatter.format(new Date(isoDate));
}

const dayMonthFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "Africa/Brazzaville",
});

const longDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeZone: "Africa/Brazzaville",
});

// "2026-10-02" → "2 octobre 2026"
export function formatLongDate(isoDate) {
  return longDateFormatter.format(new Date(isoDate));
}

// "2026-10-15" → "15/10" (format jj/mm de CA-05.2)
export function formatDayMonth(isoDate) {
  return dayMonthFormatter.format(new Date(isoDate));
}

// Disponibilité affichée (RG-12) : « Libre » ou « Bientôt libre le jj/mm ».
// Une date déjà atteinte s'affiche Libre. Statuts alignés sur l'enum Supabase
// availability_status ("available" | "available_soon", migration schema_initial.sql).
export function formatAvailability(availability, today = new Date()) {
  if (availability.status !== "available_soon" || new Date(availability.date) <= today) return "Libre";
  return `Bientôt libre le ${formatDayMonth(availability.date)}`;
}
