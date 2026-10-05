export const PHOTOS_BUCKET = "listing-photos";
export const MAX_PHOTOS = 8;
export const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

export const PHOTO_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Chaque fichier est jugé seul : un refus ne bloque pas les autres.
export function checkPhoto(file) {
  if (!Object.hasOwn(PHOTO_TYPES, file.type)) {
    return "Format non accepté. Utilisez JPG, PNG ou WebP.";
  }
  if (file.size > MAX_PHOTO_SIZE) {
    return "Fichier trop lourd (5 Mo maximum).";
  }
  return null;
}

// Plus petit numéro libre entre 1 et MAX_PHOTOS, pour garder l'ordre sans trous.
export function nextSortOrder(usedOrders) {
  for (let order = 1; order <= MAX_PHOTOS; order += 1) {
    if (!usedOrders.has(order)) return order;
  }
  return null;
}
