import { formatDayMonth } from "../../../../lib/format";
import AvailabilityForm from "./AvailabilityForm";
import styles from "./Listings.module.css";

function brazzavilleToday() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Brazzaville" });
}

// La date de disponibilité doit être dans le futur : le plus tôt possible, c'est demain.
function tomorrow() {
  const date = new Date(`${brazzavilleToday()}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

// Quand la date annoncée est atteinte, le logement s'affiche de nouveau "Libre".
export function availabilityLabel(listing) {
  const soon = listing.availability === "available_soon" && listing.availableFrom > brazzavilleToday();
  return soon ? `Bientôt libre le ${formatDayMonth(listing.availableFrom)}` : "Libre";
}

export default function AvailabilityControl({ listing }) {
  const soon = listing.availability === "available_soon" && listing.availableFrom > brazzavilleToday();

  return (
    <details className={styles.confirm}>
      <summary className={styles.availabilitySummary}>{availabilityLabel(listing)} · Changer</summary>
      <div className={styles.confirmBody}>
        <AvailabilityForm
          listingId={listing.id}
          soon={soon}
          availableFrom={listing.availableFrom}
          minDate={tomorrow()}
        />
      </div>
    </details>
  );
}
