"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { capitalize } from "@/lib/format";
import { buildSearchHref } from "../url";
import styles from "../recherche.module.css";

const VISIBLE_NEIGHBORHOODS = 6;

function toggle(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function parseAmount(value) {
  const amount = Number(value.replace(/\s/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : undefined;
}

export function FiltersPanel({ filters, options }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [ville, setVille] = useState(filters.ville ?? "");
  const [quartiers, setQuartiers] = useState(filters.quartiers);
  const [types, setTypes] = useState(filters.types);
  const [loyerMin, setLoyerMin] = useState(filters.loyerMin?.toString() ?? "");
  const [loyerMax, setLoyerMax] = useState(filters.loyerMax?.toString() ?? "");

  const neighborhoods = options.neighborhoods.filter((n) => n.cityId === ville);
  const shownNeighborhoods = showAll
    ? neighborhoods
    : neighborhoods.slice(0, VISIBLE_NEIGHBORHOODS);

  function onSubmit(event) {
    event.preventDefault();
    setOpen(false);
    router.push(
      buildSearchHref(filters, {
        ville: ville || undefined,
        quartiers,
        types,
        loyerMin: parseAmount(loyerMin),
        loyerMax: parseAmount(loyerMax),
        page: 1,
      }),
    );
  }

  return (
    <div>
      <button
        type="button"
        className={styles.filtersToggle}
        aria-expanded={open}
        aria-controls="filters-form"
        onClick={() => setOpen(!open)}
      >
        Filtres
      </button>

      <form
        id="filters-form"
        onSubmit={onSubmit}
        className={`${styles.filtersForm} ${open ? styles.filtersFormOpen : ""}`}
      >
        <div className={styles.filtersHeader}>
          <h2 className={styles.filtersTitle}>Filtres</h2>
          <Link href="/recherche" className={styles.resetLink}>
            Réinitialiser
          </Link>
        </div>

        <div className={styles.field}>
          <label htmlFor="filtre-ville" className={styles.label}>
            Ville
          </label>
          <select
            id="filtre-ville"
            value={ville}
            onChange={(e) => {
              setVille(e.target.value);
              setQuartiers([]);
              setShowAll(false);
            }}
            className={styles.select}
          >
            <option value="">Toutes les villes</option>
            {options.cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>Quartier</legend>
          {ville === "" ? (
            <p className={styles.hint}>
              Choisissez une ville pour voir les quartiers.
            </p>
          ) : (
            shownNeighborhoods.map((n) => (
              <label key={n.id} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={quartiers.includes(n.id)}
                  onChange={() => setQuartiers(toggle(quartiers, n.id))}
                />
                {n.name}
              </label>
            ))
          )}
          {neighborhoods.length > VISIBLE_NEIGHBORHOODS && (
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Voir moins" : "Voir tous les quartiers"}
            </button>
          )}
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>Type de bien</legend>
          {options.propertyTypes.map((type) => (
            <label key={type.id} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={types.includes(type.id)}
                onChange={() => setTypes(toggle(types, type.id))}
              />
              {capitalize(type.name)}
            </label>
          ))}
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>Loyer par mois (FCFA)</legend>
          <div className={styles.amounts}>
            <label className={styles.amountField}>
              Minimum
              <input
                inputMode="numeric"
                value={loyerMin}
                onChange={(e) => setLoyerMin(e.target.value)}
                placeholder="0"
                className={styles.input}
              />
            </label>
            <label className={styles.amountField}>
              Maximum
              <input
                inputMode="numeric"
                value={loyerMax}
                onChange={(e) => setLoyerMax(e.target.value)}
                className={styles.input}
              />
            </label>
          </div>
        </fieldset>

        <button type="submit" className={styles.primaryButton}>
          Appliquer les filtres
        </button>
      </form>
    </div>
  );
}