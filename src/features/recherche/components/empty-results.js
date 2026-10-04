import Link from "next/link";
import styles from "../recherche.module.css";

export function EmptyResults() {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>Aucune annonce ne correspond à votre recherche</p>
      <p className={styles.emptyText}>
        Élargissez votre budget ou retirez un quartier pour voir plus d&apos;offres.
      </p>
      <Link href="/recherche" className={styles.resetLink}>
        Réinitialiser les filtres
      </Link>
    </div>
  );
}
