import Image from "next/image";
import Link from "next/link";
import { capitalize, formatAge, formatPrice } from "@/lib/format";
import styles from "./listing-card.module.css";

export function ListingCard({ listing }) {
  return (
    <Link href={`/annonces/${listing.id}`} className={styles.card}>
      <div className={styles.photo}>
        {(listing.photoUrl || listing.photo)? (
          <Image
            src={listing.photoUrl || listing.photo}
            alt={`${capitalize(listing.type || listing.propertyType)} à ${listing.district || listing.neighborhood}`}
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 100vw"
            className={styles.image}
          />
        ) : (
          <span className={styles.photoEmpty}>Photo</span>
        )}
      </div>

      <p className={styles.price}>
        <strong>{formatPrice(listing.rent)}</strong>{" "}
        <span className={styles.perMonth}>/ mois</span>
      </p>
      <p className={styles.title}>
        {capitalize(listing.propertyType)} · {listing.neighborhood}
      </p>
      <p className={styles.meta}>
        Avance {listing.advanceMonths} mois · {formatAge(listing.publishedAt)}
      </p>
    </Link>
  );
}