import { missingFields } from "../summary";
import styles from "./OwnerListings.module.css";

export default function DraftProgress({ listing }) {
  const { done, total, percent } = listing.progress;
  const missing = missingFields(listing);
  const ready = missing.length === 0;

  return (
    <div className={styles.progress}>
      <div className={styles.progressHead}>
        <span>{ready ? "Prête à être publiée" : `Prête à ${done} sur ${total}`}</span>
        <span className="tabular">{percent} %</span>
      </div>
      <div
        role="meter"
        aria-label="Avancement du brouillon"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className={styles.progressTrack}
      >
        <span className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>
      {!ready && <p className={styles.progressMissing}>Il manque : {missing.join(", ")}</p>}
    </div>
  );
}
