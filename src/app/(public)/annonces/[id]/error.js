"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ListingError({ reset }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-16 text-center sm:py-24">
      <h1 className="text-2xl font-semibold tracking-tight">
        Impossible d&apos;afficher l&apos;annonce
      </h1>
      <p className="text-muted-foreground">
        Un problème technique est survenu. Vérifiez votre connexion puis
        réessayez.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={() => reset()}>
          <RotateCcw aria-hidden="true" />
          Réessayer
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Rechercher un logement</Link>
        </Button>
      </div>
    </div>
  );
}
