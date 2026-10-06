import Form from "next/form";
import { Search } from "lucide-react";
import styles from "../../app/page.module.css";

export default function HeroSearch({ propertyTypes }) {
  return (
    <Form action="/recherche" className={styles.search} role="search" aria-label="Rechercher un logement">
      <div className={styles.searchField}>
        <label htmlFor="types" className={styles.searchLabel}>
          Type de bien
        </label>
        <select id="types" name="types" defaultValue="" className={styles.searchInput}>
          <option value="">Tous les types</option>
          {propertyTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.searchField}>
        <label htmlFor="loyerMax" className={styles.searchLabel}>
          Budget max par mois
        </label>
        <input
          id="loyerMax"
          name="loyerMax"
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
    </Form>
  );
}
