import { displayStatus } from "../listings/status";

const DAY = 86_400_000;
const BRAZZAVILLE_OFFSET = 3_600_000;

export function dayKey(date) {
  return new Date(new Date(date).getTime() + BRAZZAVILLE_OFFSET).toISOString().slice(0, 10);
}

export function lastDays(count, now = new Date()) {
  const today = Date.parse(dayKey(now));
  return Array.from({ length: count }, (_, index) =>
    new Date(today - (count - 1 - index) * DAY).toISOString().slice(0, 10),
  );
}

function isLive(listing, now) {
  return displayStatus({ status: listing.status, visible_from: listing.visibleFrom }, now) === "published";
}

function cumulative(days, dates, base = 0) {
  const keys = dates.map(dayKey);
  return days.map((day) => base + keys.filter((key) => key <= day).length);
}

function waitingTime(iso, now) {
  const hours = Math.floor((now - new Date(iso).getTime()) / 3_600_000);
  if (hours < 1) return "moins d'une heure";
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} jour${days > 1 ? "s" : ""}`;
}

function plural(count, singular, pluralForm = `${singular}s`) {
  return `${count} ${count > 1 ? pluralForm : singular}`;
}

export function buildKpis({ listings, pendingReports, accounts }, now = new Date()) {
  const days = lastDays(14, now);
  const firstDay = days[0];

  const live = listings.filter((listing) => isLive(listing, now));
  const recentLive = live.filter((listing) => dayKey(listing.visibleFrom) >= firstDay);
  const hidden = listings.filter((listing) => listing.status === "hidden");
  const hiddenAreas = [...new Set(hidden.map((listing) => listing.neighborhood).filter(Boolean))];

  const oldestReport = pendingReports.reduce(
    (oldest, report) => (!oldest || report.createdAt < oldest ? report.createdAt : oldest),
    null,
  );

  const recentAccounts = accounts.recentCreatedAt.filter((date) => dayKey(date) >= firstDay);

  return [
    {
      label: "Signalements en attente",
      value: pendingReports.length,
      href: "/admin/signalements",
      tone: pendingReports.length > 0 ? "warning" : null,
      note: oldestReport ? `Le plus ancien attend depuis ${waitingTime(oldestReport, now.getTime())}` : "Rien à traiter",
      noteTone: oldestReport ? "warning" : null,
    },
    {
      label: "Annonces en ligne",
      value: live.length,
      href: "/admin/annonces",
      note:
        recentLive.length > 0
          ? `+${plural(recentLive.length, "mise en ligne", "mises en ligne")} sur 14 jours`
          : "Aucune mise en ligne sur 14 jours",
      noteTone: recentLive.length > 0 ? "success" : null,
      series: cumulative(
        days,
        live.map((listing) => listing.visibleFrom),
      ),
      seriesTone: "success",
    },
    {
      label: "Annonces masquées",
      value: hidden.length,
      href: "/admin/annonces?statut=masquees",
      note:
        hiddenAreas.length === 0
          ? "Aucune"
          : hiddenAreas.length > 3
            ? `${hiddenAreas.slice(0, 3).join(", ")} et ${hiddenAreas.length - 3} autres`
            : hiddenAreas.join(", "),
    },
    {
      label: "Comptes",
      value: accounts.total,
      note: [
        plural(accounts.tenants, "locataire"),
        plural(accounts.owners, "propriétaire"),
        accounts.admins > 0 ? plural(accounts.admins, "admin") : null,
      ]
        .filter(Boolean)
        .join(" · "),
      series: cumulative(days, recentAccounts, accounts.total - recentAccounts.length),
      seriesTone: "primary",
    },
  ];
}
