
import Link from "next/link";
import { buildSearchHref } from "../url";
import styles from "../recherche.module.css";

// Pages affichées : première, dernière et voisines de la page courante.
function getPages(page, pageCount) {
  const wanted = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...wanted]
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);

  const items = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) items.push(`gap-${p}`);
    items.push(p);
  });
  return items;
}

export function Pagination({ filters, pageCount }) {
  if (pageCount <= 1) return null;
  const { page } = filters;

  return (
    <nav aria-label="Pagination" className={styles.pagination}>
      {page > 1 ? (
        <Link
          href={buildSearchHref(filters, { page: page - 1 })}
          rel="prev"
          className={styles.pageLink}
        >
          Précédent
        </Link>
      ) : (
        <span className={styles.pageDisabled}>Précédent</span>
      )}

      {getPages(page, pageCount).map((item) =>
        typeof item === "string" ? (
          <span key={item} className={styles.pageGap}>
            …
          </span>
        ) : item === page ? (
          <span key={item} aria-current="page" className={styles.pageCurrent}>
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={buildSearchHref(filters, { page: item })}
            className={styles.pageLink}
          >
            {item}
          </Link>
        ),
      )}

      {page < pageCount ? (
        <Link
          href={buildSearchHref(filters, { page: page + 1 })}
          rel="next"
          className={styles.pageLink}
        >
          Suivant
        </Link>
      ) : (
        <span className={styles.pageDisabled}>Suivant</span>
      )}
    </nav>
  );
}