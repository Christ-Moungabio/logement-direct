function brazzavilleToday() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Brazzaville" });
}

// Ce qu'il faut pour publier : mêmes règles que la base, affichées une par une au propriétaire.
export function publishChecklist(listing, photoCount) {
  const soonDateOk =
    listing.availability === "available" ||
    (listing.availability === "available_soon" &&
      Boolean(listing.available_from) &&
      listing.available_from > brazzavilleToday());

  return [
    { key: "type", label: "Type de bien", done: Boolean(listing.property_type_id) },
    { key: "place", label: "Ville et quartier", done: Boolean(listing.city_id && listing.neighborhood_id) },
    { key: "rent", label: "Loyer", done: Boolean(listing.monthly_rent) },
    { key: "advance", label: "Avance demandée", done: Boolean(listing.advance_months) },
    { key: "description", label: "Description", done: Boolean(listing.description?.trim()) },
    { key: "water", label: "Eau", done: Boolean(listing.water) },
    { key: "electricity", label: "Électricité", done: Boolean(listing.electricity) },
    { key: "availability", label: "Disponibilité", done: soonDateOk },
    { key: "photos", label: "Au moins une photo", done: photoCount > 0 },
  ];
}

export function isReadyToPublish(listing, photoCount) {
  return publishChecklist(listing, photoCount).every((item) => item.done);
}
