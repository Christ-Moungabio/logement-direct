import { Flag, FlagOff } from "lucide-react";
import Link from "next/link";

import { loginUrl } from "@/lib/navigation";

import { ReportDialog } from "./report-dialog";

const linkClassName =
  "inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none";

/**
 * Accès au signalement (EF-FIC-08) selon l'utilisateur :
 * visiteur → invitation à se connecter ; locataire → formulaire ;
 * propriétaire ou administrateur → rien (la RLS le refuserait).
 *
 * @param {{ listingId: string, relation: import("../types").ViewerRelation, alreadyReported: boolean, returnTo: string }} props
 */
export function ReportListing({
  listingId,
  relation,
  alreadyReported,
  returnTo,
}) {
  if (relation === "guest") {
    return (
      <Link href={loginUrl(returnTo)} className={linkClassName}>
        <Flag className="size-4" aria-hidden="true" />
        Signaler l&apos;annonce
        <span className="sr-only"> (connexion requise)</span>
      </Link>
    );
  }

  if (relation !== "tenant") return null;

  if (alreadyReported) {
    return (
      <p className="inline-flex min-h-11 items-center gap-2 px-3 text-sm text-muted-foreground">
        <FlagOff className="size-4" aria-hidden="true" />
        Vous avez signalé cette annonce
      </p>
    );
  }

  return (
    <ReportDialog listingId={listingId} triggerClassName={linkClassName} />
  );
}
