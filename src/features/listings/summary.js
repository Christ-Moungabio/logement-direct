function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

export function listingTitle(listing) {
  const type = capitalize(listing.propertyType) || "Logement";
  return listing.neighborhood ? `${type} à ${listing.neighborhood}` : type;
}

const MISSING_PHRASES = {
  type: "le type de bien",
  place: "la ville et le quartier",
  rent: "le loyer",
  advance: "l'avance demandée",
  description: "la description",
  water: "l'eau",
  electricity: "l'électricité",
  availability: "la disponibilité",
  photos: "au moins une photo",
};

export function missingFields(listing) {
  return listing.progress.missing.map((key) => MISSING_PHRASES[key]);
}
