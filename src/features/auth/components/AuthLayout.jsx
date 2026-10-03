import Image from "next/image";
import { Check } from "lucide-react";
import photo from "../../../../public/images/galerie-salon.jpg";
import styles from "./AuthLayout.module.css";

const PROMISES = [
  "Annonces publiées par les propriétaires eux-mêmes",
  "Contact direct par WhatsApp ou appel",
  "Aucun démarcheur à payer",
];

export default function AuthLayout({ title, intro, children }) {
  return (
    <main className={`container ${styles.page}`}>
      <section className={styles.panel} aria-labelledby="auth-titre">
        <div className={styles.head}>
          <h1 id="auth-titre" className="text-display-lg">
            {title}
          </h1>
          {intro && <p className={styles.intro}>{intro}</p>}
        </div>
        {children}
      </section>

      <aside className={styles.visual} aria-hidden="true">
        <Image src={photo} alt="" fill sizes="45vw" className={styles.photo} />
        <div className={styles.overlay}>
          <p className={styles.overlayTitle}>Louer à Brazzaville, sans intermédiaire</p>
          <ul className={styles.promises}>
            {PROMISES.map((promise) => (
              <li key={promise}>
                <Check size={18} strokeWidth={2.6} />
                {promise}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </main>
  );
}
