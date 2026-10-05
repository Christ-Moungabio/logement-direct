import styles from "./Dashboard.module.css";

export default function StatusBreakdown({ breakdown }) {
  return (
    <section aria-labelledby="statuses-title" className={styles.card}>
      <div className={styles.cardHead}>
        <h2 id="statuses-title" className={styles.cardTitle}>
          Statuts des annonces
        </h2>
        <span className={`${styles.cardMeta} tabular`}>{breakdown.total} au total</span>
      </div>

      <div className={styles.stack} aria-hidden="true">
        {breakdown.rows
          .filter((row) => row.count > 0)
          .map((row) => (
            <span key={row.key} className={styles[`fill-${row.tone}`]} style={{ flexGrow: row.count }} />
          ))}
      </div>

      <table className={styles.statusTable}>
        <tbody>
          {breakdown.rows.map((row) => (
            <tr key={row.key} className={row.count === 0 ? styles.muted : undefined}>
              <th scope="row">
                <span className={`${styles.swatch} ${styles[`fill-${row.tone}`]}`} aria-hidden="true" />
                {row.label}
              </th>
              <td className="tabular">{row.count}</td>
              <td className={`${styles.percent} tabular`}>{row.percent} %</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
