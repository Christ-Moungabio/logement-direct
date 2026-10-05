import Link from "next/link";
import styles from "./Dashboard.module.css";

export default function CreatedChart({ chart, periods, current }) {
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
          {periods.map((item) => (
            <Link
              key={item.value}
              href={item.href}
              scroll={false}
              className={`${styles.segment} ${item.value === current ? styles.segmentActive : ""}`}
              aria-current={item.value === current ? "true" : undefined}
            >
              {item.label}
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
