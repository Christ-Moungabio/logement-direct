import { z } from "zod";

import { REPORT_REASONS } from "./labels";

export const REPORT_COMMENT_MAX_LENGTH = 500;

// Tout UUID au format 8-4-4-4-12 : z.uuid() refuse certaines versions.
export const listingIdSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "Identifiant d'annonce invalide.",
  );

export const reportSchema = z.object({
  listingId: listingIdSchema,
  reason: z.enum(REPORT_REASONS, {
    error: "Choisissez un motif de signalement.",
  }),
  comment: z
    .string()
    .trim()
    .max(
      REPORT_COMMENT_MAX_LENGTH,
      `Le commentaire ne doit pas dépasser ${REPORT_COMMENT_MAX_LENGTH} caractères.`,
    )
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .default(null),
});
