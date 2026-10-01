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

// "2026-09-28" → "28 sept."
export function formatShortDate(isoDate) {
  return shortDateFormatter.format(new Date(isoDate));
}
