const numberFr = new Intl.NumberFormat("fr-FR");

export function formatFcfa(amount) {
  return `${numberFr.format(amount)} FCFA`;
}

export function formatDateFr(iso) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Brazzaville",
  }).format(new Date(iso));
}

export function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

// Format de la maquette : « il y a 2 j », « il y a 1 sem. »
export function formatAge(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "aujourd'hui";
  if (days < 7) return `il y a ${days} j`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} sem.`;
  return `il y a ${Math.floor(days / 30)} mois`;
}