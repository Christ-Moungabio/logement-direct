"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import taxis from "../../public/images/brazzaville-taxis.jpg";
import { TESTIMONIALS } from "./testimonials-data";
import styles from "./Testimonials.module.css";

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
          <Image src={current.photo} alt="" width={46} height={46} className={styles.avatar} />
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
