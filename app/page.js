import { Suspense } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Flag,
  HandCoins,
  Images,
  KeyRound,
  LogIn,
  MapPin,
  MessageCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Gallery from "../components/home/Gallery";
import HeroSearch from "../components/home/HeroSearch";
import ListingsExplorer from "../components/home/ListingsExplorer";
import ListingsFromUrl from "../components/home/ListingsFromUrl";
import Testimonials from "../components/home/Testimonials";
import { LISTINGS } from "../data/listings";
import heroPhoto from "../public/images/brazzaville-corniche.jpg";
import finalPhoto from "../public/images/annonce-maison-loandjili.jpg";
import styles from "./page.module.css";

// Chiffres réels : enquête du projet et règles de la spécification.
const STATS = [
  { value: "45 %", label: "des personnes interrogées dépendent d'un démarcheur pour trouver un logement" },
  { value: "5 min", label: "après le clic sur Publier, l'annonce est visible des locataires" },
  { value: "9 quartiers", label: "couverts à Brazzaville, pour cette première version" },
  { value: "6 types", label: "de biens, du studio au local commercial" },
];

const FEATURES = [
  {
    Icon: MapPin,
    title: "Recherche par quartier",
    text: "Filtrez par quartier, type de bien et budget, puis triez par date ou par prix.",
  },
  {
    Icon: RefreshCw,
    title: "Informations à jour",
    text: "Loyer, avance, eau, électricité et disponibilité sur chaque fiche, avec la date de dernière mise à jour.",
  },
  {
    Icon: MessageCircle,
    title: "Contact direct",
    text: "Une fois connecté, joignez le propriétaire par WhatsApp ou par appel, sans démarcheur.",
  },
  {
    Icon: Flag,
    title: "Signalement",
    text: "Une annonce douteuse ou déjà louée ? Signalez-la depuis sa fiche : l'équipe peut la masquer.",
  },
];

// Parcours P1 de la spécification : recherche, fiche, connexion, contact.
const STEPS = [
  {
    Icon: Search,
    title: "Cherchez",
    text: "Type de bien, budget, puis quartier : gardez seulement les annonces qui vous correspondent.",
  },
  {
    Icon: Images,
    title: "Ouvrez la fiche",
    text: "Photos, loyer, avance, eau, électricité et disponibilité : tout est affiché avant de vous déplacer.",
  },
  {
    Icon: LogIn,
    title: "Connectez-vous",
    text: "Un compte gratuit avec votre numéro WhatsApp suffit pour voir le contact du propriétaire.",
  },
  {
    Icon: KeyRound,
    title: "Contactez le propriétaire",
    text: "Par WhatsApp ou par appel, pour organiser la visite. Le bail et la caution se règlent avec lui, hors de Ndako.",
  },
];

const FAQ = [
  {
    question: "Faut-il passer par un démarcheur ?",
    answer:
      "Non. Les annonces sont publiées par les propriétaires eux-mêmes, et vous les contactez directement par WhatsApp ou par appel.",
  },
  {
    question: "Faut-il un compte pour chercher ?",
    answer:
      "Non. La recherche et les fiches sont ouvertes à tous. Un compte gratuit est demandé seulement pour voir le contact du propriétaire : son numéro n'est jamais affiché aux visiteurs non connectés.",
  },
  {
    question: "Les annonces sont-elles vérifiées avant publication ?",
    answer:
      "Non : elles sont publiées directement par les propriétaires et visibles 5 minutes après. Chaque fiche affiche sa date de mise à jour, et vous pouvez signaler une annonce douteuse ; l'équipe peut alors la masquer.",
  },
  {
    question: "Que veut dire « Bientôt libre » ?",
    answer:
      "Le logement est encore occupé : la fiche indique la date à laquelle il se libère. À cette date, l'annonce passe automatiquement à « Libre ».",
  },
  {
    question: "Comment se règlent la caution et le loyer ?",
    answer:
      "Directement avec le propriétaire, en dehors de Ndako. La plateforme sert à trouver le logement et à joindre le propriétaire.",
  },
  {
    question: "Comment publier mon logement ?",
    answer:
      "Créez un compte propriétaire, ajoutez de 1 à 8 photos (JPG, PNG ou WebP, 5 Mo maximum), le loyer, l'avance, le quartier, l'eau, l'électricité et la disponibilité. Cliquez sur Publier : l'annonce est visible des locataires 5 minutes plus tard.",
  },
];

