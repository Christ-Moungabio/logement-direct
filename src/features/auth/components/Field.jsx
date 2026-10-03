import styles from "./AuthForm.module.css";

export default function Field({ id, label, hint, error, children }) {
  const hintId = hint ? `${id}-aide` : null;
  const errorId = error ? `${id}-erreur` : null;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children(describedBy)}
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error[0]}
        </p>
      )}
    </div>
  );
}
