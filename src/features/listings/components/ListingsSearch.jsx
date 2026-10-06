"use client";

import Form from "next/form";
import { Search } from "lucide-react";
import { SORTS } from "../search";
import styles from "./OwnerListings.module.css";

export default function ListingsSearch({ q, sort, statut }) {
  return (
    <Form action="/mes-annonces" className={styles.search} role="search">
      {statut && <input type="hidden" name="statut" value={statut} />}

      <label htmlFor="listings-search" className="visually-hidden">
        Rechercher dans mes annonces
      </label>
      <span className={styles.searchField}>
        <Search size={16} strokeWidth={2} aria-hidden="true" className={styles.searchIcon} />
        <input
          id="listings-search"
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Quartier ou type"
          className={styles.searchInput}
        />
      </span>

      <label htmlFor="listings-sort" className="visually-hidden">
        Trier les annonces
      </label>
      <select
        id="listings-sort"
        name="tri"
        defaultValue={SORTS[sort].param ?? ""}
        className={styles.sortSelect}
        onChange={(event) => event.currentTarget.form.requestSubmit()}
      >
        {Object.values(SORTS).map((item) => (
          <option key={item.label} value={item.param ?? ""}>
            {item.label}
          </option>
        ))}
      </select>
    </Form>
  );
}
