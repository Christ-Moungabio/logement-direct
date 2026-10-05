import { REPORT_REASON_LABELS } from "../../annonces/labels";
import { logTime } from "../dashboard";
import styles from "./Dashboard.module.css";

function Entry({ entry }) {
  const who = entry.handlerName ?? "Un administrateur";
  const what = entry.listingTitle ?? "une annonce supprimée";

  if (entry.decision === "resolved") {
    return (
      <>
        <strong>{who}</strong> a masqué <strong>{what}</strong>
        {entry.hiddenReason && <span className={styles.logDetail}>« {entry.hiddenReason} »</span>}
      </>
    );
  }

  return (
    <>
      <strong>{who}</strong> a rejeté un signalement sur <strong>{what}</strong>
      <span className={styles.logDetail}>Motif signalé : {REPORT_REASON_LABELS[entry.reason]}</span>
    </>
  );
}

export default function ModerationLog({ entries }) {
  return (
    <section aria-labelledby="log-title" className={styles.tableCard}>
      <div className={styles.tableHead}>
        <h2 id="log-title" className={styles.cardTitle}>
          Journal de modération
        </h2>
      </div>

      {entries.length === 0 ? (
        <p className={styles.tableEmpty}>Aucune décision pour le moment.</p>
      ) : (
        <ol className={styles.log}>
          {entries.map((entry) => (
            <li key={entry.id} className={styles.logEntry}>
              <time dateTime={entry.handledAt} className={`${styles.logTime} tabular`}>
                {logTime(entry.handledAt)}
              </time>
              <p className={styles.logText}>
                <Entry entry={entry} />
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
