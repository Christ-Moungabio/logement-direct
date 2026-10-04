import Button from "../../../../components/ui/Button";
import { formatDayMonth } from "../../../../lib/format";
import { updateAvailability } from "../actions";
import styles from "./Listings.module.css";

function brazzavilleToday() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Brazzaville" });
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
        <form action={updateAvailability} className={styles.confirmForm}>
          <input type="hidden" name="id" value={listing.id} />

          <label className={styles.radio}>
            <input type="radio" name="availability" value="available" defaultChecked={!soon} />
            Libre
          </label>
          <label className={styles.radio}>
            <input type="radio" name="availability" value="available_soon" defaultChecked={soon} />
            Bientôt libre
          </label>

          <label className="text-body-sm" htmlFor={`date-${listing.id}`}>
            Libre à partir du (si bientôt libre)
          </label>
          <input
            id={`date-${listing.id}`}
            type="date"
            name="availableFrom"
            className={styles.select}
            defaultValue={soon ? listing.availableFrom : ""}
          />

          <Button type="submit" size="sm">
            Enregistrer
          </Button>
        </form>
      </div>
    </details>
  );
}
