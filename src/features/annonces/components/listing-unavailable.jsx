import { SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Écran « Annonce indisponible » (EF-FIC-07). Volontairement identique pour
 * tous les cas (inexistante, brouillon, fermée, masquée…) : il ne révèle ni la
 * raison ni le contenu de l'annonce.
 */
export function ListingUnavailable() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center sm:py-24">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted">
        <SearchX className="size-7 text-muted-foreground" aria-hidden="true" />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">
        Annonce indisponible
      </h1>
      <p className="text-muted-foreground">
        Cette annonce n&apos;existe pas ou n&apos;est plus en ligne.
        D&apos;autres logements vous attendent peut-être.
      </p>
      <Button asChild size="lg" className="mt-2">
        <Link href="/">Rechercher un logement</Link>
      </Button>
    </div>
  );
}
