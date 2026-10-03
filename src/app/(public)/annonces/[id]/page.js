import Link from "next/link";
import { notFound } from "next/navigation";

import { ListingGallery } from "@/features/annonces/components/listing-gallery";
import {
  ContactCard,
  MobileContactBar,
} from "@/features/annonces/components/listing-contact";
import {
  LegalNotice,
  ListingDescription,
  ListingDetails,
  ListingHeading,
  ListingKeyFacts,
  ListingLocation,
  ListingPrice,
} from "@/features/annonces/components/listing-sections";
import { ReportListing } from "@/features/annonces/components/report-listing";
import {
  getListingContact,
  getPublicListing,
  getViewerRelation,
  hasReportedListing,
} from "@/features/annonces/queries";
import {
  buildContactMessage,
  buildListingPageTitle,
  buildListingTitle,
} from "@/features/annonces/rules";
import { formatFcfa } from "@/lib/format";
import { getCurrentUser } from "@/server/auth";
import { getSiteUrl } from "@/server/site-url";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const listing = await getPublicListing(id);

  if (!listing) {
    return { title: "Annonce indisponible", robots: { index: false } };
  }

  // Aucune donnée personnelle : type, quartier et loyer uniquement.
  const title = buildListingPageTitle(listing);
  const description = `${listing.propertyType} à louer à ${listing.neighborhood}, ${listing.city}.`;
  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      images: listing.photos[0] ? [listing.photos[0].url] : undefined,
    },
  };
}

export default async function ListingPage({ params }) {
  const { id } = await params;

  // Requêtes indépendantes lancées en parallèle (ENF-02).
  const [listing, user, relation] = await Promise.all([
    getPublicListing(id),
    getCurrentUser(),
    getViewerRelation(id),
  ]);

  if (!listing) notFound();

  const returnTo = `/annonces/${listing.id}`;

  // Le numéro n'est demandé que pour un utilisateur connecté qui n'est pas le
  // propriétaire : pour un visiteur, il n'est jamais lu ni envoyé au navigateur.
  const [contact, alreadyReported, siteUrl] = await Promise.all([
    user && relation !== "owner" ? getListingContact(listing.id) : null,
    relation === "tenant" ? hasReportedListing(listing.id, user.id) : false,
    getSiteUrl(),
  ]);

  const title = buildListingTitle(listing);
  const whatsappMessage = buildContactMessage(listing, `${siteUrl}${returnTo}`);
  const contactProps = { relation, contact, whatsappMessage, returnTo };
  const reportAction = (
    <ReportListing
      listingId={listing.id}
      relation={relation}
      alreadyReported={alreadyReported}
      returnTo={returnTo}
    />
  );
  const showMobileBar =
    relation === "guest" || (relation !== "owner" && contact !== null);

  return (
    <div className={showMobileBar ? "pb-24 lg:pb-0" : undefined}>
      <div className="mx-auto w-full max-w-page px-4 py-6 sm:px-6 sm:py-8">
        <nav
          aria-label="Fil d'Ariane"
          className="mb-4 text-sm text-muted-foreground"
        >
          <ol className="flex flex-wrap items-center gap-x-2">
            <li>
              <Link href="/" className="hover:text-foreground hover:underline">
                Résultats
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>{listing.city}</li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{listing.neighborhood}</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-6">
          <div className="order-2 md:order-1">
            <ListingHeading
              listing={listing}
              title={title}
              action={<div className="hidden sm:block">{reportAction}</div>}
            />
          </div>
          <div className="order-1 md:order-2">
            <ListingGallery photos={listing.photos} title={title} />
          </div>
        </div>

        {/*
          Mobile : prix, contact, puis détails, dans l'ordre de lecture.
          Ordinateur : le contact passe dans une colonne à droite.
          Le bloc contact n'est rendu qu'une fois.
        */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_1fr] lg:gap-x-14">
          <div className="flex min-w-0 flex-col gap-8 lg:col-start-1 lg:row-start-1">
            <ListingPrice listing={listing} />
            <ListingKeyFacts listing={listing} />
          </div>

          <aside
            aria-label="Contact et informations"
            className="lg:col-start-2 lg:row-span-2 lg:row-start-1"
          >
            <div className="flex flex-col gap-4 lg:sticky lg:top-6">
              <ContactCard {...contactProps} />
              <LegalNotice />
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-8 lg:col-start-1 lg:row-start-2">
            <ListingDescription description={listing.description} />
            <ListingDetails listing={listing} />
            <ListingLocation listing={listing} />

            <div className="border-t pt-6 sm:hidden">{reportAction}</div>
          </div>
        </div>
      </div>

      {showMobileBar && (
        <MobileContactBar
          {...contactProps}
          priceLabel={formatFcfa(listing.monthlyRent)}
        />
      )}
    </div>
  );
}
