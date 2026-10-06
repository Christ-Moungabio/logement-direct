export const SORTS = {
  recent: { label: "Plus récentes", param: null },
  loyer_croissant: { label: "Loyer croissant", param: "loyer-croissant" },
  loyer_decroissant: { label: "Loyer décroissant", param: "loyer-decroissant" },
};

export function sortFromParam(param) {
  const match = Object.entries(SORTS).find(([, sort]) => sort.param === param);
  return match ? match[0] : "recent";
}

function normalize(text) {
  return (text ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function matchesQuery(listing, query) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalize([listing.propertyType, listing.neighborhood, listing.city].filter(Boolean).join(" "));
  return words.every((word) => haystack.includes(word));
}

export function sortListings(listings, sort) {
  if (sort === "recent") return listings;
  const direction = sort === "loyer_croissant" ? 1 : -1;
  return [...listings].sort((a, b) => {
    if (a.rent == null && b.rent == null) return 0;
    if (a.rent == null) return 1;
    if (b.rent == null) return -1;
    return (a.rent - b.rent) * direction;
  });
}

export function listingsHref({ statut, q, sort }) {
  const params = new URLSearchParams();
  if (statut) params.set("statut", statut);
  if (q) params.set("q", q);
  if (sort && SORTS[sort].param) params.set("tri", SORTS[sort].param);
  const query = params.toString();
  return query ? `/mes-annonces?${query}` : "/mes-annonces";
}
