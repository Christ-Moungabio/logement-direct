import { SearchResultCard } from "@/components/SearchResultCard";
import styles from "../recherche.module.css";

export function ResultsList({ items }) {
  return (
    <ul className={styles.grid}>
      {items.map((listing) => (
        <li key={listing.id}>
          <SearchResultCard listing={listing} />
        </li>
      ))}
    </ul>
  );
}