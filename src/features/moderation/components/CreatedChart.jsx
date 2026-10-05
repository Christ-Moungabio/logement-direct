import Link from "next/link";
import { PERIODS } from "../dashboard";
import styles from "./Dashboard.module.css";

function periodHref(param) {
  return param ? `/admin?periode=${param}` : "/admin";
}

export default function CreatedChart({ chart, period }) {
  const last = chart.bars[chart.bars.length - 1];

  return (
    <section aria-labelledby="created-title" className={`${styles.card} ${styles.wide}`}>
      <div className={styles.cardHead}>
        <div>
          <h2 id="created-title" className={styles.cardTitle}>
            Annonces créées
          </h2>
          <p className={styles.chartTotal}>
            <span className="tabular">{chart.total}</span> {chart.caption}
          </p>
        </div>
        <nav aria-label="Période" className={styles.segmented}>
          {Object.entries(PERIODS).map(([value, { label, param }]) => (
            <Link
              key={value}
              href={periodHref(param)}
              scroll={false}
              className={`${styles.segment} ${value === period ? styles.segmentActive : ""}`}
              aria-current={value === period ? "true" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div
        className={styles.chart}
        role="img"
        aria-label={`${chart.total} annonces créées ${chart.caption}. ${last.tip}.`}
      >
        {chart.ticks.map((tick) => (
          <span key={tick} className={styles.gridLine} style={{ bottom: `${(tick / chart.top) * 100}%` }}>
            <span className={`${styles.gridLabel} tabular`}>{tick}</span>
          </span>
        ))}
        <div className={styles.bars}>
          {chart.bars.map((bar, index) => {
            const isLast = index === chart.bars.length - 1;
            return (
              <span key={bar.key} className={styles.barSlot} title={bar.tip}>
                <span
                  className={`${styles.bar} ${bar.count === 0 ? styles.barEmpty : isLast ? styles.barLast : ""}`}
                  style={bar.count === 0 ? undefined : { height: `${(bar.count / chart.top) * 100}%` }}
                />
              </span>
            );
          })}
        </div>
      </div>
      <div className={styles.axis} aria-hidden="true">
        {chart.labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </section>
  );
}
