import Link from "next/link";
import { requireRole } from "../../../src/features/auth/queries";
import listingStyles from "../../../src/features/listings/components/Listings.module.css";
import AdminListingsList from "../../../src/features/moderation/components/AdminListingsList";
import AdminPageHeader from "../../../src/features/moderation/components/AdminPageHeader";
import { getAdminListings, getModerationCounts } from "../../../src/features/moderation/queries";
import styles from "./page.module.css";

export const metadata = { title: "Annonces · Administration" };

const EMPTY_MESSAGES = {
  live: "Aucune annonce en ligne pour le moment.",
  hidden: "Aucune annonce masquée.",
};

function normalize(text) {
  return (text ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function matches(listing, query) {
  const haystack = normalize(
    [listing.propertyType, listing.neighborhood, listing.city, listing.ownerName].filter(Boolean).join(" "),
  );
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

function tabHref(base, query) {
  if (!query) return base;
  return `${base}${base.includes("?") ? "&" : "?"}q=${encodeURIComponent(query)}`;
}

export default async function AdminListingsPage({ searchParams }) {
  await requireRole("admin", "/admin/annonces");
  const { statut, q } = await searchParams;
  const filter = statut === "masquees" ? "hidden" : "live";
  const query = typeof q === "string" ? q.trim() : "";

  const [allListings, counts] = await Promise.all([getAdminListings(filter), getModerationCounts()]);
  const listings = query ? allListings.filter((listing) => matches(listing, query)) : allListings;

  const tabs = [
    { value: "live", href: "/admin/annonces", label: "En ligne", count: counts.liveListings },
    { value: "hidden", href: "/admin/annonces?statut=masquees", label: "Masquées", count: counts.hiddenListings },
  ];

  return (
    <>
      <AdminPageHeader
        title="Annonces"
        description="Masquer une annonce la retire aussitôt de l'accueil, de la recherche et de sa fiche. Le propriétaire voit le motif et ne peut pas la republier lui-même."
      />

      <nav className={listingStyles.filters} aria-label="Filtrer les annonces">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tabHref(tab.href, query)}
            className={`${listingStyles.filter} ${tab.value === filter ? listingStyles.filterActive : ""}`}
            aria-current={tab.value === filter ? "page" : undefined}
          >
            {tab.label} · {tab.count}
          </Link>
        ))}
      </nav>

      {query && (
        <p className={styles.searchSummary}>
          {listings.length} résultat{listings.length > 1 ? "s" : ""} pour « {query} »
          <Link href={tabs.find((tab) => tab.value === filter).href}>Effacer la recherche</Link>
        </p>
      )}

      {listings.length === 0 ? (
        <p className={styles.empty}>{query ? `Aucune annonce ne correspond à « ${query} ».` : EMPTY_MESSAGES[filter]}</p>
      ) : (
        <AdminListingsList listings={listings} />
      )}
    </>
  );
}
