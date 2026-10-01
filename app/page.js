import Form from "next/form";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import Button from "../components/ui/Button";
import { CITIES, PROPERTY_TYPES } from "../lib/constants";
import { RECENT_LISTINGS } from "../data/listings";
import styles from "./page.module.css";

const STEPS = [
  {
    title: "Cherchez",
    text: "Filtrez par ville, quartier, type de bien et budget. Triez par date ou par prix.",
  },
  {
    title: "Réservez une visite",
    text: "Choisissez un créneau libre. Le propriétaire confirme ou refuse sous 48 heures.",
  },
  {
    title: "Rencontrez le propriétaire",
    text: "Contactez-le par WhatsApp ou par appel. La réservation finale et la caution se règlent directement avec lui, en dehors de la plateforme.",
  },
];

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={`container container--narrow ${styles.heroInner}`}>
            <h1 id="hero-title" className={`text-display-xl ${styles.heroTitle}`}>
              Trouvez un logement à louer, directement auprès des propriétaires
            </h1>
            <p className={styles.heroText}>
              Studios, chambres, appartements et maisons à Brazzaville, Pointe-Noire et Dolisie. Réservez votre visite en
              ligne, sans intermédiaire payant.
            </p>

            {/* GET vers /recherche : ?ville=…&type=…&prix_max=… */}
            <Form action="/recherche" className={styles.search} role="search" aria-label="Rechercher un logement">
              <div className={styles.field}>
                <label htmlFor="ville" className={styles.label}>
                  Ville
                </label>
                <select id="ville" name="ville" className={styles.input} defaultValue={CITIES[0].value}>
                  {CITIES.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="type" className={styles.label}>
                  Type de bien
                </label>
                <select id="type" name="type" className={styles.input} defaultValue="">
                  <option value="">Tous les types</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="prix_max" className={styles.label}>
                  Budget max par mois (FCFA)
                </label>
                <input
                  id="prix_max"
                  name="prix_max"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  placeholder="Ex. 100000"
                  className={styles.input}
                />
              </div>
              <Button type="submit" size="lg" className={styles.searchButton}>
                <SearchIcon />
                Rechercher
              </Button>
            </Form>

            <div className={styles.types}>
              <span className={styles.typesLabel}>Par type :</span>
              {PROPERTY_TYPES.map((type) => (
                <Link key={type.value} href={`/recherche?type=${type.value}`} className={styles.chip}>
                  {type.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={`container ${styles.section}`} aria-labelledby="villes-title">
          <h2 id="villes-title" className="text-heading-lg">
            Parcourir par ville
          </h2>
          <div className={styles.cityGrid}>
            {CITIES.map((city) => (
              <Link key={city.value} href={`/recherche?ville=${city.value}`} className={styles.cityCard}>
                <span className="text-heading-md">{city.label}</span>
                {city.districts.length > 0 && (
                  <span className={styles.muted}>
                    {city.districts.slice(0, 4).join(", ")}
                    {city.districts.length > 4 ? "…" : ""}
                  </span>
                )}
                <span className={styles.cityLink}>
                  Voir les annonces
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className={`container ${styles.section}`} aria-labelledby="recentes-title">
          <div className={styles.sectionHeader}>
            <h2 id="recentes-title" className="text-heading-lg">
              Annonces récentes
            </h2>
            <Link href="/recherche" className={styles.textLink}>
              Voir toutes les annonces
            </Link>
          </div>
          <ul className={styles.listingGrid}>
            {RECENT_LISTINGS.map((listing) => (
              <li key={listing.id}>
                <ListingCard listing={listing} compactOnMobile />
              </li>
            ))}
          </ul>
        </section>

        <section id="comment-ca-marche" className={`container ${styles.section}`} aria-labelledby="etapes-title">
          <h2 id="etapes-title" className="text-heading-lg">
            Comment ça marche
          </h2>
          <ol className={styles.steps}>
            {STEPS.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className="text-heading-sm">{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`container ${styles.ctaSection}`} aria-labelledby="cta-title">
          <div className={styles.cta}>
            <div className={styles.ctaText}>
              <h2 id="cta-title" className="text-heading-lg">
                Vous avez un logement à louer ?
              </h2>
              <p className={styles.ctaMuted}>
                Publiez votre annonce, définissez vos créneaux de visite et recevez les demandes directement.
              </p>
            </div>
            <Button href="/inscription" variant="inverse" size="lg">
              Publier un logement
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
