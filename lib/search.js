export const SEARCH_EVENT = "ndako:recherche";

export const EMPTY_CRITERIA = { type: "", budget: "" };

export function matchesCriteria(listing, { type, budget }) {
  if (type && listing.type !== type) return false;
  if (budget && listing.price > Number(budget)) return false;
  return true;
}

export function criteriaFromParams(params) {
  return {
    type: params.get("type") ?? "",
    budget: params.get("prix_max") ?? "",
  };
}
