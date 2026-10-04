"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { CircleCheck, Flag, FlagOff, X } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { reportListing } from "../actions";
import { REPORT_REASON_LABELS, REPORT_REASONS } from "../labels";
import { REPORT_COMMENT_MAX_LENGTH } from "../schemas";
import styles from "./ReportDialog.module.css";

const INITIAL_STATE = { status: "idle" };

// Une fois l'annonce signalée, le bouton laisse place à un texte. La fenêtre
// reste ouverte le temps de lire le message, malgré le rafraîchissement de la page.
export default function ReportDialog({ listingId, alreadyReported }) {
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function openDialog() {
    setFormKey((key) => key + 1);
    setOpen(true);
  }

  if (alreadyReported && !open) {
    return (
      <p className={styles.reported}>
        <FlagOff size={16} aria-hidden="true" />
        Vous avez signalé cette annonce
      </p>
    );
  }

  return (
    <>
      <button type="button" className={styles.trigger} onClick={openDialog}>
        <Flag size={16} aria-hidden="true" />
        Signaler l&apos;annonce
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={`signalement-titre-${formKey}`}
        onClose={() => setOpen(false)}
        onClick={(event) => event.target === event.currentTarget && setOpen(false)}
      >
        <div className={styles.panel}>
          <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Fermer">
            <X size={20} aria-hidden="true" />
          </button>
          {open && <ReportForm key={formKey} listingId={listingId} formKey={formKey} onClose={() => setOpen(false)} />}
        </div>
      </dialog>
    </>
  );
}

function ReportForm({ listingId, formKey, onClose }) {
  const [state, formAction, pending] = useActionState(reportListing, INITIAL_STATE);
  const [comment, setComment] = useState("");
  const baseId = useId();
  const titleId = `signalement-titre-${formKey}`;
  const ids = { reasonError: `${baseId}-motif-erreur`, comment: `${baseId}-commentaire`, commentHint: `${baseId}-commentaire-aide` };

  if (state.status === "success" || state.status === "already_reported") {
    return (
      <div className={styles.form} role="status">
        <h2 id={titleId} className={`text-heading-md ${styles.title}`}>
          <CircleCheck size={22} className={styles.success} aria-hidden="true" />
          {state.status === "success" ? "Signalement envoyé" : "Déjà signalée"}
        </h2>
        <p className={styles.intro}>{state.message}</p>
        <Button size="lg" onClick={onClose} className={styles.action}>
          Fermer
        </Button>
      </div>
    );
  }

  const reasonError = state.fieldErrors?.reason;
  const commentError = state.fieldErrors?.comment;
  const formError =
    state.status === "unauthorized" ||
    state.status === "error" ||
    (state.status === "invalid" && !reasonError && !commentError)
      ? state.message
      : null;

  return (
    <form action={formAction} className={styles.form} noValidate>
      <div>
        <h2 id={titleId} className="text-heading-md">
          Signaler l&apos;annonce
        </h2>
        <p className={styles.intro}>
          Votre signalement est transmis à l&apos;équipe de modération. Le propriétaire ne voit pas qui l&apos;a
          envoyé.
        </p>
      </div>

      {formError && (
        <p className={styles.alert} role="alert">
          {formError}
        </p>
      )}

      <input type="hidden" name="listingId" value={listingId} />

      <fieldset aria-describedby={reasonError ? ids.reasonError : undefined}>
        <legend className={styles.label}>
          Motif <span aria-hidden="true">*</span>
          <span className="visually-hidden"> (obligatoire)</span>
        </legend>
        <div className={styles.reasons} data-invalid={reasonError ? true : undefined}>
          {REPORT_REASONS.map((reason) => (
            <label key={reason} className={styles.reason}>
              <input type="radio" name="reason" value={reason} required />
              {REPORT_REASON_LABELS[reason]}
            </label>
          ))}
        </div>
        {reasonError && (
          <p id={ids.reasonError} className={styles.error}>
            {reasonError}
          </p>
        )}
      </fieldset>

      <div className={styles.field}>
        <label htmlFor={ids.comment} className={styles.label}>
          Commentaire <span className={styles.optional}>(facultatif)</span>
        </label>
        <textarea
          id={ids.comment}
          name="comment"
          rows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={REPORT_COMMENT_MAX_LENGTH}
          placeholder="Précisez ce qui ne va pas, si vous le souhaitez."
          className={styles.textarea}
          aria-invalid={commentError ? true : undefined}
          aria-describedby={ids.commentHint}
        />
        <p id={ids.commentHint} className={commentError ? styles.error : styles.hint}>
          {commentError ?? `${comment.length} / ${REPORT_COMMENT_MAX_LENGTH} caractères`}
        </p>
      </div>

      <div className={styles.footer}>
        <Button variant="secondary" size="lg" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Envoi en cours…" : "Envoyer le signalement"}
        </Button>
      </div>
    </form>
  );
}
