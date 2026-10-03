// Règles de gestion de la fiche annonce, sans dépendance à la base.

import { formatFcfa, todayInBrazzaville } from "@/lib/format";

/**
 * Montant de l'avance : loyer × nombre de mois (RG-06).
 * @param {number} monthlyRent
 * @param {number} advanceMonths
 * @returns {number}
 */
export function computeAdvanceAmount(monthlyRent, advanceMonths) {
  return monthlyRent * advanceMonths;
}

/**
 * Disponibilité à afficher. Le cron de la base bascule « Bientôt libre » en
 * « Libre » chaque minute ; on applique la même règle ici au cas où il aurait
 * du retard (RG-12).
 *
 * @param {{ availability: import("./types").AvailabilityStatus, availableFrom: string | null }} listing
 * @param {string} [today] Jour courant à Brazzaville, AAAA-MM-JJ.
 * @returns {{ status: "available" } | { status: "available_soon", from: string }}
 */
export function getEffectiveAvailability(
  { availability, availableFrom },
  today = todayInBrazzaville(),
) {
  // Les dates AAAA-MM-JJ se comparent correctement comme des chaînes.
  if (
    availability === "available_soon" &&
    availableFrom &&
    availableFrom > today
  ) {
    return { status: "available_soon", from: availableFrom };
  }
  return { status: "available" };
}

/**
 * @param {{ propertyType: string, neighborhood: string }} listing
 * @returns {string} Exemple : « Appartement à Poto-Poto »
 */
export function buildListingTitle({ propertyType, neighborhood }) {
  return `${propertyType} à ${neighborhood}`;
}

/**
 * Titre de la page, sans donnée personnelle.
 * @param {{ propertyType: string, neighborhood: string, monthlyRent: number }} listing
 * @returns {string} Exemple : « Appartement à Bacongo · 150 000 FCFA/mois »
 */
export function buildListingPageTitle(listing) {
  return `${buildListingTitle(listing)} · ${formatFcfa(listing.monthlyRent)}/mois`;
}

/**
 * Message pré-rempli pour WhatsApp.
 * @param {{ propertyType: string, neighborhood: string, monthlyRent: number }} listing
 * @param {string} listingUrl
 * @returns {string}
 */
export function buildContactMessage(listing, listingUrl) {
  return (
    `Bonjour, je vous contacte au sujet de votre annonce sur Logement Direct : ` +
    `${buildListingPageTitle(listing)}. ${listingUrl}\n` +
    `Le logement est-il toujours disponible ?`
  );
}
