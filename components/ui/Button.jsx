import Link from "next/link";
import styles from "./Button.module.css";

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
