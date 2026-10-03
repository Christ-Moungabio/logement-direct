"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "../../../../components/ui/Button";
import { signUp } from "../actions";
import { fieldErrors, PASSWORD_MIN_LENGTH, signupSchema } from "../schemas";
import Field from "./Field";
import PasswordInput from "./PasswordInput";
import styles from "./AuthForm.module.css";

const ROLES = [
  { value: "tenant", title: "Je cherche un logement", text: "Contactez les propriétaires directement." },
  { value: "owner", title: "Je propose un logement", text: "Publiez vos annonces gratuitement." },
];

export default function SignupForm({ initialRole }) {
  const [state, formAction, pending] = useActionState(signUp, null);
  const [clientErrors, setClientErrors] = useState(null);
  const formRef = useRef(null);

  const errors = clientErrors ?? state?.errors ?? {};
  const values = state?.values ?? { role: initialRole };

  useEffect(() => {
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [state, clientErrors]);

  // Même schéma que le serveur : les erreurs simples s'affichent sans aller-retour.
  function handleSubmit(event) {
    const parsed = signupSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      event.preventDefault();
      setClientErrors(fieldErrors(parsed.error));
      return;
    }
    setClientErrors(null);
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className={styles.form} noValidate>
      {state?.formError && !clientErrors && (
        <p className={styles.alert} role="alert">
          {state.formError}
        </p>
      )}

      <fieldset aria-describedby={errors.role ? "role-erreur" : undefined}>
        <legend className={`${styles.label} ${styles.legend}`}>Vous êtes</legend>
        <div className={`${styles.roles} ${errors.role ? styles.rolesInvalid : ""}`}>
          {ROLES.map((role) => (
            <label key={role.value} className={styles.role}>
              <input
                type="radio"
                name="role"
                value={role.value}
                defaultChecked={values.role === role.value}
                aria-invalid={errors.role && role.value === "tenant" ? true : undefined}
              />
              <span className={styles.roleTitle}>{role.title}</span>
              <span className={styles.roleText}>{role.text}</span>
            </label>
          ))}
        </div>
        {errors.role && (
          <p id="role-erreur" className={`${styles.error} ${styles.groupError}`}>
            {errors.role[0]}
          </p>
        )}
      </fieldset>

      <Field id="fullName" label="Nom complet" error={errors.fullName}>
        {(describedBy) => (
          <input
            id="fullName"
            name="fullName"
            className={styles.input}
            autoComplete="name"
            defaultValue={values.fullName}
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={describedBy}
          />
        )}
      </Field>

      <Field id="email" label="Adresse e-mail" hint="Elle sert à vous connecter." error={errors.email}>
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

      <Field
        id="whatsappNumber"
        label="Numéro WhatsApp"
        hint="Un numéro ne peut servir qu'à un seul compte."
        error={errors.whatsappNumber}
      >
        {(describedBy) => (
          <div className={styles.phone}>
            <span className={styles.prefix} aria-hidden="true">
              +242
            </span>
            <input
              id="whatsappNumber"
              name="whatsappNumber"
              type="tel"
              className={styles.input}
              autoComplete="tel-national"
              inputMode="tel"
              placeholder="06 123 45 67"
              defaultValue={values.whatsappNumber}
              aria-invalid={errors.whatsappNumber ? true : undefined}
              aria-describedby={describedBy}
            />
          </div>
        )}
      </Field>

      <div className={styles.field}>
        <span className={styles.label}>Ville</span>
        <p className={styles.static}>
          Brazzaville <span>Seule ville couverte pour l&apos;instant</span>
        </p>
      </div>

      <Field
        id="password"
        label="Mot de passe"
        hint={`${PASSWORD_MIN_LENGTH} caractères minimum.`}
        error={errors.password}
      >
        {(describedBy) => (
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={describedBy}
          />
        )}
      </Field>

      <Field id="passwordConfirm" label="Confirmez le mot de passe" error={errors.passwordConfirm}>
        {(describedBy) => (
          <PasswordInput
            id="passwordConfirm"
            name="passwordConfirm"
            autoComplete="new-password"
            aria-invalid={errors.passwordConfirm ? true : undefined}
            aria-describedby={describedBy}
          />
        )}
      </Field>

      <div className={styles.field}>
        <label className={styles.check}>
          <input
            type="checkbox"
            name="terms"
            defaultChecked={values.terms}
            aria-invalid={errors.terms ? true : undefined}
            aria-describedby={errors.terms ? "terms-erreur" : undefined}
          />
          <span>
            J&apos;accepte les{" "}
            <Link href="/conditions" target="_blank">
              conditions d&apos;utilisation
            </Link>{" "}
            et j&apos;ai lu la page{" "}
            <Link href="/confidentialite" target="_blank">
              confidentialité
            </Link>
            .
          </span>
        </label>
        {errors.terms && (
          <p id="terms-erreur" className={styles.error}>
            {errors.terms[0]}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" fullWidth className={styles.submit} disabled={pending}>
        {pending ? "Création du compte…" : "Créer mon compte"}
      </Button>

      <p className={styles.switch}>
        Déjà un compte ? <Link href="/connexion">Se connecter</Link>
      </p>
    </form>
  );
}
