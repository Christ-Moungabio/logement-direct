export const SITE = {
  name: "Logement Direct",
  description:
    "Annonces de logements à louer au Congo-Brazzaville, publiées directement par les propriétaires. Réservez votre visite en ligne, sans intermédiaire payant.",
};

// Types de biens fixes, créés par l'équipe (cadrage fonctionnel, section 3).
export const PROPERTY_TYPES = [
  { value: "studio", label: "Studio" },
  { value: "chambre", label: "Chambre" },
  { value: "appartement", label: "Appartement" },
  { value: "maison", label: "Maison" },
  { value: "villa", label: "Villa" },
  { value: "local-commercial", label: "Local commercial" },
];

// Villes et quartiers couverts. Liste à compléter avec l'équipe.
export const CITIES = [
  {
    value: "brazzaville",
    label: "Brazzaville",
    districts: ["Poto-Poto", "Moungali", "Bacongo", "Ouenzé", "Talangaï", "Makélékélé", "Mfilou", "Madibou", "Djiri"],
  },
  {
    value: "pointe-noire",
    label: "Pointe-Noire",
    districts: ["Tié-Tié", "Loandjili", "Mpita", "Lumumba", "Mvou-Mvou"],
  },
  {
    value: "dolisie",
    label: "Dolisie",
    districts: [],
  },
];

export function getPropertyTypeLabel(value) {
  return PROPERTY_TYPES.find((type) => type.value === value)?.label ?? value;
}

export function getCityLabel(value) {
  return CITIES.find((city) => city.value === value)?.label ?? value;
}
