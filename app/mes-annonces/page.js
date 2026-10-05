import Link from "next/link";
import { Plus } from "lucide-react";
import Header from "../../components/Header";
import Button from "../../components/ui/Button";
import { requireRole } from "../../src/features/auth/queries";
import ListingsList from "../../src/features/listings/components/ListingsList";
import ListingsSearch from "../../src/features/listings/components/ListingsSearch";
import StatusFilters from "../../src/features/listings/components/StatusFilters";
import searchStyles from "../../src/features/listings/components/OwnerListings.module.css";
import { getOwnerListings } from "../../src/features/listings/queries";
import { listingsHref, matchesQuery, sortFromParam, sortListings } from "../../src/features/listings/search";
import { STATUSES } from "../../src/features/listings/status";
import styles from "./page.module.css";

export const metadata = { title: "Mes annonces" };

export default async function MyListingsPage({ searchParams }) {
  const profile = await requireRole("owner", "/mes-annonces");
  const { statut, q, tri } = await searchParams;
  const current = Object.hasOwn(STATUSES, statut) ? statut : null;
  const query = typeof q === "string" ? q.trim().slice(0, 80) : "";
  const sort = sortFromParam(tri);

  const listings = await getOwnerListings(profile.id);
  const matched = listings.filter((listing) => matchesQuery(listing, query));
  const shown = sortListings(current ? matched.filter((listing) => listing.status === current) : matched, sort);

  return (
    <>
      <Header />
      <main className={`container ${styles.page}`}>
        <Link href="/espace" className={styles.back}>
          ← Mon espace
        </Link>
        <div className={styles.head}>
          <div>
            <h1 className="text-display-lg">Mes annonces</h1>
            <p className={`${styles.count} text-body-md`}>
              {listings.length} annonce{listings.length > 1 ? "s" : ""}
            </p>
          </div>
          <Button href="/mes-annonces/nouvelle">
            <Plus size={18} aria-hidden="true" />
            Publier une annonce
          </Button>
        </div>

        {listings.length > 0 && (
          <div className={searchStyles.toolbar}>
            <StatusFilters listings={matched} current={current} q={query} sort={sort} />
            <ListingsSearch q={query} sort={sort} statut={current} />
          </div>
        )}

        {query && (
          <p className={searchStyles.summary}>
            {shown.length} résultat{shown.length > 1 ? "s" : ""} pour « {query} »
            <Link href={listingsHref({ statut: current, sort })}>Effacer la recherche</Link>
          </p>
        )}

        {listings.length === 0 ? (
          <p className={styles.empty}>
            Vous n&apos;avez pas encore d&apos;annonce. Commencez par en créer une, elle restera en brouillon
            tant que vous ne la publiez pas.
          </p>
        ) : shown.length === 0 ? (
          <p className={styles.empty}>
            {query ? `Aucune annonce ne correspond à « ${query} ».` : "Aucune annonce avec ce statut."}
          </p>
        ) : (
          <ListingsList listings={shown} />
        )}
      </main>
    </>
  );
}
