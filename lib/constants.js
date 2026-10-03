export const SITE = {
  name: "Ndako",
  description:
    "Annonces de logements à louer au Congo-Brazzaville, publiées directement par les propriétaires. Contactez-les directement et réservez votre visite sans intermédiaire payant.",
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

// Villes et quartiers couverts. V1 : Brazzaville seule (cadrage SPEC section 1.1,
// « les personnes qui cherchent un logement à Brazzaville... »). Pointe-Noire
// pourra s'ajouter ici plus tard ; tant qu'il n'y a qu'une ville, aucun
// sélecteur de ville n'est affiché (voir HeroSearch et ListingsExplorer).
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

// Eau et électricité (EF-ANN-04). Clés alignées sur l'enum Supabase
// utility_status ("individual" | "shared" | "none", migration schema_initial.sql).
export const UTILITY_LABELS = {
  individual: "Oui, individuel",
  shared: "Oui, partagé",
  none: "Non",
};
