import Link from "next/link";
import styles from "./Dashboard.module.css";

const WIDTH = 88;
const HEIGHT = 28;

function sparklinePoints(series) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  return series
    .map((value, index) => {
      const x = 1 + (index * (WIDTH - 2)) / (series.length - 1);
      const y = max === min ? HEIGHT / 2 : HEIGHT - 3 - ((value - min) / (max - min)) * (HEIGHT - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function Kpi({ kpi }) {
  const content = (
    <>
      <span className={styles.kpiLabel}>{kpi.label}</span>
      <span className={styles.kpiRow}>
        <span className={`${styles.kpiValue} ${kpi.tone ? styles[kpi.tone] : ""} tabular`}>{kpi.value}</span>
        {kpi.series && (
          <svg
            width={WIDTH}
            height={HEIGHT}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            fill="none"
            aria-hidden="true"
            className={styles[kpi.seriesTone]}
          >
            <polyline
              points={sparklinePoints(kpi.series)}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <span className={`${styles.kpiNote} ${kpi.noteTone ? styles[kpi.noteTone] : ""}`}>{kpi.note}</span>
    </>
  );

  return kpi.href ? (
    <Link href={kpi.href} className={`${styles.kpi} ${styles.kpiLink}`}>
      {content}
    </Link>
  ) : (
    <div className={styles.kpi}>{content}</div>
  );
}

export default function KpiStrip({ kpis }) {
  return (
    <section aria-label="Indicateurs" className={styles.kpis}>
      {kpis.map((kpi) => (
        <Kpi key={kpi.label} kpi={kpi} />
      ))}
    </section>
  );
}
