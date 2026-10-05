"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "../../../../components/ui/Button";
import { signIn } from "../actions";
import { signupPath } from "../navigation";
import { fieldErrors, loginSchema } from "../schemas";
import Field from "./Field";
import PasswordInput from "./PasswordInput";
import styles from "./AuthForm.module.css";

export default function LoginForm({ next, notice }) {
  const [state, formAction, pending] = useActionState(signIn, null);
  const [clientErrors, setClientErrors] = useState(null);
  const formRef = useRef(null);

  const errors = clientErrors ?? state?.errors ?? {};
  const values = state?.values ?? {};

  useEffect(() => {
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [state, clientErrors]);

  function handleSubmit(event) {
    const parsed = loginSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      event.preventDefault();
      setClientErrors(fieldErrors(parsed.error));
      return;
    }
    setClientErrors(null);
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className={styles.form} noValidate>
      {notice && !state && (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      )}

      {state?.formError && !clientErrors && (
        <p className={styles.alert} role="alert">
          {state.formError}
        </p>
      )}

      {next && <input type="hidden" name="next" value={next} />}

      <Field id="email" label="Adresse e-mail" error={errors.email}>
        {(describedBy) => (
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            autoComplete="email"
            inputMode="email"
            placeholder="nom@exemple.com"
            defaultValue={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy}
          />
        )}
      </Field>

      <Field id="password" label="Mot de passe" error={errors.password}>
        {(describedBy) => (
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={describedBy}
          />
        )}
      </Field>

      <Button type="submit" size="lg" fullWidth className={styles.submit} disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </Button>

      <p className={styles.switch}>
        Pas encore de compte ? <Link href={signupPath(next)}>Créer un compte</Link>
      </p>
    </form>
  );
}
