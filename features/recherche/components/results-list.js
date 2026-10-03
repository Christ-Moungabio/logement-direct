import { ListingCard } from "@/components/listing-card";
import styles from "../recherche.module.css";

export function ResultsList({ items }) {
  return (
    <ul className={styles.grid}>
      {items.map((listing) => (
        <li key={listing.id}>
          <ListingCard listing={listing} />
        </li>
      ))}
    </ul>
  );
}