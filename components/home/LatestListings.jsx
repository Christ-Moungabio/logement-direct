import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ListingCard from "../ListingCard";
import styles from "./LatestListings.module.css";

export default function LatestListings({ listings, propertyTypes }) {
  return (
    <div className={styles.latest}>
      {propertyTypes.length > 0 && (
        <nav className={styles.types} aria-label="Rechercher par type de bien">
          {propertyTypes.map((type) => (
            <Link key={type.id} href={`/recherche?types=${type.id}`} className={styles.type}>
              {type.label}
            </Link>
          ))}
        </nav>
      )}

      {listings.length > 0 ? (
        <ul className={styles.grid}>
          {listings.map((listing) => (
            <li key={listing.id}>
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Aucune annonce en ligne pour le moment. Revenez très bientôt.</p>
      )}

      <Link href="/recherche" className={styles.all}>
        Voir tous les logements
        <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
      </Link>
    </div>
  );
}
