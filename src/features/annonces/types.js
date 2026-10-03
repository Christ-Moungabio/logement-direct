// Types du module FIC. Les composants ne dépendent que de ces formes,
// jamais des lignes brutes de la base : la conversion se fait dans queries.js.

/**
 * @typedef {"individual" | "shared" | "none"} UtilityStatus
 * @typedef {"available" | "available_soon"} AvailabilityStatus
 * @typedef {"false_information" | "already_rented" | "scam" | "other"} ReportReason
 */

/**
 * @typedef {object} ListingPhoto
 * @property {string} url URL publique Supabase Storage.
 * @property {boolean} isPrimary
 * @property {number} sortOrder
 */

/**
 * @typedef {object} ListingDetail
 * @property {string} id
 * @property {string} propertyType Libellé affiché, exemple : « Appartement ».
 * @property {string} city
 * @property {string} neighborhood
 * @property {number} monthlyRent En FCFA.
 * @property {number} advanceMonths De 1 à 6.
 * @property {string} description
 * @property {UtilityStatus} water
 * @property {UtilityStatus} electricity
 * @property {number | null} doorsCount Null quand il n'est pas renseigné.
 * @property {AvailabilityStatus} availability
 * @property {string | null} availableFrom Jour AAAA-MM-JJ pour « Bientôt libre ».
 * @property {string} publishedAt Horodatage ISO.
 * @property {string} updatedAt Horodatage ISO.
 * @property {ListingPhoto[]} photos Photo principale en premier, puis par ordre.
 */

/**
 * Relation entre l'utilisateur courant et l'annonce, calculée côté serveur.
 * L'identifiant du propriétaire n'est jamais transmis aux composants.
 *
 * @typedef {"guest" | "owner" | "tenant" | "other"} ViewerRelation
 */

/**
 * Coordonnées du propriétaire, uniquement pour un utilisateur connecté.
 *
 * @typedef {object} ListingContact
 * @property {string} ownerName
 * @property {string} whatsappNumber Au format +242XXXXXXXXX.
 */

/**
 * État renvoyé par la Server Action de signalement.
 *
 * @typedef {object} ReportFormState
 * @property {"idle" | "success" | "already_reported" | "unauthorized" | "invalid" | "error"} status
 * @property {string} [message]
 * @property {Partial<Record<"reason" | "comment", string>>} [fieldErrors]
 */

export {};
