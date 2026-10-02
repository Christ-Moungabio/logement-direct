"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ListingCard from "../ListingCard";
import { PROPERTY_TYPES } from "../../lib/constants";
import { formatAmount } from "../../lib/format";
import { EMPTY_CRITERIA, SEARCH_EVENT, matchesCriteria } from "../../lib/search";
import styles from "./ListingsExplorer.module.css";

const TYPE_FILTERS = [{ value: "", label: "Tous les types" }, ...PROPERTY_TYPES];

// V1 Brazzaville seule (lib/constants.js) : pas de filtre par ville tant qu'il
// n'y a qu'une seule option. À réintroduire ici quand une 2e ville s'ajoutera.
export default function ListingsExplorer({ listings, initialCriteria = EMPTY_CRITERIA }) {
  const [criteria, setCriteria] = useState(initialCriteria);
  // Tri par défaut : plus récentes d'abord (RG-19).
  const visible = listings
    .filter((listing) => matchesCriteria(listing, criteria))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const isFiltered = criteria.type || criteria.budget;

  // Critères envoyés par la barre de recherche du hero.
  useEffect(() => {
    function handleSearch(event) {
      setCriteria({ ...EMPTY_CRITERIA, ...event.detail });
    }
    window.addEventListener(SEARCH_EVENT, handleSearch);
    return () => window.removeEventListener(SEARCH_EVENT, handleSearch);
  }, []);

  function update(key, value) {
    setCriteria((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className={styles.explorer}>
      <div className={styles.filters} role="group" aria-label="Filtrer par type de bien">
        {TYPE_FILTERS.map((item) => (
          <button
            key={item.value || "tous"}
            type="button"
            className={styles.filter}
            aria-pressed={criteria.type === item.value}
            onClick={() => update("type", item.value)}
          >
            {item.label}
          </button>
        ))}
        {criteria.budget && (
          <button type="button" className={styles.budget} onClick={() => update("budget", "")}>
            <span className="tabular">Jusqu&apos;à {formatAmount(Number(criteria.budget))} FCFA</span>
            <X size={15} strokeWidth={2.6} aria-label="Retirer le budget" />
          </button>
        )}
      </div>

      <p className={styles.count} aria-live="polite">
        {visible.length} logement{visible.length > 1 ? "s" : ""} · annonces de démonstration
      </p>

      {visible.length > 0 ? (
        <ul className={styles.grid}>
          {visible.map((listing) => (
            <li key={listing.id}>
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p>Aucune annonce de démonstration ne correspond à ces critères.</p>
          {isFiltered && (
            <button type="button" className={styles.reset} onClick={() => setCriteria(EMPTY_CRITERIA)}>
              Effacer les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
}
