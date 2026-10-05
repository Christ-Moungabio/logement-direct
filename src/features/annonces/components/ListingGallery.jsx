"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, Images, X } from "lucide-react";
import styles from "./ListingGallery.module.css";

// Photo principale en grand et aperçus (EF-FIC-01). Mobile : carrousel à faire
// défiler. Ordinateur : grille. Chaque photo ouvre la visionneuse plein écran.
export default function ListingGallery({ photos, title }) {
  const [viewerIndex, setViewerIndex] = useState(null);
  const count = photos.length;

  if (count === 0) {
    return (
      <div className={styles.empty}>
        <ImageOff size={20} aria-hidden="true" />
        Aucune photo disponible
      </div>
    );
  }

  const altFor = (index) =>
    index === 0 ? `${title}, photo principale` : `${title}, photo ${index + 1} sur ${count}`;

  return (
    <section aria-label={`Photos du logement (${count})`}>
      <Carousel photos={photos} altFor={altFor} onOpen={setViewerIndex} />
      <Grid photos={photos} altFor={altFor} onOpen={setViewerIndex} />
      <Viewer
        photos={photos}
        altFor={altFor}
        title={title}
        index={viewerIndex}
        onIndexChange={setViewerIndex}
      />
    </section>
  );
}

function Carousel({ photos, altFor, onOpen }) {
  const [current, setCurrent] = useState(0);
  const scrollerRef = useRef(null);

  function handleScroll() {
    const scroller = scrollerRef.current;
    if (scroller) setCurrent(Math.round(scroller.scrollLeft / scroller.clientWidth));
  }

  return (
    <div className={styles.carousel}>
      <div ref={scrollerRef} onScroll={handleScroll} className={styles.track}>
        {photos.map((photo, index) => (
          <button
            key={photo.url}
            type="button"
            className={styles.slide}
            onClick={() => onOpen(index)}
            aria-label={`Agrandir : ${altFor(index)}`}
          >
            <Image
              src={photo.url}
              alt={altFor(index)}
              fill
              sizes="100vw"
              preload={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              className={styles.photo}
            />
          </button>
        ))}
      </div>
      {photos.length > 1 && (
        <p className={styles.counter} aria-hidden="true">
          {current + 1} / {photos.length}
        </p>
      )}
    </div>
  );
}

function Grid({ photos, altFor, onOpen }) {
  const count = photos.length;
  const thumbs = photos.slice(1, 5);

  return (
    <div className={styles.grid} data-count={Math.min(count, 5)}>
      <Tile photo={photos[0]} alt={altFor(0)} className={styles.main} sizes="(min-width: 1240px) 620px, 50vw" preload onClick={() => onOpen(0)} />
      {thumbs.map((photo, i) => (
        <div key={photo.url} className={styles.thumbCell}>
          <Tile photo={photo} alt={altFor(i + 1)} sizes="(min-width: 1240px) 310px, 25vw" onClick={() => onOpen(i + 1)} />
          {i === thumbs.length - 1 && (
            <button type="button" className={styles.showAll} onClick={() => onOpen(0)}>
              <Images size={16} aria-hidden="true" />
              Voir les {count} photos
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function Tile({ photo, alt, className, sizes, preload = false, onClick }) {
  return (
    <button
      type="button"
      className={[styles.tile, className].filter(Boolean).join(" ")}
      onClick={onClick}
      aria-label={`Agrandir : ${alt}`}
    >
      <Image
        src={photo.url}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        loading={preload ? "eager" : "lazy"}
        className={styles.photo}
      />
    </button>
  );
}

function Viewer({ photos, altFor, title, index, onIndexChange }) {
  const dialogRef = useRef(null);
  const count = photos.length;
  const open = index !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function go(delta) {
    onIndexChange((current) => (current === null ? null : (current + delta + count) % count));
  }

  function handleKeyDown(event) {
    if (count < 2) return;
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.viewer}
      aria-labelledby="visionneuse-titre"
      onClose={() => onIndexChange(null)}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.viewerBar}>
        <p id="visionneuse-titre" className={styles.viewerTitle}>
          {title}
          {open && <span className={styles.viewerCount}>Photo {index + 1} sur {count}</span>}
        </p>
        <button type="button" className={styles.viewerClose} onClick={() => onIndexChange(null)} aria-label="Fermer la visionneuse">
          <X size={22} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.viewerStage}>
        {open && (
          <Image key={photos[index].url} src={photos[index].url} alt={altFor(index)} fill sizes="100vw" className={styles.viewerPhoto} />
        )}
        {count > 1 && (
          <>
            <button type="button" className={`${styles.viewerNav} ${styles.previous}`} onClick={() => go(-1)} aria-label="Photo précédente">
              <ChevronLeft size={26} aria-hidden="true" />
            </button>
            <button type="button" className={`${styles.viewerNav} ${styles.next}`} onClick={() => go(1)} aria-label="Photo suivante">
              <ChevronRight size={26} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <ol className={styles.viewerThumbs}>
          {photos.map((photo, i) => (
            <li key={photo.url}>
              <button
                type="button"
                className={styles.viewerThumb}
                onClick={() => onIndexChange(i)}
                aria-label={`Afficher la photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              >
                <Image src={photo.url} alt="" fill sizes="80px" className={styles.photo} />
              </button>
            </li>
          ))}
        </ol>
      )}
    </dialog>
  );
}
