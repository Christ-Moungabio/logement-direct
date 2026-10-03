export const STATUSES = {
  published: { label: "Publiée", tone: "success" },
  scheduled: { label: "En cours de mise en ligne", tone: "warning" },
  draft: { label: "Brouillon", tone: "neutral" },
  hidden: { label: "Masquée", tone: "danger" },
  closed: { label: "Fermée", tone: "neutral" },
};

export const STATUS_ORDER = ["published", "scheduled", "draft", "hidden", "closed"];

export const CLOSE_REASONS = {
  rented: "Loué",
  withdrawn: "Retirée",
};

// Une annonce "scheduled" dont l'heure de mise en ligne est passée est déjà visible.
export function displayStatus(listing, now = new Date()) {
  if (listing.status === "scheduled" && new Date(listing.visible_from) <= now) {
    return "published";
  }
  return listing.status;
}
