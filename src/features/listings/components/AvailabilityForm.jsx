"use client";

import { useActionState } from "react";
import Button from "../../../../components/ui/Button";
import { updateAvailability } from "../actions";
import styles from "./Listings.module.css";

export default function AvailabilityForm({ listingId, soon, availableFrom, minDate }) {
  const [state, formAction, pending] = useActionState(updateAvailability, null);

  return (
    <form action={formAction} className={styles.confirmForm}>
      <input type="hidden" name="id" value={listingId} />

      <label className={styles.radio}>
        <input type="radio" name="availability" value="available" defaultChecked={!soon} />
        Libre
      </label>
      <label className={styles.radio}>
        <input type="radio" name="availability" value="available_soon" defaultChecked={soon} />
        Bientôt libre
      </label>

      <label className="text-body-sm" htmlFor={`date-${listingId}`}>
        Libre à partir du (si bientôt libre)
      </label>
      <input
        id={`date-${listingId}`}
        type="date"
        name="availableFrom"
        min={minDate}
        className={styles.select}
        defaultValue={soon ? availableFrom : ""}
        aria-invalid={state?.error ? true : undefined}
      />

      {state?.error && (
        <p className={styles.formError} role="alert">
          {state.error}
        </p>
      )}
      {state?.saved && (
        <p className={styles.formSaved} role="status">
          Disponibilité enregistrée.
        </p>
      )}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
