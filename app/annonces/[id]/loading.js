import Header from "../../../components/Header";
import styles from "./loading.module.css";

export default function ListingLoading() {
  return (
    <>
      <Header />
      <main className={`container ${styles.page}`} role="status" aria-live="polite">
        <span className="visually-hidden">Chargement de l&apos;annonce…</span>
        <div className={`${styles.block} ${styles.line}`} />
        <div className={`${styles.block} ${styles.title}`} />
        <div className={`${styles.block} ${styles.media}`} />
        <div className={`${styles.block} ${styles.price}`} />
        <div className={styles.facts}>
          {[0, 1, 2, 3].map((key) => (
            <div key={key} className={`${styles.block} ${styles.fact}`} />
          ))}
        </div>
      </main>
    </>
  );
}
