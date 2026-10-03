"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Button from "../../../../components/ui/Button";
import Field from "../../auth/components/Field";
import styles from "./ListingForm.module.css";

const UTILITY_CHOICES = [
  { value: "individual", label: "Oui, individuel" },
  { value: "shared", label: "Oui, partagé" },
  { value: "none", label: "Non" },
];

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function Choices({ name, choices, defaultValue, onSelect, invalid }) {
  return (
    <div className={styles.choices}>
      {choices.map((choice, index) => (
        <label key={choice.value} className={styles.choice}>
          <input
            type="radio"
            name={name}
            value={choice.value}
            defaultChecked={defaultValue === choice.value}
            onChange={() => onSelect?.(choice.value)}
            aria-invalid={invalid && index === 0 ? true : undefined}
          />
          <span>{choice.label}</span>
        </label>
      ))}
    </div>
  );
}

export default function ListingForm({ action, options, initialValues = {}, submitLabel }) {
  const [state, formAction, pending] = useActionState(action, null);
  const formRef = useRef(null);

  const values = state?.values ?? initialValues;
  const errors = state?.errors ?? {};

  const [cityId, setCityId] = useState(values.cityId ?? "");
  const [availability, setAvailability] = useState(values.availability ?? "");

  useEffect(() => {
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [state]);

  const neighborhoods = options.neighborhoods.filter((item) => item.city_id === cityId);

  return (
    <form ref={formRef} action={formAction} className={styles.form} noValidate>
      {state?.formError && (
        <p className={styles.alert} role="alert">
          {state.formError}
        </p>
      )}

      <section className={styles.section}>
        <h2 className="text-heading-md">Le logement</h2>

        <Field id="propertyTypeId" label="Type de bien" error={errors.propertyTypeId}>
          {(describedBy) => (
            <select
              id="propertyTypeId"
              name="propertyTypeId"
              className={styles.input}
              defaultValue={values.propertyTypeId ?? ""}
              aria-invalid={errors.propertyTypeId ? true : undefined}
              aria-describedby={describedBy}
            >
              <option value="">Choisir un type</option>
              {options.propertyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {capitalize(type.name)}
                </option>
              ))}
            </select>
          )}
        </Field>

        <div className={styles.pair}>
          <Field id="cityId" label="Ville" error={errors.cityId}>
            {(describedBy) => (
              <select
                id="cityId"
                name="cityId"
                className={styles.input}
                value={cityId}
                onChange={(event) => setCityId(event.target.value)}
                aria-invalid={errors.cityId ? true : undefined}
                aria-describedby={describedBy}
              >
                <option value="">Choisir une ville</option>
                {options.cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field id="neighborhoodId" label="Quartier" error={errors.neighborhoodId}>
            {(describedBy) => (
              <select
                id="neighborhoodId"
                name="neighborhoodId"
                key={cityId}
                className={styles.input}
                defaultValue={values.neighborhoodId ?? ""}
                disabled={!cityId}
                aria-invalid={errors.neighborhoodId ? true : undefined}
                aria-describedby={describedBy}
              >
                <option value="">{cityId ? "Choisir un quartier" : "Choisissez d'abord la ville"}</option>
                {neighborhoods.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>

        <Field
          id="description"
          label="Description"
          hint="Décrivez le logement : pièces, état, ce qui est proche."
          error={errors.description}
        >
          {(describedBy) => (
            <textarea
              id="description"
              name="description"
              rows={5}
              className={`${styles.input} ${styles.textarea}`}
              defaultValue={values.description ?? ""}
              aria-invalid={errors.description ? true : undefined}
              aria-describedby={describedBy}
            />
          )}
        </Field>
      </section>

      <section className={styles.section}>
        <h2 className="text-heading-md">Prix</h2>

        <div className={styles.pair}>
          <Field id="monthlyRent" label="Loyer par mois (FCFA)" error={errors.monthlyRent}>
            {(describedBy) => (
              <input
                id="monthlyRent"
                name="monthlyRent"
                inputMode="numeric"
                className={styles.input}
                placeholder="150 000"
                defaultValue={values.monthlyRent ?? ""}
                aria-invalid={errors.monthlyRent ? true : undefined}
                aria-describedby={describedBy}
              />
            )}
          </Field>

          <Field
            id="advanceMonths"
            label="Avance demandée (mois)"
            hint="Entre 1 et 6 mois de loyer."
            error={errors.advanceMonths}
          >
            {(describedBy) => (
              <input
                id="advanceMonths"
                name="advanceMonths"
                inputMode="numeric"
                className={styles.input}
                placeholder="3"
                defaultValue={values.advanceMonths ?? ""}
                aria-invalid={errors.advanceMonths ? true : undefined}
                aria-describedby={describedBy}
              />
            )}
          </Field>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className="text-heading-md">Équipements</h2>

        <fieldset>
          <legend className={styles.legend}>Eau</legend>
          <Choices name="water" choices={UTILITY_CHOICES} defaultValue={values.water} invalid={errors.water} />
          {errors.water && <p className={styles.error}>{errors.water[0]}</p>}
        </fieldset>

        <fieldset>
          <legend className={styles.legend}>Électricité</legend>
          <Choices name="electricity" choices={UTILITY_CHOICES} defaultValue={values.electricity} invalid={errors.electricity} />
          {errors.electricity && <p className={styles.error}>{errors.electricity[0]}</p>}
        </fieldset>

        <Field
          id="doorsCount"
          label="Nombre de portes dans la parcelle (facultatif)"
          error={errors.doorsCount}
        >
          {(describedBy) => (
            <input
              id="doorsCount"
              name="doorsCount"
              inputMode="numeric"
              className={`${styles.input} ${styles.short}`}
              defaultValue={values.doorsCount ?? ""}
              aria-invalid={errors.doorsCount ? true : undefined}
              aria-describedby={describedBy}
            />
          )}
        </Field>
      </section>

      <section className={styles.section}>
        <h2 className="text-heading-md">Disponibilité</h2>

        <fieldset>
          <legend className={styles.legend}>Le logement est</legend>
          <Choices
            name="availability"
            choices={[
              { value: "available", label: "Libre" },
              { value: "available_soon", label: "Bientôt libre" },
            ]}
            defaultValue={availability}
            onSelect={setAvailability}
            invalid={errors.availability}
          />
          {errors.availability && <p className={styles.error}>{errors.availability[0]}</p>}
        </fieldset>

        {availability === "available_soon" && (
          <Field id="availableFrom" label="Libre à partir du" error={errors.availableFrom}>
            {(describedBy) => (
              <input
                id="availableFrom"
                name="availableFrom"
                type="date"
                className={`${styles.input} ${styles.short}`}
                defaultValue={values.availableFrom ?? ""}
                aria-invalid={errors.availableFrom ? true : undefined}
                aria-describedby={describedBy}
              />
            )}
          </Field>
        )}
      </section>

      <div className={styles.footer}>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Enregistrement…" : submitLabel}
        </Button>
        <p className="text-caption-sm">Le brouillon n&apos;est visible que par vous.</p>
      </div>
    </form>
  );
}
