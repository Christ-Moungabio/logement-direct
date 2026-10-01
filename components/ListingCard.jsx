import Link from "next/link";
import { getCityLabel, getPropertyTypeLabel } from "../lib/constants";
import { formatPrice, formatShortDate } from "../lib/format";
import styles from "./ListingCard.module.css";

// Carte d'annonce, réutilisée par l'accueil et les résultats de recherche.
// compactOnMobile : photo à gauche et texte à droite sous 640 px (liste compacte).
export default function ListingCard({ listing, compactOnMobile = false }) {
  const className = [styles.card, compactOnMobile && styles.compactOnMobile].filter(Boolean).join(" ");

  return (
    <Link href={`/annonces/${listing.id}`} className={className}>
      {/* À remplacer par next/image quand le stockage des photos sera choisi. */}
      <div className={styles.photo} aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
      <div className={styles.body}>
        <p className={styles.price}>
          {formatPrice(listing.price)} <span className={styles.perMonth}>/ mois</span>
        </p>
        <p className="text-body-sm">
          {getPropertyTypeLabel(listing.type)} · {listing.district}
        </p>
        <p className={`text-body-sm ${styles.city}`}>{getCityLabel(listing.city)}</p>
        <p className="text-caption-sm">
          Avance {listing.advanceMonths} mois · publiée le {formatShortDate(listing.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
