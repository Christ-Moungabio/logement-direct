"use client";

import { CircleAlert, CircleCheck, Flag, FlagOff } from "lucide-react";
import { useActionState, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import { reportListing } from "../actions";
import { REPORT_REASON_LABELS, REPORT_REASONS } from "../labels";
import { REPORT_COMMENT_MAX_LENGTH } from "../schemas";

/** @type {import("../types").ReportFormState} */
const INITIAL_STATE = { status: "idle" };

/**
 * Formulaire de signalement, réservé aux locataires connectés.
 * Une fois l'annonce signalée, le bouton laisse place à un texte ; la fenêtre
 * reste ouverte le temps de lire le message, malgré le rafraîchissement de la page.
 *
 * @param {{ listingId: string, alreadyReported: boolean, triggerClassName?: string }} props
 */
export function ReportDialog({ listingId, alreadyReported, triggerClassName }) {
  const [open, setOpen] = useState(false);
  // Changer la clé remet le formulaire à zéro à chaque ouverture.
  const [formKey, setFormKey] = useState(0);

  if (alreadyReported && !open) {
    return (
      <p className="inline-flex min-h-11 items-center gap-2 px-3 text-sm text-muted-foreground">
        <FlagOff className="size-4" aria-hidden="true" />
        Vous avez signalé cette annonce
      </p>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setFormKey((key) => key + 1);
      }}
    >
      <DialogTrigger className={triggerClassName}>
        <Flag className="size-4" aria-hidden="true" />
        Signaler l&apos;annonce
      </DialogTrigger>
      <DialogContent>
        <ReportForm key={formKey} listingId={listingId} />
      </DialogContent>
    </Dialog>
  );
}

function ReportForm({ listingId }) {
  const [state, formAction, pending] = useActionState(
    reportListing,
    INITIAL_STATE,
  );
  const [comment, setComment] = useState("");
  const ids = {
    reason: useId(),
    reasonError: useId(),
    comment: useId(),
    commentHint: useId(),
  };

  if (state.status === "success" || state.status === "already_reported") {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CircleCheck className="size-5 text-success" aria-hidden="true" />
            {state.status === "success"
              ? "Signalement envoyé"
              : "Déjà signalée"}
          </DialogTitle>
          <DialogDescription role="status">{state.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Fermer</Button>
          </DialogClose>
        </DialogFooter>
      </>
    );
  }

  const reasonError = state.fieldErrors?.reason;
  const commentError = state.fieldErrors?.comment;
  const globalError =
    state.status === "unauthorized" ||
    state.status === "error" ||
    (state.status === "invalid" && !reasonError && !commentError)
      ? state.message
      : null;

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <DialogHeader>
        <DialogTitle>Signaler l&apos;annonce</DialogTitle>
        <DialogDescription>
          Votre signalement est transmis à l&apos;équipe de modération. Le
          propriétaire ne voit pas qui l&apos;a envoyé.
        </DialogDescription>
      </DialogHeader>

      <input type="hidden" name="listingId" value={listingId} />

      <fieldset className="grid gap-3">
        <legend id={ids.reason} className="mb-3 text-sm font-semibold">
          Motif <span className="text-destructive">*</span>
          <span className="sr-only"> (obligatoire)</span>
        </legend>
        <RadioGroup
          name="reason"
          required
          aria-labelledby={ids.reason}
          aria-invalid={reasonError ? true : undefined}
          aria-describedby={reasonError ? ids.reasonError : undefined}
        >
          {REPORT_REASONS.map((reason) => (
            <div key={reason} className="flex items-center gap-3">
              <RadioGroupItem value={reason} id={`${ids.reason}-${reason}`} />
              <Label
                htmlFor={`${ids.reason}-${reason}`}
                className="leading-snug font-normal"
              >
                {REPORT_REASON_LABELS[reason]}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {reasonError && (
          <p id={ids.reasonError} className="text-sm text-destructive">
            {reasonError}
          </p>
        )}
      </fieldset>

      <div className="grid gap-2">
        <Label htmlFor={ids.comment}>
          Commentaire{" "}
          <span className="font-normal text-muted-foreground">
            (facultatif)
          </span>
        </Label>
        <Textarea
          id={ids.comment}
          name="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={REPORT_COMMENT_MAX_LENGTH}
          placeholder="Précisez ce qui ne va pas, si vous le souhaitez."
          aria-invalid={commentError ? true : undefined}
          aria-describedby={ids.commentHint}
        />
        <p
          id={ids.commentHint}
          className={
            commentError
              ? "text-sm text-destructive"
              : "text-xs text-muted-foreground"
          }
        >
          {commentError ??
            `${comment.length} / ${REPORT_COMMENT_MAX_LENGTH} caractères`}
        </p>
      </div>

      {globalError && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-destructive-soft px-3 py-2 text-sm text-destructive"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {globalError}
        </p>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Annuler
          </Button>
        </DialogClose>
        <Button type="submit" disabled={pending}>
          {pending ? "Envoi en cours…" : "Envoyer le signalement"}
        </Button>
      </DialogFooter>
    </form>
  );
}
