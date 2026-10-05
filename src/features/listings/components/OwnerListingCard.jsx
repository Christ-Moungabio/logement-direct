import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { formatAmount, formatPrice, formatShortDate } from "../../../../lib/format";
import { CLOSE_REASONS, STATUSES } from "../status";
import { listingTitle } from "../summary";
import AvailabilityControl from "./AvailabilityControl";
import DraftProgress from "./DraftProgress";
import RowActions from "./RowActions";
import styles from "./OwnerListings.module.css";

const UTILITY_LABELS = {
  water: { individual: "Eau individuelle", shared: "Eau partagée", none: "Pas d'eau" },
  electricity: {
    individual: "Électricité individuelle",
    shared: "Électricité partagée",
    none: "Pas d'électricité",
  },
};

const DOT_TONES = {
  published: "dotSuccess",
  scheduled: "dotWarning",
  draft: "dotNeutral",
  hidden: "dotDanger",
  closed: "dotDark",
};

function visibleTime(iso) {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Brazzaville",
  });
}

function footnote(listing) {
  switch (listing.status) {
    case "published":
      return `Mise à jour le ${formatShortDate(listing.updatedAt)}`;
    case "scheduled":
      return `Visible par les locataires vers ${visibleTime(listing.visibleFrom)}`;
    case "closed":
      return `Fermée · ${CLOSE_REASONS[listing.closeReason] ?? ""}`;
    default:
      return null;
  }
}

export default function OwnerListingCard({ listing }) {
  const title = listingTitle(listing);
  const hasLive = listing.status === "published" || listing.status === "scheduled";
  const tags = [UTILITY_LABELS.water[listing.water], UTILITY_LABELS.electricity[listing.electricity]].filter(Boolean);

  return (
    <article
      className={`${styles.card} ${listing.status === "hidden" ? styles.cardHidden : ""} ${
        listing.status === "closed" ? styles.cardClosed : ""
      }`}
    >
      <div className={styles.media}>
        {listing.photoUrl ? (
          <Image
            src={listing.photoUrl}
            alt={`Photo principale de l'annonce : ${title}`}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1100px) 46vw, 380px"
            className={styles.photo}
          />
        ) : (
          <span className={styles.noPhoto}>
            <ImageIcon size={26} strokeWidth={1.6} aria-hidden="true" />
            Aucune photo pour l&apos;instant
          </span>
        )}
        <span className={styles.status}>
          <span className={`${styles.dot} ${styles[DOT_TONES[listing.status]]}`} aria-hidden="true" />
          {STATUSES[listing.status].label}
        </span>
      </div>

      <div className={styles.body}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.place}>{listing.city ?? "Ville à choisir"}</p>
        </div>

        <p className={styles.rent}>
          <strong className="tabular">{listing.rent ? formatPrice(listing.rent) : "—"}</strong>
          {listing.rent && <span> / mois</span>}
        </p>

        {listing.rent && listing.advanceMonths && (
          <p className={styles.advance}>
            Avance de {listing.advanceMonths} mois ·{" "}
            <span className="tabular">{formatAmount(listing.rent * listing.advanceMonths)} FCFA</span>
          </p>
        )}

        {(tags.length > 0 || hasLive) && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
            {hasLive && <AvailabilityControl listing={listing} />}
          </div>
        )}

        {listing.status === "draft" && <DraftProgress listing={listing} />}

        {listing.status === "hidden" && (
          <p className={styles.reason}>
            <strong>Masquée par l&apos;équipe</strong>
            <span>« {listing.hiddenReason} »</span>
          </p>
        )}
      </div>

      {listing.status !== "hidden" && (
        <div className={styles.footer}>
          {footnote(listing) && <span className={styles.footnote}>{footnote(listing)}</span>}
          <RowActions listing={listing} />
        </div>
      )}
    </article>
  );
}
