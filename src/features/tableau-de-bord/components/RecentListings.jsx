import Link from "next/link";
import { formatPrice } from "../../../../lib/format";
import StatusBadge from "../../listings/components/StatusBadge";
import { listingTitle } from "../../listings/summary";
import styles from "./Dashboard.module.css";

const SHOWN = 3;

export default function RecentListings({ listings }) {
  return (
    <section className={styles.card} aria-labelledby="recent-title">
      <div className={styles.cardHead}>
        <h2 id="recent-title" className="text-heading-md">
          Mes dernières annonces
        </h2>
        <Link href="/mes-annonces" className={styles.link}>
          Voir toutes mes annonces
        </Link>
      </div>

      {listings.length === 0 ? (
        <p className="text-body-md">Vous n&apos;avez pas encore d&apos;annonce.</p>
      ) : (
        <ul className={styles.recent}>
          {listings.slice(0, SHOWN).map((listing) => (
            <li key={listing.id} className={styles.recentRow}>
              <div>
                <p className="text-heading-sm">{listingTitle(listing)}</p>
                <p className="text-caption-sm tabular">{listing.rent ? formatPrice(listing.rent) : "Loyer à renseigner"}</p>
              </div>
              <StatusBadge status={listing.status} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
