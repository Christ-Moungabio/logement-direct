"use client";

import { useActionState } from "react";
import Button from "../../../../components/ui/Button";
import listingStyles from "../../listings/components/Listings.module.css";
import { hideListing } from "../actions";
import { HIDE_REASON_MAX_LENGTH, HIDE_REASON_MIN_LENGTH } from "../schemas";
import styles from "./AdminListings.module.css";

export default function HideListingForm({ listingId, summaryClassName = listingStyles.confirmSummary }) {
  const [state, formAction, pending] = useActionState(hideListing, null);
  const fieldId = `hide-reason-${listingId}`;
  const error = state?.errors?.reason?.[0] ?? state?.formError;

  return (
    <details className={listingStyles.confirm}>
      <summary className={summaryClassName}>Masquer</summary>
      <div className={`${listingStyles.confirmBody} ${styles.hideBody}`}>
        <form action={formAction} className={listingStyles.confirmForm}>
          <input type="hidden" name="listingId" value={listingId} />
          <label className="text-body-sm" htmlFor={fieldId}>
            Motif, visible par le propriétaire
          </label>
          <textarea
            id={fieldId}
            name="reason"
            rows={3}
            required
            minLength={HIDE_REASON_MIN_LENGTH}
            maxLength={HIDE_REASON_MAX_LENGTH}
            defaultValue={state?.values?.reason}
            className={styles.textarea}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
          />
          {error && (
            <p id={`${fieldId}-error`} className={styles.error} role="alert">
              {error}
            </p>
          )}
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Masquage…" : "Masquer l'annonce"}
          </Button>
        </form>
      </div>
    </details>
  );
}
