"use client";

import { ChevronLeft, ChevronRight, ImageIcon, Images } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Galerie de la fiche (EF-FIC-01) : photo principale en grand et aperçus.
 * Mobile : carrousel à faire défiler. Ordinateur : grille des wireframes.
 * Chaque photo ouvre une visionneuse plein écran.
 *
 * @param {{ photos: import("../types").ListingPhoto[], title: string }} props
 */
export function ListingGallery({ photos, title }) {
  const [viewerIndex, setViewerIndex] = useState(
    /** @type {number | null} */ (null),
  );
  const count = photos.length;

  if (count === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center gap-2 rounded-xl bg-muted text-sm text-muted-foreground md:aspect-[21/9]">
        <ImageIcon className="size-5" aria-hidden="true" />
        Aucune photo disponible
      </div>
    );
  }

  const altFor = (index) =>
    index === 0
      ? `${title}, photo principale`
      : `${title}, photo ${index + 1} sur ${count}`;

  return (
    <section aria-label={`Photos du logement (${count})`}>
      <MobileCarousel photos={photos} altFor={altFor} onOpen={setViewerIndex} />
      <DesktopGrid photos={photos} altFor={altFor} onOpen={setViewerIndex} />

      <PhotoViewer
        photos={photos}
        altFor={altFor}
        index={viewerIndex}
        onIndexChange={setViewerIndex}
        title={title}
      />
    </section>
  );
}

function MobileCarousel({ photos, altFor, onOpen }) {
  const [current, setCurrent] = useState(0);
  const scrollerRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const count = photos.length;

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setCurrent(Math.round(scroller.scrollLeft / scroller.clientWidth));
  };

  return (
    <div className="relative -mx-4 sm:mx-0 md:hidden">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto sm:rounded-xl [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, index) => (
          <button
            key={photo.url}
            type="button"
            onClick={() => onOpen(index)}
            className="relative aspect-[4/3] w-full shrink-0 snap-center bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-inset"
            aria-label={`Agrandir : ${altFor(index)}`}
          >
            <Image
              src={photo.url}
              alt={altFor(index)}
              fill
              sizes="100vw"
              preload={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              className="object-cover"
            />
          </button>
        ))}
      </div>
      {count > 1 && (
        <p
          className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white"
          aria-hidden="true"
        >
          {current + 1} / {count}
        </p>
      )}
    </div>
  );
}

// Disposition de la grille selon le nombre de photos (1 à 8).
const GRID_LAYOUTS = {
  1: { grid: "grid-cols-1", main: "aspect-[21/9]", thumbs: [] },
  2: { grid: "grid-cols-2", main: "aspect-[4/3]", thumbs: ["aspect-[4/3]"] },
  3: {
    grid: "grid-cols-4 grid-rows-2",
    main: "col-span-3 row-span-2",
    thumbs: ["", ""],
  },
  4: {
    grid: "grid-cols-4 grid-rows-2",
    main: "col-span-2 row-span-2",
    thumbs: ["", "", "col-span-2"],
  },
  5: {
    grid: "grid-cols-4 grid-rows-2",
    main: "col-span-2 row-span-2",
    thumbs: ["", "", "", ""],
  },
};

function DesktopGrid({ photos, altFor, onOpen }) {
  const count = photos.length;
  const layout = GRID_LAYOUTS[Math.min(count, 5)];
  const thumbs = photos.slice(1, 1 + layout.thumbs.length);
  const multiRow = count >= 3;

  return (
    <div
      className={cn(
        "hidden gap-2 md:grid",
        layout.grid,
        multiRow && "h-[min(30rem,42vw)]",
      )}
    >
      <GridTile
        photo={photos[0]}
        alt={altFor(0)}
        className={cn(layout.main, "rounded-xl")}
        sizes={count === 1 ? "(min-width: 1200px) 1200px, 100vw" : "50vw"}
        preload
        onClick={() => onOpen(0)}
      />
      {thumbs.map((photo, i) => {
        const index = i + 1;
        const isLast = i === thumbs.length - 1;
        return (
          <div key={photo.url} className={cn("relative", layout.thumbs[i])}>
            <GridTile
              photo={photo}
              alt={altFor(index)}
              className="h-full rounded-xl"
              sizes="25vw"
              onClick={() => onOpen(index)}
            />
            {isLast && count > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpen(0)}
                className="absolute right-3 bottom-3 shadow-sm"
              >
                <Images aria-hidden="true" />
                Voir les {count} photos
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GridTile({ photo, alt, className, sizes, preload = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative block w-full overflow-hidden bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
      aria-label={`Agrandir : ${alt}`}
    >
      <Image
        src={photo.url}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        loading={preload ? "eager" : "lazy"}
        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
    </button>
  );
}

function PhotoViewer({ photos, altFor, index, onIndexChange, title }) {
  const count = photos.length;
  const open = index !== null;

  // Mise à jour fonctionnelle : des appuis rapides ne réutilisent pas un index périmé.
  const go = useCallback(
    (delta) => {
      onIndexChange((current) =>
        current === null ? null : (current + delta + count) % count,
      );
    },
    [count, onIndexChange],
  );

  useEffect(() => {
    if (!open || count < 2) return;
    const onKeyDown = (event) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, count, go]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onIndexChange(null)}>
      <DialogContent
        closeLabel="Fermer la visionneuse"
        className="flex h-dvh max-h-dvh w-screen max-w-none flex-col gap-0 rounded-none border-0 bg-neutral-950 p-0 text-white [&>button:last-child]:text-white [&>button:last-child]:hover:bg-white/10 [&>button:last-child]:hover:text-white"
      >
        <div className="flex h-14 shrink-0 items-center px-4 pr-16">
          <DialogTitle className="truncate text-base">{title}</DialogTitle>
          <DialogDescription className="ml-3 shrink-0 text-sm text-neutral-300">
            {index !== null && `Photo ${index + 1} sur ${count}`}
          </DialogDescription>
        </div>

        <div className="relative min-h-0 flex-1">
          {index !== null && (
            <Image
              key={photos[index].url}
              src={photos[index].url}
              alt={altFor(index)}
              fill
              sizes="100vw"
              className="object-contain"
            />
          )}
          {count > 1 && (
            <>
              <ViewerNavButton direction="previous" onClick={() => go(-1)} />
              <ViewerNavButton direction="next" onClick={() => go(1)} />
            </>
          )}
        </div>

        {count > 1 && (
          <ol className="flex shrink-0 justify-start gap-2 overflow-x-auto p-3 sm:justify-center">
            {photos.map((photo, i) => (
              <li key={photo.url} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onIndexChange(i)}
                  aria-label={`Afficher la photo ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "relative block h-14 w-20 overflow-hidden rounded-md opacity-60 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                    i === index && "opacity-100 ring-2 ring-white",
                  )}
                >
                  <Image
                    src={photo.url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ol>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ViewerNavButton({ direction, onClick }) {
  const isNext = direction === "next";
  const Icon = isNext ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isNext ? "Photo suivante" : "Photo précédente"}
      className={cn(
        "absolute top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
        isNext ? "right-3" : "left-3",
      )}
    >
      <Icon className="size-6" aria-hidden="true" />
    </button>
  );
}
