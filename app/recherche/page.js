import Link from "next/link";
import { redirect } from "next/navigation";
import { getFilterOptions } from "@/lib/reference-data";
import { ActiveFilters } from "@/features/recherche/components/active-filters";
import { EmptyResults } from "@/features/recherche/components/empty-results";
import { FiltersPanel } from "@/features/recherche/components/filters-panel";
import { Pagination } from "@/features/recherche/components/pagination";
import { ResultsList } from "@/features/recherche/components/results-list";
import { SortSelect } from "@/features/recherche/components/sort-select";
import { searchListings } from "@/features/recherche/queries";
import { parseSearchParams } from "@/features/recherche/schemas";
import { buildSearchHref } from "@/features/recherche/url";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/features/recherche/recherche.module.css";

export default async function RecherchePage({ searchParams }) {
  const { filters, error } = parseSearchParams(await searchParams);

  const [options, results] = await Promise.all([
    getFilterOptions(),
    error
      ? Promise.resolve({ items: [], total: 0, page: 1, pageCount: 1 })
      : searchListings(filters),
  ]);

  if (!error && results.items.length === 0 && filters.page > 1) {
    redirect(buildSearchHref(filters, { page: 1 }));
  }

  const { items, total, pageCount } = results;
  const city = options.cities.find((c) => c.id === filters.ville);

  return (
    <><Header/>
    <main className={styles.page}>
      <nav aria-label="Fil d'Ariane" className={styles.breadcrumb}>
        <Link href="/">Accueil</Link> / {city ? city.name : "Toutes les villes"}
      </nav>

      <h1 className={styles.title}>
        {city ? `Logements à louer à ${city.name}` : "Logements à louer"}
      </h1>
      {!error && (
        <p className={styles.count}>
          {total} annonce{total > 1 ? "s correspondent" : " correspond"} à votre
          recherche
        </p>
      )}

      <div className={styles.layout}>
        <aside>
          <FiltersPanel
            key={buildSearchHref(filters)}
            filters={filters}
            options={options}
          />
        </aside>

        <section className={styles.results}>
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}

          <ActiveFilters filters={filters} options={options} />

          {!error && (
            <div className={styles.toolbar}>
              <SortSelect filters={filters} />
            </div>
          )}

          {!error &&
            (items.length === 0 ? (
              <EmptyResults />
            ) : (
              <ResultsList items={items} />
            ))}

          <Pagination filters={filters} pageCount={pageCount} />
        </section>
      </div>

      <p className={styles.notice}>
        Réservation finale et caution à régler directement avec le propriétaire.
      </p>
    </main>
    <Footer/>
    </>
  );
}     