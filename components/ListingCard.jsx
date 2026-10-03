import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getCityLabel, getPropertyTypeLabel } from "../lib/constants";
import { formatAmount, formatAvailability, formatShortDate } from "../lib/format";
import styles from "./ListingCard.module.css";

// Carte d'annonce (EF-REC-02) : photo principale, loyer, type et quartier,
// avance en mois et en FCFA, ancienneté. Réutilisée par l'accueil et la recherche.
export default function ListingCard({ listing }) {
  const availability = formatAvailability(listing.availability);
  const isFree = availability === "Libre";

  return (
    <Link href={`/annonces/${listing.id}`} className={styles.card}>
      <div className={styles.media}>
        <Image
          src={listing.photo}
          alt={listing.photoAlt}
          fill
          sizes="(max-width: 640px) 88vw, (max-width: 1040px) 45vw, 380px"
          placeholder="blur"
          className={styles.photo}
        />
        <span className={styles.price}>
          <strong className="tabular">{formatAmount(listing.price)}</strong> FCFA/mois
        </span>
        <span className={styles.availability} data-soon={!isFree || undefined}>
          {availability}
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{getPropertyTypeLabel(listing.type)}</h3>
        <p className={styles.location}>
          <MapPin size={15} strokeWidth={2.2} aria-hidden="true" />
          {listing.district}, {getCityLabel(listing.city)}
        </p>
        <p className={styles.advance}>
          Avance {listing.advanceMonths} mois ·{" "}
          <strong className="tabular">{formatAmount(listing.price * listing.advanceMonths)} FCFA</strong>
        </p>
        <p className={styles.date}>Publiée le {formatShortDate(listing.publishedAt)}</p>
      </div>
    </Link>
  );
}
