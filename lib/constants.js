export const SITE = {
  name: "Ndako",
  description:
    "Annonces de logements à louer au Congo-Brazzaville, publiées directement par les propriétaires. Contactez-les directement et réservez votre visite sans intermédiaire payant.",
};

export const PROPERTY_TYPES = [
  { value: "studio", label: "Studio" },
  { value: "chambre", label: "Chambre" },
  { value: "appartement", label: "Appartement" },
  { value: "maison", label: "Maison" },
  { value: "villa", label: "Villa" },
  { value: "local-commercial", label: "Local commercial" },
];

export const CITIES = [
  {
    value: "brazzaville",
    label: "Brazzaville",
    districts: ["Poto-Poto", "Moungali", "Bacongo", "Ouenzé", "Talangaï", "Makélékélé", "Mfilou", "Madibou", "Djiri"],
  },
];

export function getPropertyTypeLabel(value) {
  return PROPERTY_TYPES.find((type) => type.value === value)?.label ?? value;
}

export function getCityLabel(value) {
  return CITIES.find((city) => city.value === value)?.label ?? value;
}

export const UTILITY_LABELS = {
  individual: "Oui, individuel",
  shared: "Oui, partagé",
  none: "Non",
};
