import { listingTitle, missingFields } from "../listings/summary";

function visibleTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Brazzaville",
  });
}

// Ce que le propriétaire doit regarder en premier, du plus urgent au moins urgent.
export function buildTodos(listings) {
  const todos = [];

  for (const listing of listings) {
    const title = listingTitle(listing);

    if (listing.status === "hidden") {
      todos.push({
        key: `hidden-${listing.id}`,
        tone: "danger",
        title: `${title} a été masquée`,
        text: `Motif : « ${listing.hiddenReason} »`,
        href: "/mes-annonces?statut=hidden",
        action: "Voir le détail",
      });
    }
  }

  for (const listing of listings) {
    if (listing.status !== "draft") continue;
    const missing = missingFields(listing);
    todos.push({
      key: `draft-${listing.id}`,
      tone: "warning",
      title: `${listingTitle(listing)} est un brouillon`,
      text: missing.length ? `À compléter : ${missing.join(", ")}.` : "Elle est prête à être publiée.",
      href: `/mes-annonces/${listing.id}/modifier`,
      action: missing.length ? "Continuer" : "Publier",
    });
  }

  for (const listing of listings) {
    if (listing.status !== "scheduled") continue;
    todos.push({
      key: `scheduled-${listing.id}`,
      tone: "neutral",
      title: `${listingTitle(listing)} passe en ligne`,
      text: `Les locataires la verront vers ${visibleTime(listing.visibleFrom)}.`,
      href: "/mes-annonces?statut=scheduled",
      action: "Voir",
    });
  }

  return todos;
}
