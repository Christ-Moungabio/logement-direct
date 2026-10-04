import Link from "next/link";
import { Flag } from "lucide-react";
import { loginPath } from "../../auth/navigation";
import ReportDialog from "./ReportDialog";
import styles from "./ReportDialog.module.css";

// Signalement (EF-FIC-08) : visiteur → invitation à se connecter ;
// locataire → formulaire ; propriétaire ou administrateur → rien (refusé par la RLS).
export default function ReportListing({ listingId, relation, alreadyReported, returnTo }) {
  if (relation === "guest") {
    return (
      <Link href={loginPath(returnTo)} className={styles.trigger}>
        <Flag size={16} aria-hidden="true" />
        Signaler l&apos;annonce
        <span className="visually-hidden"> (connexion requise)</span>
      </Link>
    );
  }

  if (relation !== "tenant") return null;

  return <ReportDialog listingId={listingId} alreadyReported={alreadyReported} />;
}
