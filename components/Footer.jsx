import Link from "next/link";
import { LogoMark } from "./Header";
import { SITE } from "../lib/constants";
import styles from "./Footer.module.css";

const COLUMNS = [
  {
    title: "Navigation",
    links: [
      { href: "/#accueil", label: "Accueil" },
      { href: "/#apropos", label: "À propos" },
      { href: "/#logements", label: "Logements" },
      { href: "/#comment-ca-marche", label: "Comment ça marche" },
      { href: "/#faq", label: "Questions fréquentes" },
    ],
  },
  {
    title: SITE.name,
    links: [
      { href: "/inscription?role=proprietaire", label: "Publier un logement" },
      { href: "/confidentialite", label: "Confidentialité" },
      { href: "/conditions", label: "Conditions d'utilisation" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={`text-display-xl ${styles.statement}`}>
          Trouvez votre prochain logement <span className="text-muted">avec plus de confiance.</span>
        </p>

        <div className={styles.grid}>
          <div className={styles.brand}>
            <p className={styles.logo}>
              <LogoMark size={36} />
              {SITE.name}
            </p>
            <p className={styles.meaning}>«&nbsp;Ndako&nbsp;» veut dire «&nbsp;maison&nbsp;» en lingala.</p>
          </div>

          <nav className={styles.columns} aria-label="Liens de pied de page">
            {COLUMNS.map((column) => (
              <div key={column.title} className={styles.column}>
                <p className={styles.columnTitle}>{column.title}</p>
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>
            © {new Date().getFullYear()} {SITE.name}. Tous droits réservés.
          </p>
          <p>Photos&nbsp;: Unsplash, sauf photo d&apos;accueil</p>
        </div>
      </div>
    </footer>
  );
}
