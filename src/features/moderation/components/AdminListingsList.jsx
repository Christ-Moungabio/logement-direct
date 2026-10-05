import { ImageIcon } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { capitalize, formatPrice, formatShortDate } from "../../../../lib/format";
import StatusBadge from "../../listings/components/StatusBadge";
import listingStyles from "../../listings/components/Listings.module.css";
import { restoreListing } from "../actions";
import HideListingForm from "./HideListingForm";
import styles from "./AdminListings.module.css";

function listingTitle(listing) {
  const type = capitalize(listing.propertyType) || "Logement";
  return listing.neighborhood ? `${type} à ${listing.neighborhood}` : type;
}

function Actions({ listing }) {
  if (listing.status === "hidden") {
    return (
      <div className={listingStyles.actions}>
        <form action={restoreListing}>
          <input type="hidden" name="listingId" value={listing.id} />
          <Button type="submit" size="sm" variant="secondary">
            Réafficher
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className={listingStyles.actions}>
      <Button href={`/annonces/${listing.id}`} size="sm" variant="secondary">
        Voir la fiche
      </Button>
      <HideListingForm listingId={listing.id} />
    </div>
  );
}

export default function AdminListingsList({ listings }) {
  return (
    <ul className={listingStyles.list}>
      {listings.map((listing) => (
        <li key={listing.id} className={listingStyles.row}>
          <div className={listingStyles.listing}>
            <span className={listingStyles.thumb} aria-hidden="true">
              <ImageIcon size={20} strokeWidth={1.8} />
            </span>
            <div className={listingStyles.listingText}>
              <p className="text-heading-sm">{listingTitle(listing)}</p>
              <p className="text-caption-sm">
                {listing.city ?? "Ville inconnue"} · {listing.ownerName ?? "Propriétaire inconnu"}
              </p>
            </div>
          </div>

          <p className={`${listingStyles.rent} tabular`}>{listing.rent ? formatPrice(listing.rent) : "—"}</p>
          <div>
            <StatusBadge status={listing.status} />
          </div>
          <p className={`${listingStyles.activity} text-body-sm`}>
            {listing.status === "hidden" ? (
              <span className={styles.reason}>Motif : « {listing.hiddenReason} »</span>
            ) : (
              `En ligne depuis le ${formatShortDate(listing.publishedAt)}`
            )}
          </p>
          <Actions listing={listing} />
        </li>
      ))}
    </ul>
  );
}
