import Link from "next/link";
import Button from "./ui/Button";
import { SITE } from "../lib/constants";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "/recherche", label: "Rechercher un logement" },
  { href: "/inscription", label: "Publier un logement" },
];

// En-tête public (visiteur non connecté).
// Le menu mobile utilise <details> : il fonctionne sans JavaScript.
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.mark} aria-hidden="true" />
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
          <Button href="/connexion" variant="ghost">
            Connexion
          </Button>
          <Button href="/inscription" variant="secondary" className={styles.signup}>
            Créer un compte
          </Button>

          <details className={styles.menu}>
            <summary className={styles.menuButton} aria-label="Ouvrir le menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </summary>
            <nav className={styles.menuPanel} aria-label="Menu mobile">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={styles.menuLink}>
                  {link.label}
                </Link>
              ))}
              <Link href="/inscription" className={styles.menuLink}>
                Créer un compte
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
