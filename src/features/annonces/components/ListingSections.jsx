import { CalendarCheck, CalendarClock, DoorOpen, Droplets, Info, MapPin, Zap } from "lucide-react";
import { UTILITY_LABELS } from "../../../../lib/constants";
import { formatLongDate, formatPrice } from "../../../../lib/format";
import { monthsLabel } from "../labels";
import { computeAdvanceAmount, getEffectiveAvailability } from "../rules";
import styles from "./ListingSections.module.css";

function availabilityText(availability) {
  return availability.status === "available"
    ? "Libre"
    : `Bientôt libre à partir du ${formatLongDate(availability.from)}`;
}

export function ListingHeading({ listing, title, action }) {
  return (
    <div className={styles.heading}>
      <div>
        <h1 className="text-display-lg">{title}</h1>
        <p className={styles.meta}>
          <MapPin size={16} strokeWidth={2.2} aria-hidden="true" />
          <span>
            {listing.neighborhood}, {listing.city}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Publiée le <time dateTime={listing.publishedAt}>{formatLongDate(listing.publishedAt)}</time>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Mise à jour le <time dateTime={listing.updatedAt}>{formatLongDate(listing.updatedAt)}</time>
          </span>
        </p>
      </div>
      {action}
    </div>
  );
}

export function ListingPrice({ listing }) {
  const availability = getEffectiveAvailability(listing);
  const advanceAmount = computeAdvanceAmount(listing.monthlyRent, listing.advanceMonths);

  return (
    <div className={styles.price}>
      <p className={styles.badge} data-soon={availability.status === "available_soon" || undefined}>
        {availability.status === "available" ? (
          <CalendarCheck size={16} aria-hidden="true" />
        ) : (
          <CalendarClock size={16} aria-hidden="true" />
        )}
        {availabilityText(availability)}
      </p>
      <p className={styles.rent}>
        <strong className="tabular">{formatPrice(listing.monthlyRent)}</strong> / mois
      </p>
      <p className={styles.advance}>
        Avance demandée : {monthsLabel(listing.advanceMonths)} de loyer, soit{" "}
        <strong className="tabular">{formatPrice(advanceAmount)}</strong>
      </p>
    </div>
  );
}

export function ListingKeyFacts({ listing }) {
  const facts = [
    { label: "Type de bien", value: listing.propertyType },
    { label: "Ville", value: listing.city },
    { label: "Quartier", value: listing.neighborhood },
    { label: "Avance", value: monthsLabel(listing.advanceMonths) },
  ];

  return (
    <dl className={styles.facts}>
      {facts.map((fact) => (
        <div key={fact.label} className={styles.fact}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ListingDetails({ listing }) {
  const availability = getEffectiveAvailability(listing);
  const rows = [
    { Icon: Droplets, label: "Eau", value: UTILITY_LABELS[listing.water] },
    { Icon: Zap, label: "Électricité", value: UTILITY_LABELS[listing.electricity] },
    listing.doorsCount !== null && {
      Icon: DoorOpen,
      label: "Nombre de portes dans la parcelle",
      value: String(listing.doorsCount),
    },
    {
      Icon: availability.status === "available" ? CalendarCheck : CalendarClock,
      label: "Disponibilité",
      value: availabilityText(availability),
    },
  ].filter(Boolean);

  return (
    <Section title="Équipements et disponibilité">
      <dl className={styles.details}>
        {rows.map(({ Icon, label, value }) => (
          <div key={label} className={styles.detail}>
            <dt>
              <Icon size={17} aria-hidden="true" />
              {label}
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export function ListingDescription({ description }) {
  return (
    <Section title="Description">
      <p className={styles.text}>{description}</p>
    </Section>
  );
}

export function ListingLocation({ listing }) {
  return (
    <Section title="Localisation">
      <p className={styles.text}>
        {listing.neighborhood}, {listing.city}. L&apos;adresse exacte est communiquée par le propriétaire.
      </p>
    </Section>
  );
}

export function LegalNotice() {
  return (
    <aside className={styles.notice}>
      <Info size={18} aria-hidden="true" />
      <p>La réservation finale et la caution se règlent directement avec le propriétaire, en dehors de la plateforme.</p>
    </aside>
  );
}

function Section({ title, children }) {
  return (
    <section className={styles.section}>
      <h2 className="text-heading-md">{title}</h2>
      {children}
    </section>
  );
}