const REVIEW_INITIALS = ["MM", "AK", "GL"];

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* Accueil : titre centré et recherche, sur une photo de Brazzaville */}
        <section id="accueil" className={styles.hero} aria-labelledby="hero-title">
          <Image
            src={heroPhoto}
            alt="Le pont de la Corniche et les quartiers riverains de Brazzaville, au bord du fleuve Congo"
            fill
            preload
            sizes="100vw"
            placeholder="blur"
            className={styles.heroPhoto}
          />
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={`container ${styles.heroInner}`}>
            <h1 id="hero-title" className={`text-display-2xl ${styles.heroTitle}`}>
              Trouvez un logement à louer, directement auprès des propriétaires
            </h1>
            <p className={styles.heroLead}>
              Studios, chambres, appartements et maisons à Brazzaville, publiés par les propriétaires eux-mêmes.
              Comparez le loyer et l&apos;avance demandée, puis contactez le propriétaire directement.
            </p>

            <HeroSearch />

            <ul className={styles.promises}>
              <li>
                <HandCoins size={17} strokeWidth={2.3} aria-hidden="true" />
                Réservez votre visite sans intermédiaire payant
              </li>
              <li>
                <MessageCircle size={17} strokeWidth={2.3} aria-hidden="true" />
                Contact direct par WhatsApp ou appel
              </li>
              <li>
                <KeyRound size={17} strokeWidth={2.3} aria-hidden="true" />
                Caution réglée directement avec le propriétaire
              </li>
            </ul>
          </div>
        </section>

        {/* À propos et chiffres */}
        <section id="apropos" className={`container ${styles.section}`} aria-labelledby="apropos-title">
          <div className={styles.about}>
            <div className={styles.aboutLead}>
              <p className="text-heading-sm">Des logements publiés par leurs propriétaires, sans démarcheur.</p>
              <p className={styles.aboutText}>
                Ndako met en relation directe propriétaires et locataires. Chaque annonce affiche le loyer, l&apos;avance,
                l&apos;eau, l&apos;électricité et la disponibilité, avec sa date de mise à jour.
              </p>
            </div>
            <h2 id="apropos-title" className={`text-display-lg ${styles.aboutStatement}`}>
              Trouvez plus vite <span className="text-muted">un logement fiable</span> dans le quartier qui vous
              convient.
            </h2>
          </div>

          <dl className={styles.stats}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={`${styles.statValue} tabular`}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Fonctionnalités */}
        <section id="fonctionnalites" className={`container ${styles.section}`} aria-labelledby="fonctionnalites-title">
          <div className={styles.sectionHead}>
            <h2 id="fonctionnalites-title" className="text-display-xl">
              Les bons repères pour louer au Congo
            </h2>
            <p className={styles.sectionAside}>
              Les informations utiles pour comparer les logements et réserver une visite, sans perdre de temps ni
              d&apos;argent en déplacements.
            </p>
          </div>
          <ul className={styles.features}>
            {FEATURES.map(({ Icon, title, text }) => (
              <li key={title} className={styles.feature}>
                <span className={styles.featureIcon}>
                  <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
                </span>
                <h3 className="text-heading-md">{title}</h3>
                <p className={styles.featureText}>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Galerie : une fiche d'annonce */}
        <section className={`container ${styles.section}`} aria-labelledby="galerie-title">
          <div className={styles.sectionHead}>
            <h2 id="galerie-title" className="text-display-xl">
              Votre futur chez-vous vous attend peut-être déjà.
            </h2>
            <p className={styles.sectionAside}>
              Chaque fiche montre les photos du logement, le loyer, l&apos;avance demandée, l&apos;eau, l&apos;électricité et la
              disponibilité.
            </p>
          </div>
          <Gallery />
        </section>

        {/* Logements */}
        <section id="logements" className={`container ${styles.section}`} aria-labelledby="logements-title">
          <div className={styles.sectionHead}>
            <h2 id="logements-title" className="text-display-xl">
              Explorez les logements disponibles
            </h2>
            <p className={styles.sectionAside}>
              Studios, chambres, appartements et maisons : le vrai marché de Brazzaville, du plus simple au plus
              spacieux.
            </p>
          </div>
          <Suspense fallback={<ListingsExplorer listings={LISTINGS} />}>
            <ListingsFromUrl listings={LISTINGS} />
          </Suspense>
        </section>

        {/* Comment ça marche */}
        <section id="comment-ca-marche" className={styles.howBand} aria-labelledby="comment-title">
          <div className="container">
            <div className={styles.sectionHead}>
              <h2 id="comment-title" className="text-display-xl">
                Votre logement en <span className={styles.accent}>quatre étapes</span>
              </h2>
              <p className={styles.howAside}>
                Sans compte, vous cherchez et consultez les fiches. Le numéro du propriétaire n&apos;apparaît qu&apos;une fois
                connecté.
              </p>
            </div>
            <ol className={styles.steps}>
              {STEPS.map(({ Icon, title, text }, index) => (
                <li key={title} className={styles.step}>
                  <span className={styles.stepTop}>
                    <span className={`${styles.stepNumber} tabular`}>{String(index + 1).padStart(2, "0")}</span>
                    <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <h3 className="text-heading-md">{title}</h3>
                  <p className={styles.stepText}>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Témoignages */}
        <section className={`container ${styles.section}`} aria-labelledby="avis-title">
          <div className={styles.sectionHead}>
            <h2 id="avis-title" className="text-display-xl">
              Ils ont trouvé plus facilement avec Ndako
            </h2>
            <div className={styles.reviewsAside}>
              <span className={styles.avatars} aria-hidden="true">
                {REVIEW_INITIALS.map((value) => (
                  <span key={value} className={styles.avatar}>
                    {value}
                  </span>
                ))}
              </span>
              <p>
                <strong>Témoignages</strong>
                <span>de démonstration</span>
              </p>
            </div>
          </div>
          <Testimonials />
        </section>

        {/* Questions fréquentes */}
        <section id="faq" className={`container ${styles.section}`} aria-labelledby="faq-title">
          <div className={styles.faq}>
            <div className={styles.faqHead}>
              <h2 id="faq-title" className="text-display-xl">
                Questions fréquentes
              </h2>
              <p className={styles.sectionAside}>Les règles du jeu, pour les locataires comme pour les propriétaires.</p>
            </div>
            <div className={styles.faqList}>
              {FAQ.map((item, index) => (
                <details key={item.question} className={styles.faqItem} open={index === 0}>
                  <summary className={styles.faqQuestion}>
                    {item.question}
                    <span className={styles.faqIcon} aria-hidden="true" />
                  </summary>
                  <p className={styles.faqAnswer}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Appel final */}
        <section className={styles.finalSection} aria-labelledby="final-title">
          <div className={`container`}>
            <div className={styles.final}>
              <Image
                src={finalPhoto}
                alt="Maison entourée de palmiers dans un quartier résidentiel de Brazzaville"
                fill
                sizes="(max-width: 1240px) 100vw, 1192px"
                placeholder="blur"
                className={styles.finalPhoto}
              />
              <div className={styles.finalShade} aria-hidden="true" />
              <div className={styles.finalContent}>
                <h2 id="final-title" className="text-display-xl">
                  Trouvez votre logement au Congo, sans perdre de temps
                </h2>
                <p className={styles.finalText}>
                  Explorez des studios, chambres, appartements et maisons publiés par leurs propriétaires, puis
                  contactez-les directement.
                </p>
                <a href="#logements" className={styles.finalCta}>
                  Explorer les logements
                  <ArrowRight size={18} strokeWidth={2.6} aria-hidden="true" />
                </a>
              </div>
              <p className={styles.finalCredit}>Quartier de Makélékélé, Brazzaville</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
