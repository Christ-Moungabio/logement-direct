import {
  CalendarCheck,
  CalendarClock,
  DoorOpen,
  Droplets,
  Info,
  MapPin,
  Zap,
} from "lucide-react";

import { formatCalendarDay, formatDate, formatFcfa } from "@/lib/format";
import { cn } from "@/lib/utils";

import { monthsLabel, UTILITY_LABELS } from "../labels";
import { computeAdvanceAmount, getEffectiveAvailability } from "../rules";

/**
 * Titre, localisation et dates (EF-FIC-02).
 * @param {{ listing: import("../types").ListingDetail, title: string, action?: React.ReactNode }} props
 */
export function ListingHeading({ listing, title, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl lg:text-[2rem]">
          {title}
        </h1>
        <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground sm:text-base">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <span>
            {listing.neighborhood}, {listing.city}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Publiée le{" "}
            <time dateTime={listing.publishedAt}>
              {formatDate(listing.publishedAt)}
            </time>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Mise à jour le{" "}
            <time dateTime={listing.updatedAt}>
              {formatDate(listing.updatedAt)}
            </time>
          </span>
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/**
 * Loyer, avance (RG-06) et disponibilité.
 * @param {{ listing: import("../types").ListingDetail }} props
 */
export function ListingPrice({ listing }) {
  const advanceAmount = computeAdvanceAmount(
    listing.monthlyRent,
    listing.advanceMonths,
  );

  return (
    <div className="flex flex-col gap-3">
      <AvailabilityBadge listing={listing} />
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {formatFcfa(listing.monthlyRent)}
        </span>
        <span className="text-lg text-muted-foreground">/ mois</span>
      </p>
      <p className="text-base sm:text-lg">
        Avance demandée : {monthsLabel(listing.advanceMonths)} de loyer, soit{" "}
        <strong className="font-semibold">{formatFcfa(advanceAmount)}</strong>
      </p>
    </div>
  );
}

/** @param {{ listing: import("../types").ListingDetail }} props */
function AvailabilityBadge({ listing }) {
  const availability = getEffectiveAvailability(listing);

  if (availability.status === "available") {
    return (
      <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-sm font-semibold text-success">
        <CalendarCheck className="size-4" aria-hidden="true" />
        Libre
      </p>
    );
  }

  return (
    <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-warning-soft px-3 py-1 text-sm font-semibold text-warning">
      <CalendarClock className="size-4" aria-hidden="true" />
      Bientôt libre à partir du {formatCalendarDay(availability.from)}
    </p>
  );
}

/**
 * Cartes « Type de bien, Ville, Quartier, Avance » des wireframes.
 * @param {{ listing: import("../types").ListingDetail }} props
 */
export function ListingKeyFacts({ listing }) {
  const facts = [
    { label: "Type de bien", value: listing.propertyType },
    { label: "Ville", value: listing.city },
    { label: "Quartier", value: listing.neighborhood },
    { label: "Avance", value: monthsLabel(listing.advanceMonths) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {facts.map((fact) => (
        <div key={fact.label} className="rounded-xl border px-4 py-3">
          <dt className="text-xs text-muted-foreground">{fact.label}</dt>
          <dd className="mt-1 font-semibold break-words">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Eau, électricité, nombre de portes (si renseigné) et disponibilité (EF-FIC-03).
 * @param {{ listing: import("../types").ListingDetail }} props
 */
export function ListingDetails({ listing }) {
  const availability = getEffectiveAvailability(listing);
  const rows = [
    { icon: Droplets, label: "Eau", value: UTILITY_LABELS[listing.water] },
    {
      icon: Zap,
      label: "Électricité",
      value: UTILITY_LABELS[listing.electricity],
    },
    listing.doorsCount !== null && {
      icon: DoorOpen,
      label: "Nombre de portes dans la parcelle",
      value: String(listing.doorsCount),
    },
    {
      icon: availability.status === "available" ? CalendarCheck : CalendarClock,
      label: "Disponibilité",
      value:
        availability.status === "available"
          ? "Libre"
          : `Bientôt libre à partir du ${formatCalendarDay(availability.from)}`,
    },
  ].filter(Boolean);

  return (
    <ListingSection title="Équipements et disponibilité">
      <dl className="divide-y rounded-xl border">
        {rows.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3"
          >
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </dt>
            <dd className="font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </ListingSection>
  );
}

/** @param {{ description: string }} props */
export function ListingDescription({ description }) {
  return (
    <ListingSection title="Description">
      <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
        {description}
      </p>
    </ListingSection>
  );
}

/**
 * Localisation en texte (EF-FIC-04). La carte est prévue en V2.
 * @param {{ listing: import("../types").ListingDetail }} props
 */
export function ListingLocation({ listing }) {
  return (
    <ListingSection title="Localisation">
      <p className="text-muted-foreground">
        {listing.neighborhood}, {listing.city}. L&apos;adresse exacte est
        communiquée par le propriétaire.
      </p>
    </ListingSection>
  );
}

/** Mention légale (EF-FIC-06, RG-14). */
export function LegalNotice({ className }) {
  return (
    <aside
      className={cn(
        "flex gap-3 rounded-xl bg-info px-4 py-4 text-sm leading-relaxed text-info-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        La réservation finale et la caution se règlent directement avec le
        propriétaire, en dehors de la plateforme.
      </p>
    </aside>
  );
}

function ListingSection({ title, children }) {
  return (
    <section className="border-t pt-8">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}
