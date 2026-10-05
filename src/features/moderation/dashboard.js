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

export const PERIODS = {
  14: { label: "14 j", param: null },
  30: { label: "30 j", param: "30" },
  all: { label: "Tout", param: "tout" },
};

export function periodFromParam(param) {
  const match = Object.entries(PERIODS).find(([, period]) => period.param === param);
  return match ? match[0] : "14";
}

const dayLabelFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });

function dayLabel(key) {
  return dayLabelFormatter.format(new Date(key));
}

function chartTop(max) {
  if (max <= 4) return 4;
  return Math.ceil(max / 2) * 2;
}

export function buildCreatedChart(listings, period, now = new Date()) {
  const createdKeys = listings.map((listing) => dayKey(listing.createdAt));
  const today = dayKey(now);
  const firstKey = createdKeys.reduce((first, key) => (key < first ? key : first), today);
  const spanDays = Math.round((Date.parse(today) - Date.parse(firstKey)) / DAY) + 1;
  const dayCount = period === "all" ? Math.max(14, spanDays) : Number(period);
  const days = lastDays(dayCount, now);
  const weekly = dayCount > 60;

  const buckets = [];
  if (weekly) {
    for (let end = days.length; end > 0; end -= 7) {
      buckets.unshift(days.slice(Math.max(0, end - 7), end));
    }
  } else {
    days.forEach((day) => buckets.push([day]));
  }

  const bars = buckets.map((bucket) => {
    const first = bucket[0];
    const last = bucket[bucket.length - 1];
    const count = createdKeys.filter((key) => key >= first && key <= last).length;
    const when = weekly ? `Semaine du ${dayLabel(first)}` : dayLabel(first);
    return { key: first, count, tip: `${when} : ${count} annonce${count > 1 ? "s" : ""}` };
  });

  const total = bars.reduce((sum, bar) => sum + bar.count, 0);
  const top = chartTop(Math.max(...bars.map((bar) => bar.count)));
  const middle = Math.floor((bars.length - 1) / 2);

  return {
    total,
    weekly,
    bars,
    ticks: [0, top / 2, top],
    top,
    labels: [bars[0], bars[middle], bars[bars.length - 1]].map((bar) => dayLabel(bar.key)),
    caption: period === "all" ? "depuis le début" : `sur les ${dayCount} derniers jours`,
  };
}

const STATUS_GROUPS = [
  { key: "live", label: "En ligne", tone: "success" },
  { key: "scheduled", label: "Mise en ligne", tone: "primary" },
  { key: "draft", label: "Brouillons", tone: "neutral" },
  { key: "hidden", label: "Masquées", tone: "danger" },
  { key: "closed", label: "Fermées", tone: "dark" },
];

function statusGroup(listing, now) {
  if (isLive(listing, now)) return "live";
  return listing.status;
}

export function buildStatusBreakdown(listings, now = new Date()) {
  const total = listings.length;
  const rows = STATUS_GROUPS.map((group) => {
    const count = listings.filter((listing) => statusGroup(listing, now) === group.key).length;
    return { ...group, count, percent: total ? Math.round((count / total) * 100) : 0 };
  });
  return { total, rows };
}

export function timeAgo(iso, now = new Date()) {
  const minutes = Math.floor((now.getTime() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  return `il y a ${Math.floor(hours / 24)} j`;
}

export function isOverdue(iso, now = new Date()) {
  return now.getTime() - new Date(iso).getTime() > 48 * 3_600_000;
}

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Brazzaville",
});

const shortDayFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: "Africa/Brazzaville",
});

export function logTime(iso, now = new Date()) {
  return dayKey(iso) === dayKey(now) ? timeFormatter.format(new Date(iso)) : shortDayFormatter.format(new Date(iso));
}
