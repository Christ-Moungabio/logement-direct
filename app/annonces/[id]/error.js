"use client";

import { RotateCcw } from "lucide-react";
import Button from "../../../components/ui/Button";
import styles from "./error.module.css";

export default function ListingError({ reset }) {
  return (
    <main className={`container ${styles.box}`}>
      <h1 className="text-display-lg">Impossible d&apos;afficher l&apos;annonce</h1>
      <p className={styles.text}>Un problème technique est survenu. Vérifiez votre connexion puis réessayez.</p>
      <div className={styles.actions}>
        <Button size="lg" onClick={() => reset()}>
          <RotateCcw size={18} aria-hidden="true" />
          Réessayer
        </Button>
        <Button href="/#logements" variant="secondary" size="lg">
          Rechercher un logement
        </Button>
      </div>
    </main>
  );
}
