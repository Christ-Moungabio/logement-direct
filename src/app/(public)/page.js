import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { listRecentPublicListings } from "@/features/annonces/queries";
import { formatFcfa } from "@/lib/format";
import { getCurrentUser } from "@/server/auth";

const ROLE_LABELS = {
  tenant: "locataire",
  owner: "propriétaire",
  admin: "administrateur",
};

// Page d'accueil PROVISOIRE : elle sera remplacée par le module REC (recherche).
// Elle permet d'ouvrir les fiches annonces en attendant.
export default async function Home() {
  const [user, listings] = await Promise.all([
    getCurrentUser(),
    listRecentPublicListings(),
  ]);

  return (
    <div className="mx-auto w-full max-w-page px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Logements à louer
      </h1>

      {user ? (
        <p className="mt-3 text-muted-foreground">
          Vous êtes connecté en tant que{" "}
          <strong className="text-foreground">{user.fullName}</strong> (
          {ROLE_LABELS[user.role]}).
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
          <p className="text-muted-foreground">
            Connectez-vous pour contacter les propriétaires.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/connexion">Se connecter</Link>
          </Button>
        </div>
      )}

      <h2 className="mt-10 mb-4 text-xl font-semibold">
        Annonces en ligne ({listings.length})
      </h2>

      {listings.length === 0 ? (
        <p className="text-muted-foreground">
          Aucune annonce en ligne pour le moment.
        </p>
      ) : (
        <ul className="divide-y rounded-xl border">
          {listings.map((listing) => (
            <li key={listing.id}>
              <Link
                href={`/annonces/${listing.id}`}
                className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-inset"
              >
                <span className="min-w-0">
                  <span className="block font-semibold">{listing.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {listing.city} · {formatFcfa(listing.monthlyRent)} / mois
                  </span>
                </span>
                <ChevronRight
                  className="size-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
