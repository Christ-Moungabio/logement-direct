"use client";

import { useSearchParams } from "next/navigation";
import ListingsExplorer from "./ListingsExplorer";
import { criteriaFromParams } from "../../lib/search";

// Applique les critères de l'adresse (?ville=…&type=…&prix_max=…) à la section Logements.
// La clé recrée l'explorateur quand les paramètres de recherche de l'adresse changent.
export default function ListingsFromUrl({ listings }) {
  const params = useSearchParams();
  return <ListingsExplorer key={params.toString()} listings={listings} initialCriteria={criteriaFromParams(params)} />;
}
