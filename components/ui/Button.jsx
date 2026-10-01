import Link from "next/link";
import styles from "./Button.module.css";

/**
 * Bouton du design system. Rend un <Link> si `href` est fourni, sinon un <button>.
 *
 * variant : "primary" | "secondary" | "ghost" | "inverse" (sur fond sombre)
 * size    : "sm" (32 px) | "md" (36 px) | "lg" (44 px)
 */
export default function Button({
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...props
}) {
  const classes = [styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
