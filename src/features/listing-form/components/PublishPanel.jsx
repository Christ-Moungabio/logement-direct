"use client";

import { useActionState } from "react";
import { Check, Circle } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { publishListing } from "../actions";
import styles from "./PublishPanel.module.css";

export default function PublishPanel({ listingId, checklist }) {
  const [state, formAction, pending] = useActionState(publishListing.bind(null, listingId), null);
  const ready = checklist.every((item) => item.done);

  return (
    <section className={styles.panel} aria-labelledby="publication-titre">
      <h2 id="publication-titre" className="text-heading-md">
        Avant la publication
      </h2>

      <ul className={styles.list}>
        {checklist.map((item) => (
          <li key={item.key} className={item.done ? styles.done : styles.missing}>
            {item.done ? <Check size={18} strokeWidth={2.6} aria-hidden="true" /> : <Circle size={18} aria-hidden="true" />}
            {item.label}
            <span className="visually-hidden">{item.done ? " : fait" : " : à compléter"}</span>
          </li>
        ))}
      </ul>

      <p className="text-body-sm">
        Cette liste suit ce qui est déjà enregistré : enregistrez le formulaire avant de publier.
        Une fois publiée, l&apos;annonce devient visible des locataires 5 minutes plus tard.
      </p>

      {state?.error && (
        <p className={styles.alert} role="alert">
          {state.error}
        </p>
      )}

      <form action={formAction}>
        <Button type="submit" size="lg" disabled={!ready || pending}>
          {pending ? "Publication…" : "Publier mon annonce"}
        </Button>
      </form>
    </section>
  );
}
