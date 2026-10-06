import OwnerListingCard from "./OwnerListingCard";
import styles from "./OwnerListings.module.css";

export default function ListingsList({ listings }) {
  return (
    <ul className={styles.grid}>
      {listings.map((listing) => (
        <li key={listing.id}>
          <OwnerListingCard listing={listing} />
        </li>
      ))}
    </ul>
  );
}
