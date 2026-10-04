import { capitalize } from "@/lib/format";
import styles from "../recherche.module.css";

export function SearchForm({ options }) {
  return (
    <form action="/recherche" method="get" className={styles.searchForm}>
      <p className={styles.searchTagline}>
        Réservez votre visite sans intermédiaire payant
      </p>

      <select
        name="ville"
        required
        aria-label="Ville"
        defaultValue=""
        className={styles.select}
      >
        <option value="" disabled>
          Choisir une ville
        </option>
        {options.cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>

      <select
        name="types"
        aria-label="Type de bien"
        defaultValue=""
        className={styles.select}
      >
        <option value="">Tous les types</option>
        {options.propertyTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {capitalize(type.name)}
          </option>
        ))}
      </select>

      <input
        name="loyerMax"
        inputMode="numeric"
        placeholder="Budget maximum (FCFA)"
        aria-label="Budget maximum en FCFA"
        className={styles.input}
      />

      <button type="submit" className={styles.primaryButton}>
        Rechercher
      </button>
    </form>
  );
}