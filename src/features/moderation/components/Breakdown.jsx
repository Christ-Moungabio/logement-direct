import Link from "next/link";
import styles from "./Dashboard.module.css";

export default function Breakdown({ breakdown, views, current }) {
  return (
    <section aria-labelledby="breakdown-title" className={styles.card}>
      <div className={styles.cardHead}>
        <div>
          <h2 id="breakdown-title" className={styles.cardTitle}>
            Répartition
          </h2>
          <p className={styles.cardCaption}>{breakdown.caption}</p>
        </div>
        <nav aria-label="Répartition par" className={styles.segmented}>
          {views.map((view) => (
            <Link
              key={view.value}
              href={view.href}
              scroll={false}
              className={`${styles.segment} ${view.value === current ? styles.segmentActive : ""}`}
              aria-current={view.value === current ? "true" : undefined}
            >
              {view.label}
            </Link>
          ))}
        </nav>
      </div>

      {breakdown.total === 0 ? (
        <p className={styles.cardEmpty}>{breakdown.empty}</p>
      ) : (
        <ul className={styles.breakdown}>
          {breakdown.rows.map((row) => (
            <li key={row.key}>
              <span className={styles.breakdownLine}>
                <span>{row.label}</span>
                <span className={`${styles.breakdownCount} tabular`}>{row.count}</span>
              </span>
              <span className={styles.breakdownTrack} aria-hidden="true">
                <span className={styles.breakdownFill} style={{ width: row.width }} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
