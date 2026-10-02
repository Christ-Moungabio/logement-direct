// Recherche sur la page d'accueil : la barre du hero et les filtres de la
// section Logements partagent les mêmes critères.
export const SEARCH_EVENT = "ndako:recherche";

// V1 Brazzaville seule (lib/constants.js) : pas de critère "city" tant qu'il
// n'y a qu'une seule ville. À réintroduire ici (et dans HeroSearch /
// ListingsExplorer) quand une 2e ville s'ajoutera à CITIES.
export const EMPTY_CRITERIA = { type: "", budget: "" };

export function matchesCriteria(listing, { type, budget }) {
  if (type && listing.type !== type) return false;
  if (budget && listing.price > Number(budget)) return false;
  return true;
}

// Mêmes noms de paramètres que le formulaire du hero : type, prix_max.
export function criteriaFromParams(params) {
  return {
    type: params.get("type") ?? "",
    budget: params.get("prix_max") ?? "",
  };
}
