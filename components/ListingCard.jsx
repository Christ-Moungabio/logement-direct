import Image from "next/image";
import Link from "next/link";
import { ImageIcon, MapPin } from "lucide-react";
import { formatAmount, formatAvailability, formatShortDate } from "../lib/format";
import styles from "./ListingCard.module.css";

export default function ListingCard({ listing }) {
  const availability = formatAvailability(listing.availability);
  const isFree = availability === "Libre";

  return (
    <Link href={`/annonces/${listing.id}`} className={styles.card}>
      <div className={styles.media}>
        {listing.photoUrl ? (
          <Image
            src={listing.photoUrl}
            alt={`${listing.typeLabel} à ${listing.district}`}
            fill
            sizes="(max-width: 640px) 88vw, (max-width: 1040px) 45vw, 380px"
            className={styles.photo}
          />
        ) : (
          <span className={styles.noPhoto} aria-hidden="true">
            <ImageIcon size={32} strokeWidth={1.6} />
          </span>
        )}
        <span className={styles.price}>
          <strong className="tabular">{formatAmount(listing.price)}</strong> FCFA/mois
        </span>
        <span className={styles.availability} data-soon={!isFree || undefined}>
          {availability}
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{listing.typeLabel}</h3>
        <p className={styles.location}>
          <MapPin size={15} strokeWidth={2.2} aria-hidden="true" />
          {listing.district}, {listing.city}
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
