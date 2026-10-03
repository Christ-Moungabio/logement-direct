import { z } from "zod";

export const PAGE_SIZE = 9;
export const SORT_OPTIONS = ["recent", "prix-asc", "prix-desc"];

function emptyToUndefined(value) {
  return value === "" ? undefined : value;
}

// Accepte ?quartiers=a,b ou ?quartiers=a&quartiers=b
function toArray(value) {
  if (value === undefined || value === "") return [];
  return Array.isArray(value) ? value : String(value).split(",");
}

const amount = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().positive().optional(),
);

// Chaque champ a un .catch : une valeur invalide dans l'URL est ignorée
// au lieu de faire planter la page.
const searchFiltersSchema = z.object({
  ville: z
    .preprocess(emptyToUndefined, z.string().uuid().optional())
    .catch(undefined),
  quartiers: z.preprocess(toArray, z.array(z.string().uuid())).catch([]),
  types: z
    .preprocess(toArray, z.array(z.coerce.number().int().positive()))
    .catch([]),
  loyerMin: amount.catch(undefined),
  loyerMax: amount.catch(undefined),
  tri: z.enum(SORT_OPTIONS).catch("recent"),
  page: z.coerce.number().int().min(1).catch(1),
});

export function parseSearchParams(raw) {
  const filters = searchFiltersSchema.parse(raw);

  const error =
    filters.loyerMin !== undefined &&
    filters.loyerMax !== undefined &&
    filters.loyerMin > filters.loyerMax
      ? "Le loyer minimum ne peut pas dépasser le maximum."
      : null;

  return { filters, error };
}