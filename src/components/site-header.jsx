import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/actions";
import { getCurrentUser } from "@/server/auth";

const ROLE_LABELS = {
  tenant: "Locataire",
  owner: "Propriétaire",
  admin: "Administrateur",
};

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 w-full max-w-page items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-full text-lg font-semibold focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span
            className="size-8 shrink-0 rounded-full bg-primary"
            aria-hidden="true"
          />
          <span className="whitespace-nowrap">Logement Direct</span>
        </Link>

        {user ? (
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <p className="hidden min-w-0 text-right text-sm leading-tight sm:block">
              <span className="block truncate font-semibold">
                {user.fullName}
              </span>
              <span className="text-muted-foreground">
                {ROLE_LABELS[user.role]}
              </span>
            </p>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Se déconnecter</span>
              </Button>
            </form>
          </div>
        ) : (
          <nav aria-label="Compte" className="flex items-center gap-1 sm:gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/connexion">Connexion</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/inscription">Créer un compte</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
