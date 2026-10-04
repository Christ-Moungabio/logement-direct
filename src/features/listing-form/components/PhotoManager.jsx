"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import { createClient } from "../../../lib/supabase/client";
import { deletePhoto, setPrimaryPhoto } from "../photo-actions";
import { checkPhoto, MAX_PHOTOS, nextSortOrder, PHOTO_TYPES, PHOTOS_BUCKET } from "../photos";
import styles from "./PhotoManager.module.css";

export default function PhotoManager({ listingId, photos }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [problems, setProblems] = useState([]);

  const remaining = MAX_PHOTOS - photos.length;

  async function handleChange(event) {
    const files = [...event.target.files];
    event.target.value = "";
    if (files.length === 0) return;

    const supabase = createClient();
    const used = new Set(photos.map((photo) => photo.sortOrder));
    const found = [];
    let free = remaining;

    setUploading(true);
    for (const file of files) {
      const refusal = checkPhoto(file) ?? (free <= 0 ? `Limite de ${MAX_PHOTOS} photos atteinte.` : null);
      if (refusal) {
        found.push(`${file.name} : ${refusal}`);
        continue;
      }

      const path = `${listingId}/${crypto.randomUUID()}.${PHOTO_TYPES[file.type]}`;
      const { error: uploadError } = await supabase.storage
        .from(PHOTOS_BUCKET)
        .upload(path, file, { contentType: file.type });
      if (uploadError) {
        found.push(`${file.name} : l'envoi a échoué.`);
        continue;
      }

      const sortOrder = nextSortOrder(used);
      const { error: insertError } = await supabase.from("listing_photos").insert({
        listing_id: listingId,
        storage_path: path,
        mime_type: file.type,
        file_size_bytes: file.size,
        sort_order: sortOrder,
      });
      if (insertError) {
        await supabase.storage.from(PHOTOS_BUCKET).remove([path]);
        found.push(`${file.name} : la photo n'a pas pu être enregistrée.`);
        continue;
      }

      used.add(sortOrder);
      free -= 1;
    }

    setProblems(found);
    setUploading(false);
    router.refresh();
  }

  return (
    <section className={styles.section} aria-labelledby="photos-titre">
      <div className={styles.head}>
        <h2 id="photos-titre" className="text-heading-md">
          Photos
        </h2>
        <p className={`${styles.counter} tabular`}>
          {photos.length} sur {MAX_PHOTOS}
        </p>
      </div>
      <p className="text-body-sm">JPG, PNG ou WebP, 5 Mo maximum par photo. La première photo ajoutée est la photo principale.</p>

      {photos.length > 0 && (
        <ul className={styles.grid}>
          {photos.map((photo) => (
            <li key={photo.id} className={styles.item}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="" className={styles.image} loading="lazy" />
              {photo.isPrimary && <span className={styles.primary}>Principale</span>}
              <div className={styles.actions}>
                {!photo.isPrimary && (
                  <form action={setPrimaryPhoto}>
                    <input type="hidden" name="photoId" value={photo.id} />
                    <button type="submit" className={styles.link}>
                      Mettre en principale
                    </button>
                  </form>
                )}
                <form action={deletePhoto}>
                  <input type="hidden" name="photoId" value={photo.id} />
                  <button type="submit" className={`${styles.link} ${styles.danger}`}>
                    Supprimer
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {problems.length > 0 && (
        <ul className={styles.problems} role="alert">
          {problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept={Object.keys(PHOTO_TYPES).join(",")}
          multiple
          hidden
          onChange={handleChange}
        />
        <button
          type="button"
          className={styles.add}
          disabled={uploading || remaining <= 0}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus size={18} aria-hidden="true" />
          {uploading ? "Envoi en cours…" : remaining <= 0 ? "Limite atteinte" : "Ajouter des photos"}
        </button>
      </div>
    </section>
  );
}
