import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import { formatLongDate } from "../lib/format";
import styles from "./LegalPage.module.css";

export default function LegalPage({ title, updatedAt, intro, sections, related }) {
  return (
    <>
      <Header />

      <main className={`container ${styles.page}`}>
        <div className={styles.head}>
          <h1 className="text-display-xl">{title}</h1>
          <p className={styles.updated}>Mise à jour le {formatLongDate(updatedAt)}</p>
          <p className={styles.intro}>{intro}</p>
        </div>

        <nav className={styles.toc} aria-label="Sommaire">
          <p className={styles.tocTitle}>Sommaire</p>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.sections}>
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={styles.section}
              aria-labelledby={`${section.id}-titre`}
            >
              <h2 id={`${section.id}-titre`} className="text-heading-md">
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.items && (
                <ul className={styles.list}>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.after?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <p className={styles.related}>
            Voir aussi&nbsp;: <Link href={related.href}>{related.label}</Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
