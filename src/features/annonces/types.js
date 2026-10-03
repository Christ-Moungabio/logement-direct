// Formes utilisées par les composants de la fiche. Les composants ne dépendent
// jamais des lignes brutes de la base : la conversion se fait dans queries.js.

/**
 * @typedef {"individual" | "shared" | "none"} UtilityStatus
 * @typedef {"available" | "available_soon"} AvailabilityStatus
 *
 * @typedef {object} ListingPhoto
 * @property {string} url
 * @property {boolean} isPrimary
 * @property {number} sortOrder
 *
 * @typedef {object} ListingDetail
 * @property {string} id
 * @property {string} propertyType
 * @property {string} city
 * @property {string} neighborhood
 * @property {number} monthlyRent
 * @property {number} advanceMonths
 * @property {string} description
 * @property {UtilityStatus} water
 * @property {UtilityStatus} electricity
 * @property {number | null} doorsCount
 * @property {AvailabilityStatus} availability
 * @property {string | null} availableFrom Jour AAAA-MM-JJ, pour « Bientôt libre ».
 * @property {string} publishedAt
 * @property {string} updatedAt
 * @property {ListingPhoto[]} photos Photo principale en premier, puis par ordre.
 *
 * @typedef {"guest" | "owner" | "tenant" | "other"} ViewerRelation
 *
 * @typedef {object} ListingContact
 * @property {string} ownerName
 * @property {string} whatsappNumber
 */

export {};
