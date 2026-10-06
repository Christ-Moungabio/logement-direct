"use client";

import { useRouter } from "next/navigation";
import { buildSearchHref } from "../url";
import styles from "../recherche.module.css";

export function SortSelect({ filters }) {
  const router = useRouter();

  return (
    <div className={styles.sort}>
      <label htmlFor="tri" className={styles.sortLabel}>
        Trier par
      </label>
      <select
        id="tri"
        value={filters.tri}
        onChange={(e) =>
          router.push(
            buildSearchHref(filters, { tri: e.target.value, page: 1 }),
          )
        }
        className={styles.select}
      >
        <option value="recent">Plus récentes</option>
        <option value="prix-asc">Prix croissant</option>
        <option value="prix-desc">Prix décroissant</option>
      </select>
    </div>
  );
}