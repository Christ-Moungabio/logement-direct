import { ImageIcon } from "lucide-react";
import { formatPrice, formatShortDate } from "../../../../lib/format";
import { CLOSE_REASONS } from "../status";
import RowActions from "./RowActions";
import StatusBadge from "./StatusBadge";
import styles from "./Listings.module.css";

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function listingTitle(listing) {
  const type = capitalize(listing.propertyType) || "Logement";
  return listing.neighborhood ? `${type} à ${listing.neighborhood}` : type;
}

function photoLabel(count) {
  if (count === 0) return "0 photo";
  return `${count} photo${count > 1 ? "s" : ""}`;
}

function missingFields(listing) {
  const missing = [];
  if (listing.photoCount === 0) missing.push("photos");
  if (!listing.hasDescription) missing.push("description");
  if (!listing.rent) missing.push("loyer");
  if (!listing.neighborhood) missing.push("quartier");
  return missing;
}

function activity(listing) {
  switch (listing.status) {
    case "published":
      return `Mise à jour le ${formatShortDate(listing.updatedAt)}`;
    case "scheduled":
      return `Visible par les locataires vers ${new Date(listing.visibleFrom).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Brazzaville",
      })}`;
    case "hidden":
      return `Motif : « ${listing.hiddenReason} »`;
    case "closed":
      return `Fermée · ${CLOSE_REASONS[listing.closeReason] ?? ""}`;
    default: {
      const missing = missingFields(listing);
      return missing.length ? `À compléter : ${missing.join(", ")}` : "Prête à être publiée";
    }
  }
}

export default function ListingsList({ listings }) {
  return (
    <ul className={styles.list}>
      {listings.map((listing) => (
        <li key={listing.id} className={styles.row}>
          <div className={styles.listing}>
            <span className={styles.thumb} aria-hidden="true">
              <ImageIcon size={20} strokeWidth={1.8} />
            </span>
            <div className={styles.listingText}>
              <p className="text-heading-sm">{listingTitle(listing)}</p>
              <p className="text-caption-sm">
                {listing.city ?? "Ville à choisir"} · {photoLabel(listing.photoCount)}
              </p>
            </div>
          </div>

          <p className={`${styles.rent} tabular`}>{listing.rent ? formatPrice(listing.rent) : "—"}</p>
          <div>
            <StatusBadge status={listing.status} />
          </div>
          <p className={`${styles.activity} text-body-sm`}>{activity(listing)}</p>
          <RowActions listing={listing} />
        </li>
      ))}
    </ul>
  );
}
