import Link from "next/link";
import { Menu } from "lucide-react";
import { SITE } from "../lib/constants";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "/#logements", label: "Logements" },
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
  { href: "/#faq", label: "Questions fréquentes" },
];

export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={styles.mark}>
      <rect x="3.5" y="3.5" width="25" height="25" rx="8" stroke="var(--color-primary)" strokeWidth="3" />
      <path d="M10 17.5 16 12l6 5.5V23H10z" fill="var(--color-ink)" />
    </svg>
  );
}

// En-tête public (visiteur non connecté).
// Le menu mobile utilise <details> : il fonctionne sans JavaScript.
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label={`${SITE.name}, accueil`}>
          <LogoMark />
          {SITE.name}
        </Link>

        <nav className={styles.nav} aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/connexion" className={styles.login}>
            Connexion
          </Link>
          <Link href="/inscription" className={styles.cta}>
            Créer un compte
          </Link>

          <details className={styles.menu}>
            <summary className={styles.menuButton} aria-label="Ouvrir le menu">
              <Menu size={22} strokeWidth={2.2} aria-hidden="true" />
            </summary>
            <nav className={styles.menuPanel} aria-label="Menu mobile">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={styles.menuLink}>
                  {link.label}
                </Link>
              ))}
              <Link href="/connexion" className={styles.menuLink}>
                Connexion
              </Link>
              <Link href="/inscription" className={`${styles.menuLink} ${styles.menuCta}`}>
                Créer un compte
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
