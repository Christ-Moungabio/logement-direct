import { SITE } from "../../../lib/constants";
import { formatPrice } from "../../../lib/format";

export function todayInBrazzaville(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Africa/Brazzaville",
  }).format(now);
}

export function computeAdvanceAmount(monthlyRent, advanceMonths) {
  return monthlyRent * advanceMonths;
}

// Le cron de la base bascule « Bientôt libre » en « Libre » chaque minute ;
// on applique la même règle ici s'il a du retard (RG-12).
export function getEffectiveAvailability({ availability, availableFrom }, today = todayInBrazzaville()) {
  if (availability === "available_soon" && availableFrom && availableFrom > today) {
    return { status: "available_soon", from: availableFrom };
  }
  return { status: "available" };
}

export function buildListingTitle({ propertyType, neighborhood }) {
  return `${propertyType} à ${neighborhood}`;
}

export function buildListingPageTitle(listing) {
  return `${buildListingTitle(listing)} · ${formatPrice(listing.monthlyRent)}/mois`;
}

export function buildContactMessage(listing, listingUrl) {
  return (
    `Bonjour, je vous contacte au sujet de votre annonce sur ${SITE.name} : ` +
    `${buildListingPageTitle(listing)}. ${listingUrl}\n` +
    `Le logement est-il toujours disponible ?`
  );
}
