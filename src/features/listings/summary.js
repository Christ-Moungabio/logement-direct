function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

export function listingTitle(listing) {
  const type = capitalize(listing.propertyType) || "Logement";
  return listing.neighborhood ? `${type} à ${listing.neighborhood}` : type;
}

export function missingFields(listing) {
  const missing = [];
  if (listing.photoCount === 0) missing.push("photos");
  if (!listing.hasDescription) missing.push("description");
  if (!listing.rent) missing.push("loyer");
  if (!listing.neighborhood) missing.push("quartier");
  return missing;
}
