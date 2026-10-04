import Link from "next/link";
import { requireRole } from "../../../src/features/auth/queries";
import listingStyles from "../../../src/features/listings/components/Listings.module.css";
import AdminListingsList from "../../../src/features/moderation/components/AdminListingsList";
import { getAdminListings, getModerationCounts } from "../../../src/features/moderation/queries";
import styles from "./page.module.css";

export const metadata = { title: "Annonces · Administration" };

const EMPTY_MESSAGES = {
  live: "Aucune annonce en ligne pour le moment.",
  hidden: "Aucune annonce masquée.",
};

export default async function AdminListingsPage({ searchParams }) {
  await requireRole("admin", "/admin/annonces");
  const { statut } = await searchParams;
  const filter = statut === "masquees" ? "hidden" : "live";

  const [listings, counts] = await Promise.all([getAdminListings(filter), getModerationCounts()]);

  const tabs = [
    { value: "live", href: "/admin/annonces", label: "En ligne", count: counts.liveListings },
    { value: "hidden", href: "/admin/annonces?statut=masquees", label: "Masquées", count: counts.hiddenListings },
  ];

  return (
    <>
      <div>
        <h1 className="text-display-lg">Annonces</h1>
        <p className={`${styles.intro} text-body-md`}>
          Masquer une annonce la retire aussitôt de l&apos;accueil, de la recherche et de sa fiche. Le propriétaire
          voit le motif et ne peut pas la republier lui-même.
        </p>
      </div>

      <nav className={listingStyles.filters} aria-label="Filtrer les annonces">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.href}
            className={`${listingStyles.filter} ${tab.value === filter ? listingStyles.filterActive : ""}`}
            aria-current={tab.value === filter ? "page" : undefined}
          >
            {tab.label} · {tab.count}
          </Link>
        ))}
      </nav>

      {listings.length === 0 ? (
        <p className={styles.empty}>{EMPTY_MESSAGES[filter]}</p>
      ) : (
        <AdminListingsList listings={listings} />
      )}
    </>
  );
}
