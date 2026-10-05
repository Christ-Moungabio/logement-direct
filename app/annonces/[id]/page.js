import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import { getCurrentProfile } from "../../../src/features/auth/queries";
import ListingGallery from "../../../src/features/annonces/components/ListingGallery";
import { ContactCard, MobileContactBar } from "../../../src/features/annonces/components/ListingContact";
import {
  LegalNotice,
  ListingDescription,
  ListingDetails,
  ListingHeading,
  ListingKeyFacts,
  ListingLocation,
  ListingPrice,
} from "../../../src/features/annonces/components/ListingSections";
import ReportListing from "../../../src/features/annonces/components/ReportListing";
import {
  getListingContact,
  getPublicListing,
  getViewerRelation,
  hasReportedListing,
} from "../../../src/features/annonces/queries";
import { buildContactMessage, buildListingPageTitle, buildListingTitle } from "../../../src/features/annonces/rules";
import { getSiteUrl } from "../../../src/features/annonces/site-url";
import styles from "./page.module.css";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const listing = await getPublicListing(id);

  if (!listing) {
    return { title: "Annonce indisponible", robots: { index: false } };
  }

  const title = buildListingPageTitle(listing);
  const description = `${listing.propertyType} à louer à ${listing.neighborhood}, ${listing.city}.`;
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description, images: listing.photos[0] ? [listing.photos[0].url] : undefined },
  };
}

export default async function ListingPage({ params }) {
  const { id } = await params;

  const [listing, profile, relation] = await Promise.all([
    getPublicListing(id),
    getCurrentProfile(),
    getViewerRelation(id),
  ]);

  if (!listing) notFound();

  const returnTo = `/annonces/${listing.id}`;

  // Le numéro n'est lu que pour un utilisateur connecté qui n'est pas le
  // propriétaire : pour un visiteur, il n'est jamais envoyé au navigateur.
  const [contact, alreadyReported, siteUrl] = await Promise.all([
    profile && relation !== "owner" ? getListingContact(listing.id) : null,
    relation === "tenant" ? hasReportedListing(listing.id, profile.id) : false,
    getSiteUrl(),
  ]);

  const title = buildListingTitle(listing);
  const contactProps = {
    relation,
    contact,
    whatsappMessage: buildContactMessage(listing, `${siteUrl}${returnTo}`),
    returnTo,
  };
  const reportAction = (
    <ReportListing listingId={listing.id} relation={relation} alreadyReported={alreadyReported} returnTo={returnTo} />
  );
  const showMobileBar = relation === "guest" || (relation !== "owner" && contact !== null);

  return (
    <>
      <Header />

      <main className={`container ${styles.page}`} data-mobile-bar={showMobileBar || undefined}>
        <nav aria-label="Fil d'Ariane" className={styles.breadcrumb}>
          <ol>
            <li>
              <Link href="/#logements">Logements</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>{listing.city}</li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{listing.neighborhood}</li>
          </ol>
        </nav>

        <div className={styles.top}>
          <div className={styles.headingArea}>
            <ListingHeading listing={listing} title={title} action={<div className={styles.reportTop}>{reportAction}</div>} />
          </div>
          <div className={styles.galleryArea}>
            <ListingGallery photos={listing.photos} title={title} />
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.summary}>
            <ListingPrice listing={listing} />
            <ListingKeyFacts listing={listing} />
          </div>

          <aside className={styles.aside} aria-label="Contact et informations">
            <div className={styles.sticky}>
              <ContactCard {...contactProps} />
              <LegalNotice />
            </div>
          </aside>

          <div className={styles.content}>
            <ListingDescription description={listing.description} />
            <ListingDetails listing={listing} />
            <ListingLocation listing={listing} />
            <div className={styles.reportBottom}>{reportAction}</div>
          </div>
        </div>
      </main>

      <Footer />

      {showMobileBar && <MobileContactBar {...contactProps} monthlyRent={listing.monthlyRent} />}
    </>
  );
}
