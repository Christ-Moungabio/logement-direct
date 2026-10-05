import Link from "next/link";
import { formatPrice, formatShortDate } from "../../../../lib/format";
import { STATUSES } from "../../listings/status";
import { restoreListing } from "../actions";
import HideListingForm from "./HideListingForm";
import styles from "./Dashboard.module.css";

const DOT_TONES = {
  published: "fill-success",
  scheduled: "fill-primary",
  hidden: "fill-danger",
  closed: "fill-dark",
};

function Actions({ listing }) {
  if (listing.status === "hidden") {
    return (
      <form action={restoreListing}>
        <input type="hidden" name="listingId" value={listing.id} />
        <button type="submit" className={`${styles.textAction} ${styles.textActionPrimary}`}>
          Réafficher
        </button>
      </form>
    );
  }

  if (listing.status !== "published") return null;

  return (
    <>
      <Link href={`/annonces/${listing.id}`} className={styles.textAction}>
        Voir
      </Link>
      <HideListingForm listingId={listing.id} summaryClassName={`${styles.textAction} ${styles.textActionDanger}`} />
    </>
  );
}

export default function RecentListingsTable({ listings }) {
  return (
    <section aria-labelledby="recent-title" className={`${styles.tableCard} ${styles.tableCardOpen} ${styles.wide}`}>
      <div className={styles.tableHead}>
        <h2 id="recent-title" className={styles.cardTitle}>
          Dernières annonces
        </h2>
        <Link href="/admin/annonces" className={styles.headLink}>
          Toutes les annonces
        </Link>
      </div>

      {listings.length === 0 ? (
        <p className={styles.tableEmpty}>Aucune annonce publiée pour le moment.</p>
      ) : (
        <div className={`${styles.tableScroll} ${styles.tableScrollMobile}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Annonce</th>
                <th scope="col">Propriétaire</th>
                <th scope="col" className={styles.alignRight}>
                  Loyer
                </th>
                <th scope="col">Statut</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id}>
                  <td>
                    <span className={styles.cellStack}>
                      <span className={styles.cellTitle}>{listing.title}</span>
                      <span className={styles.cellMeta}>Publiée le {formatShortDate(listing.publishedAt)}</span>
                    </span>
                  </td>
                  <td className={styles.cellSoft}>{listing.ownerName ?? "Compte supprimé"}</td>
                  <td className={`${styles.alignRight} ${styles.nowrap} ${styles.cellStrong} tabular`}>
                    {listing.rent ? formatPrice(listing.rent) : "—"}
                  </td>
                  <td className={styles.nowrap}>
                    <span className={styles.status}>
                      <span className={`${styles.dot} ${styles[DOT_TONES[listing.status]] ?? ""}`} aria-hidden="true" />
                      {STATUSES[listing.status]?.label ?? listing.status}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    <span className={styles.textActions}>
                      <Actions listing={listing} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
