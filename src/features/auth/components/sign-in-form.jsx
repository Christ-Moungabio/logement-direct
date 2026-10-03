"use client";

import { CircleAlert } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signIn } from "../actions";

/** @param {{ redirectTo: string }} props */
export function SignInForm({ redirectTo }) {
  const [state, formAction, pending] = useActionState(signIn, {
    status: "idle",
  });

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div className="grid gap-2">
        <Label htmlFor="whatsappNumber">Numéro WhatsApp</Label>
        <Input
          id="whatsappNumber"
          name="whatsappNumber"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="06 123 45 67"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state.status === "error" && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-destructive-soft px-3 py-2 text-sm text-destructive"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
