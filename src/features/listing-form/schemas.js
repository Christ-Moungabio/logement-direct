import { z } from "zod";

const UTILITIES = ["individual", "shared", "none"];

function emptyToUndefined(value) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

function optional(schema) {
  return z.preprocess(emptyToUndefined, schema.optional());
}

function brazzavilleToday() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Brazzaville" });
}

// Un brouillon peut être incomplet : tout est facultatif, mais ce qui est rempli doit être valide.
export const draftSchema = z
  .object({
    propertyTypeId: optional(z.coerce.number({ error: "Choisissez un type de bien." }).int().positive()),
    cityId: optional(z.string().uuid("Choisissez une ville.")),
    neighborhoodId: optional(z.string().uuid("Choisissez un quartier.")),
    monthlyRent: optional(
      z.preprocess(
        (value) => (typeof value === "string" ? value.replace(/\s/g, "") : value),
        z.coerce
          .number({ error: "Indiquez le loyer en chiffres." })
          .int("Indiquez le loyer en chiffres.")
          .positive("Le loyer doit être supérieur à 0."),
      ),
    ),
    advanceMonths: optional(
      z.coerce
        .number({ error: "Indiquez un nombre de mois." })
        .int()
        .min(1, "L'avance va de 1 à 6 mois.")
        .max(6, "L'avance va de 1 à 6 mois."),
    ),
    description: optional(z.string().trim().max(2000, "2000 caractères maximum.")),
    water: optional(z.enum(UTILITIES, { error: "Choisissez une option." })),
    electricity: optional(z.enum(UTILITIES, { error: "Choisissez une option." })),
    doorsCount: optional(
      z.coerce.number({ error: "Indiquez un nombre." }).int("Indiquez un nombre entier.").min(0, "Indiquez un nombre positif."),
    ),
    availability: optional(z.enum(["available", "available_soon"], { error: "Choisissez une option." })),
    availableFrom: optional(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Indiquez une date valide.")),
  })
  .superRefine((data, ctx) => {
    if (data.neighborhoodId && !data.cityId) {
      ctx.addIssue({ code: "custom", path: ["cityId"], message: "Choisissez d'abord la ville." });
    }
    if (data.availability === "available_soon") {
      if (!data.availableFrom) {
        ctx.addIssue({ code: "custom", path: ["availableFrom"], message: "Indiquez la date de disponibilité." });
      } else if (data.availableFrom <= brazzavilleToday()) {
        ctx.addIssue({ code: "custom", path: ["availableFrom"], message: "La date doit être dans le futur." });
      }
    }
  });

export function fieldErrors(error) {
  return z.flattenError(error).fieldErrors;
}

const REQUIRED_FIELDS = [
  "propertyTypeId",
  "cityId",
  "neighborhoodId",
  "monthlyRent",
  "advanceMonths",
  "description",
  "water",
  "electricity",
  "availability",
];

// Une annonce déjà en ligne doit rester complète, seul le nombre de portes est facultatif.
export function missingFieldErrors(data) {
  const errors = {};
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined) errors[field] = ["Ce champ est obligatoire."];
  }
  return errors;
}
