"use client";

import { useSearchParams } from "next/navigation";
import ListingsExplorer from "./ListingsExplorer";
import { criteriaFromParams } from "../../lib/search";

export default function ListingsFromUrl({ listings }) {
  const params = useSearchParams();
  return <ListingsExplorer key={params.toString()} listings={listings} initialCriteria={criteriaFromParams(params)} />;
}
