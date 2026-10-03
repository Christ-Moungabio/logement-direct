const priceFormatter = new Intl.NumberFormat("fr-FR");

const shortDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: "Africa/Brazzaville",
});

export function formatPrice(amount) {
  return `${priceFormatter.format(amount)} FCFA`;
}

export function formatAmount(amount) {
  return priceFormatter.format(amount);
}

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

export function formatLongDate(isoDate) {
  return longDateFormatter.format(new Date(isoDate));
}

export function formatDayMonth(isoDate) {
  return dayMonthFormatter.format(new Date(isoDate));
}

export function formatAvailability(availability, today = new Date()) {
  if (availability.status !== "available_soon" || new Date(availability.date) <= today) return "Libre";
  return `Bientôt libre le ${formatDayMonth(availability.date)}`;
}
