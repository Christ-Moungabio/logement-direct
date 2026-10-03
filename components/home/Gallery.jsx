"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, LogIn, MapPin } from "lucide-react";
import salon from "../../public/images/galerie-salon.jpg";
import studio from "../../public/images/galerie-studio.jpg";
import cuisine from "../../public/images/galerie-cuisine.jpg";
import { UTILITY_LABELS } from "../../lib/constants";
import { formatAmount, formatAvailability, formatShortDate } from "../../lib/format";
import styles from "./Gallery.module.css";

const PHOTOS = [
  { src: salon, label: "Séjour", alt: "Séjour lumineux avec canapé, plantes et balcon" },
  { src: studio, label: "Chambre", alt: "Chambre ouverte sur un coin repas et une kitchenette" },
  { src: cuisine, label: "Cuisine", alt: "Cuisine équipée avec table et chaises près de la fenêtre" },
];

const SAMPLE = {
  price: 130000,
  advanceMonths: 3,
  water: "individual",
  electricity: "shared",
  doors: 4,
  availability: { status: "available" },
  publishedAt: "2026-09-24",
  updatedAt: "2026-09-30",
};

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const go = (step) => setIndex((current) => (current + step + PHOTOS.length) % PHOTOS.length);

  return (
    <div className={styles.gallery}>
      <div className={styles.viewer}>
        {PHOTOS.map((photo, photoIndex) => (
          <Image
            key={photo.label}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 1040px) 100vw, 760px"
            placeholder="blur"
            className={styles.photo}
            data-active={photoIndex === index || undefined}
            aria-hidden={photoIndex !== index}
          />
        ))}

        <div className={styles.thumbs} role="group" aria-label="Photos du logement">
          {PHOTOS.map((photo, photoIndex) => (
            <button
              key={photo.label}
              type="button"
              className={styles.thumb}
              aria-pressed={photoIndex === index}
              aria-label={`Voir la photo : ${photo.label}`}
              onClick={() => setIndex(photoIndex)}
            >
              <Image src={photo.src} alt="" fill sizes="72px" className={styles.thumbImage} />
            </button>
          ))}
        </div>

        <div className={styles.arrows}>
          <button type="button" className={styles.arrow} onClick={() => go(-1)} aria-label="Photo précédente">
            <ArrowLeft size={18} strokeWidth={2.4} aria-hidden="true" />
          </button>
          <button type="button" className={styles.arrow} onClick={() => go(1)} aria-label="Photo suivante">
            <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>

        <p className={styles.caption} aria-live="polite">
          {PHOTOS[index].label} · {index + 1}/{PHOTOS.length}
        </p>
      </div>

      <div className={styles.side}>
        <div className={styles.note}>
          <p className="text-heading-md">Les bons détails changent toute la recherche.</p>
          <p className={styles.noteText}>
            Photos, loyer, avance, eau, électricité et disponibilité : la fiche répond à vos questions avant le
            déplacement. Le bail et la caution se règlent ensuite directement avec le propriétaire, hors de Ndako.
          </p>
        </div>

        <article className={styles.listing}>
          <span className={styles.badge}>{formatAvailability(SAMPLE.availability)}</span>
          <h3 className={styles.listingTitle}>Appartement</h3>
          <p className={styles.listingPlace}>
            <MapPin size={15} strokeWidth={2.2} aria-hidden="true" />
            Djiri, Brazzaville
          </p>
          <p className={styles.listingPrice}>
            <span className="tabular">{formatAmount(SAMPLE.price)}</span> FCFA/mois
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Avance</dt>
              <dd className="tabular">
                {SAMPLE.advanceMonths} mois · {formatAmount(SAMPLE.price * SAMPLE.advanceMonths)} FCFA
              </dd>
            </div>
            <div>
              <dt>Eau</dt>
              <dd>{UTILITY_LABELS[SAMPLE.water]}</dd>
            </div>
            <div>
              <dt>Électricité</dt>
              <dd>{UTILITY_LABELS[SAMPLE.electricity]}</dd>
            </div>
            <div>
              <dt>Portes dans la parcelle</dt>
              <dd className="tabular">{SAMPLE.doors}</dd>
            </div>
          </dl>
          <p className={styles.listingMeta}>
            Publiée le {formatShortDate(SAMPLE.publishedAt)} · mise à jour le {formatShortDate(SAMPLE.updatedAt)}
          </p>
          <p className={styles.listingNote}>Adresse exacte communiquée par le propriétaire.</p>
          <Link href="/connexion?role=locataire" className={styles.listingCta}>
            <LogIn size={17} strokeWidth={2.4} aria-hidden="true" />
            Se connecter pour contacter
          </Link>
          <p className={styles.demo}>WhatsApp et appel visibles une fois connecté · annonce de démonstration</p>
        </article>
      </div>
    </div>
  );
}
