"use client";

import { useActionState } from "react";
import Button from "../../../../components/ui/Button";
import { hideListingFromReport, rejectReport, resolveReport } from "../actions";
import { HIDE_REASON_MAX_LENGTH, HIDE_REASON_MIN_LENGTH } from "../schemas";
import adminStyles from "./AdminListings.module.css";
import styles from "./ReportDetail.module.css";

function HideFromReportForm({ reportId, listingId }) {
  const [state, formAction, pending] = useActionState(hideListingFromReport, null);
  const error = state?.errors?.reason?.[0] ?? state?.formError;

  return (
    <form action={formAction} className={styles.decisionForm}>
      <input type="hidden" name="reportId" value={reportId} />
      <input type="hidden" name="listingId" value={listingId} />
      <label className={styles.decisionLabel} htmlFor="hide-reason">
        Masquer l&apos;annonce
      </label>
      <p className="text-body-sm">
        Le motif s&apos;affiche dans l&apos;espace du propriétaire. Les autres signalements à traiter sur cette annonce
        passent aussi en Traité.
      </p>
      <textarea
        id="hide-reason"
        name="reason"
        rows={3}
        required
        minLength={HIDE_REASON_MIN_LENGTH}
        maxLength={HIDE_REASON_MAX_LENGTH}
        defaultValue={state?.values?.reason}
        className={adminStyles.textarea}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "hide-reason-error" : undefined}
      />
      {error && (
        <p id="hide-reason-error" className={adminStyles.error} role="alert">
          {error}
        </p>
      )}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Masquage…" : "Masquer l'annonce"}
      </Button>
    </form>
  );
}

export default function ReportDecision({ reportId, listing }) {
  return (
    <div className={styles.decision}>
      {listing?.status === "published" && <HideFromReportForm reportId={reportId} listingId={listing.id} />}

      <div className={styles.decisionForm}>
        <p className={styles.decisionLabel}>Sans masquer l&apos;annonce</p>
        <p className="text-body-sm">
          Traité : le problème est réglé autrement. Rejeté : le signalement n&apos;est pas fondé.
        </p>
        <div className={styles.decisionButtons}>
          <form action={resolveReport}>
            <input type="hidden" name="reportId" value={reportId} />
            <Button type="submit" size="sm" variant="secondary">
              Marquer comme traité
            </Button>
          </form>
          <form action={rejectReport}>
            <input type="hidden" name="reportId" value={reportId} />
            <Button type="submit" size="sm" variant="ghost">
              Rejeter le signalement
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
