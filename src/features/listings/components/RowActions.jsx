import Button from "../../../../components/ui/Button";
import { closeListing, deleteListing, withdrawListing } from "../actions";
import { CLOSE_REASONS } from "../status";
import styles from "./Listings.module.css";

function ConfirmPanel({ label, children }) {
  return (
    <details className={styles.confirm}>
      <summary className={styles.confirmSummary}>{label}</summary>
      <div className={styles.confirmBody}>{children}</div>
    </details>
  );
}

function DeleteAction({ id }) {
  return (
    <ConfirmPanel label="Supprimer">
      <form action={deleteListing} className={styles.confirmForm}>
        <input type="hidden" name="id" value={id} />
        <p className="text-body-sm">Cette annonce et ses photos seront supprimées définitivement.</p>
        <Button type="submit" size="sm" variant="secondary">
          Confirmer la suppression
        </Button>
      </form>
    </ConfirmPanel>
  );
}

export default function RowActions({ listing }) {
  const editHref = `/mes-annonces/${listing.id}/modifier`;

  switch (listing.status) {
    case "published":
      return (
        <div className={styles.actions}>
          <Button href={editHref} size="sm" variant="secondary">
            Modifier
          </Button>
          <ConfirmPanel label="Fermer">
            <form action={closeListing} className={styles.confirmForm}>
              <input type="hidden" name="id" value={listing.id} />
              <label className="text-body-sm" htmlFor={`reason-${listing.id}`}>
                Pourquoi fermer cette annonce ?
              </label>
              <select id={`reason-${listing.id}`} name="reason" className={styles.select} defaultValue="rented">
                {Object.entries(CLOSE_REASONS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <Button type="submit" size="sm">
                Fermer l&apos;annonce
              </Button>
            </form>
          </ConfirmPanel>
        </div>
      );
    case "scheduled":
      return (
        <div className={styles.actions}>
          <Button href={editHref} size="sm" variant="secondary">
            Modifier
          </Button>
          <form action={withdrawListing}>
            <input type="hidden" name="id" value={listing.id} />
            <Button type="submit" size="sm" variant="ghost">
              Retirer
            </Button>
          </form>
        </div>
      );
    case "draft":
      return (
        <div className={styles.actions}>
          <Button href={editHref} size="sm" variant="secondary">
            Continuer
          </Button>
          <DeleteAction id={listing.id} />
        </div>
      );
    case "closed":
      return (
        <div className={styles.actions}>
          <DeleteAction id={listing.id} />
        </div>
      );
    default:
      return null;
  }
}
