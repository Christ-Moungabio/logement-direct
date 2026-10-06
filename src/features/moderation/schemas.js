import { z } from "zod";

export const HIDE_REASON_MIN_LENGTH = 10;
export const HIDE_REASON_MAX_LENGTH = 500;

export const hideListingSchema = z.object({
  listingId: z.uuid({ error: "Annonce introuvable." }),
  reason: z
    .string()
    .trim()
    .min(HIDE_REASON_MIN_LENGTH, `Expliquez le motif en ${HIDE_REASON_MIN_LENGTH} caractères minimum.`)
    .max(HIDE_REASON_MAX_LENGTH, `Le motif ne doit pas dépasser ${HIDE_REASON_MAX_LENGTH} caractères.`),
});

export const hideFromReportSchema = hideListingSchema.extend({
  reportId: z.uuid({ error: "Signalement introuvable." }),
});
