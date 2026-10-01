import Link from "next/link";
import { SITE } from "../lib/constants";
import styles from "./Footer.module.css";

const FOOTER_LINKS = [
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
  { href: "/conditions", label: "Conditions d'utilisation" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <nav className={styles.links} aria-label="Liens de pied de page">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} {SITE.name} · Congo-Brazzaville
        </p>
      </div>
    </footer>
  );
}
