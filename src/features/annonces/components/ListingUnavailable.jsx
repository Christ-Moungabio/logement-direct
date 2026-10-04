import { SearchX } from "lucide-react";
import Button from "../../../../components/ui/Button";
import styles from "./ListingUnavailable.module.css";

// Écran identique pour tous les cas (inexistante, brouillon, fermée, masquée…) :
// il ne révèle ni la raison ni le contenu de l'annonce (EF-FIC-07).
export default function ListingUnavailable() {
  return (
    <div className={styles.box}>
      <span className={styles.icon}>
        <SearchX size={28} aria-hidden="true" />
      </span>
      <h1 className="text-display-lg">Annonce indisponible</h1>
      <p className={styles.text}>
        Cette annonce n&apos;existe pas ou n&apos;est plus en ligne. D&apos;autres logements vous attendent
        peut-être.
      </p>
      <Button href="/#logements" size="lg">
        Rechercher un logement
      </Button>
    </div>
  );
}
