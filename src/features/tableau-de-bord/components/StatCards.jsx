import Link from "next/link";
import { STATUSES, STATUS_ORDER } from "../../listings/status";
import styles from "./Dashboard.module.css";

export default function StatCards({ listings }) {
  const counts = Object.fromEntries(STATUS_ORDER.map((status) => [status, 0]));
  listings.forEach((listing) => (counts[listing.status] += 1));

  return (
    <ul className={styles.stats}>
      {STATUS_ORDER.map((status) => (
        <li key={status}>
          <Link
            href={`/mes-annonces?statut=${status}`}
            className={`${styles.stat} ${counts[status] === 0 ? styles.statEmpty : ""}`}
          >
            <span className={`${styles.statCount} tabular`}>{counts[status]}</span>
            <span className={styles.statLabel}>{STATUSES[status].label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
