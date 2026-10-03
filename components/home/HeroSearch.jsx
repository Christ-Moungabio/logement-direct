"use client";

import { Search } from "lucide-react";
import { PROPERTY_TYPES } from "../../lib/constants";
import { SEARCH_EVENT } from "../../lib/search";
import styles from "../../app/page.module.css";

export default function HeroSearch() {
  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const criteria = {
      type: data.get("type") ?? "",
      budget: data.get("prix_max") ?? "",
    };
    window.dispatchEvent(new CustomEvent(SEARCH_EVENT, { detail: criteria }));
    document.getElementById("logements")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <form className={styles.search} role="search" aria-label="Rechercher un logement" onSubmit={handleSubmit}>
      <div className={styles.searchField}>
        <label htmlFor="type" className={styles.searchLabel}>
          Type de bien
        </label>
        <select id="type" name="type" defaultValue="" className={styles.searchInput}>
          <option value="">Tous les types</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.searchField}>
        <label htmlFor="prix_max" className={styles.searchLabel}>
          Budget max par mois
        </label>
        <input
          id="prix_max"
          name="prix_max"
          type="number"
          inputMode="numeric"
          min="0"
          step="5000"
          placeholder="Ex. 100 000 FCFA"
          className={`${styles.searchInput} tabular`}
        />
      </div>
      <button type="submit" className={styles.searchButton}>
        <Search size={19} strokeWidth={2.6} aria-hidden="true" />
        <span>Rechercher</span>
      </button>
    </form>
  );
}
