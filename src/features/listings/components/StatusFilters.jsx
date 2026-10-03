import Link from "next/link";
import { STATUSES, STATUS_ORDER } from "../status";
import styles from "./Listings.module.css";

export default function StatusFilters({ listings, current }) {
  const counts = Object.fromEntries(STATUS_ORDER.map((status) => [status, 0]));
  listings.forEach((listing) => (counts[listing.status] += 1));

  const tabs = [
    { value: null, label: "Toutes", count: listings.length },
    ...STATUS_ORDER.filter((status) => counts[status] > 0).map((status) => ({
      value: status,
      label: STATUSES[status].label,
      count: counts[status],
    })),
  ];

  return (
    <nav className={styles.filters} aria-label="Filtrer par statut">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.value ? `/mes-annonces?statut=${tab.value}` : "/mes-annonces"}
          className={`${styles.filter} ${tab.value === current ? styles.filterActive : ""}`}
          aria-current={tab.value === current ? "page" : undefined}
        >
          {tab.label} · {tab.count}
        </Link>
      ))}
    </nav>
  );
}
