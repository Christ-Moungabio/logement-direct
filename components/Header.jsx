import { Suspense } from "react";
import Link from "next/link";
import { SITE } from "../lib/constants";
import HeaderAccount from "./HeaderAccount";
import NavPills from "./NavPills";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/recherche", label: "Rechercher" },
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
  { href: "/#faq", label: "Questions" },
];

export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={styles.mark}>
      <rect x="3.5" y="3.5" width="25" height="25" rx="8" stroke="var(--logo-frame, var(--color-primary))" strokeWidth="3" />
      <path d="M10 17.5 16 12l6 5.5V23H10z" fill="var(--logo-house, var(--color-ink))" />
    </svg>
  );
}

export default function Header({ overlay = false }) {
  return (
    <header className={`${styles.header} ${overlay ? styles.overlay : ""}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={`${SITE.name}, accueil`}>
          <LogoMark />
          {SITE.name}
        </Link>

        <NavPills links={NAV_LINKS} />

        <Suspense fallback={<div className={styles.actions} aria-hidden="true" />}>
          <HeaderAccount navLinks={NAV_LINKS} />
        </Suspense>
      </div>
    </header>
  );
}
