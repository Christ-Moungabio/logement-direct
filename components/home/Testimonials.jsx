"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import taxis from "../../public/images/brazzaville-taxis.jpg";
import styles from "./Testimonials.module.css";

const TESTIMONIALS = [
  {
    quote:
      "J'ai trouvé mon studio à Moungali sans payer de démarcheur. J'ai écrit au propriétaire sur WhatsApp le soir, la visite était calée le lendemain.",
    name: "Merveille M.",
    role: "Locataire, Brazzaville",
    rating: 5,
  },
  {
    quote:
      "J'ai publié mon appartement avec six photos, il était en ligne quelques minutes après. Ceux qui m'appellent connaissent déjà le loyer et l'avance.",
    name: "Arsène K.",
    role: "Propriétaire, Brazzaville",
    rating: 5,
  },
  {
    quote:
      "J'ai comparé les quartiers et les prix avant de me déplacer. Deux visites au lieu de dix, et le logement ressemblait aux photos.",
    name: "Grâce L.",
    role: "Locataire, Brazzaville",
    rating: 4,
  },
];

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const current = TESTIMONIALS[index];
  const go = (step) => setIndex((value) => (value + step + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div className={styles.stage}>
      <Image
        src={taxis}
        alt="Taxis verts dans une avenue de Brazzaville, devant les panneaux Makélékélé et Bacongo"
        fill
        sizes="(max-width: 1240px) 100vw, 1192px"
        placeholder="blur"
        className={styles.photo}
      />

      <figure key={current.name} className={styles.card} aria-live="polite">
        <span className={styles.stars} aria-label={`${current.rating} sur 5`}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Star key={value} size={18} strokeWidth={2} aria-hidden="true" data-on={value <= current.rating || undefined} />
          ))}
        </span>
        <blockquote className={styles.quote}>« {current.quote} »</blockquote>
        <figcaption className={styles.author}>
          <span className={styles.avatar} aria-hidden="true">
            {initials(current.name)}
          </span>
          <span>
            <strong>{current.name}</strong>
            <span className={styles.role}>{current.role}</span>
          </span>
        </figcaption>
      </figure>

      <div className={styles.controls}>
        <button type="button" className={styles.arrow} onClick={() => go(-1)} aria-label="Témoignage précédent">
          <ArrowLeft size={18} strokeWidth={2.4} aria-hidden="true" />
        </button>
        <div className={styles.dots}>
          {TESTIMONIALS.map((item, itemIndex) => (
            <button
              key={item.name}
              type="button"
              className={styles.dot}
              aria-label={`Afficher le témoignage de ${item.name}`}
              aria-pressed={itemIndex === index}
              onClick={() => setIndex(itemIndex)}
            />
          ))}
        </div>
        <button type="button" className={styles.arrow} onClick={() => go(1)} aria-label="Témoignage suivant">
          <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>

      <p className={styles.credit}>Photo : avenue de Brazzaville</p>
    </div>
  );
}
