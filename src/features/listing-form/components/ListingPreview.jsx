import { ImageIcon, MapPin } from "lucide-react";
import { formatAmount, formatDayMonth } from "../../../../lib/format";
import cardStyles from "../../../../components/ListingCard.module.css";
import styles from "./ListingPreview.module.css";

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function toNumber(value) {
  const number = Number(String(value ?? "").replace(/\s/g, ""));
  return Number.isFinite(number) && number > 0 ? number : null;
}

// Même rendu que la carte de la recherche, alimenté par ce qui est tapé dans le formulaire.
export default function ListingPreview({ draft, options, photoUrl }) {
  const type = options.propertyTypes.find((item) => String(item.id) === String(draft.propertyTypeId));
  const city = options.cities.find((item) => item.id === draft.cityId);
  const neighborhood = options.neighborhoods.find((item) => item.id === draft.neighborhoodId);

  const rent = toNumber(draft.monthlyRent);
  const advance = toNumber(draft.advanceMonths);
  const soon = draft.availability === "available_soon" && draft.availableFrom;
  const availability = soon ? `Bientôt libre le ${formatDayMonth(draft.availableFrom)}` : "Libre";

  return (
    <aside className={styles.preview} aria-label="Aperçu de l'annonce">
      <p className={styles.label}>Aperçu dans la recherche</p>

      <div className={cardStyles.card}>
        <div className={cardStyles.media}>
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className={styles.photo} />
          ) : (
            <span className={styles.noPhoto}>
              <ImageIcon size={28} strokeWidth={1.6} aria-hidden="true" />
              Pas encore de photo
            </span>
          )}
          <span className={cardStyles.price}>
            <strong className="tabular">{rent ? formatAmount(rent) : "—"}</strong> FCFA/mois
          </span>
          {draft.availability && (
            <span className={cardStyles.availability} data-soon={soon || undefined}>
              {availability}
            </span>
          )}
        </div>

        <div className={cardStyles.body}>
          <h3 className={cardStyles.title}>{type ? capitalize(type.name) : "Type de bien"}</h3>
          <p className={cardStyles.location}>
            <MapPin size={15} strokeWidth={2.2} aria-hidden="true" />
            {neighborhood && city ? `${neighborhood.name}, ${city.name}` : "Quartier, ville"}
          </p>
          <p className={cardStyles.advance}>
            Avance {advance ?? "—"} mois
            {rent && advance && (
              <>
                {" "}
                · <strong className="tabular">{formatAmount(rent * advance)} FCFA</strong>
              </>
            )}
          </p>
          <p className={cardStyles.date}>Publiée aujourd&apos;hui</p>
        </div>
      </div>
    </aside>
  );
}
