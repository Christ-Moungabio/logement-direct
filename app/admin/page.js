import Link from "next/link";
import { capitalize } from "../../lib/format";
import { requireRole } from "../../src/features/auth/queries";
import AdminPageHeader from "../../src/features/moderation/components/AdminPageHeader";
import Breakdown from "../../src/features/moderation/components/Breakdown";
import CreatedChart from "../../src/features/moderation/components/CreatedChart";
import KpiStrip from "../../src/features/moderation/components/KpiStrip";
import ModerationLog from "../../src/features/moderation/components/ModerationLog";
import PendingReportsTable from "../../src/features/moderation/components/PendingReportsTable";
import RecentListingsTable from "../../src/features/moderation/components/RecentListingsTable";
import StatusBreakdown from "../../src/features/moderation/components/StatusBreakdown";
import shell from "../../src/features/moderation/components/AdminShell.module.css";
import dashboard from "../../src/features/moderation/components/Dashboard.module.css";
import {
  BREAKDOWNS,
  PERIODS,
  breakdownFromParam,
  buildBreakdown,
  buildCreatedChart,
  buildKpis,
  buildStatusBreakdown,
  periodFromParam,
} from "../../src/features/moderation/dashboard";
import {
  getDashboardData,
  getModerationLog,
  getPendingReportsPreview,
  getRecentListings,
} from "../../src/features/moderation/queries";

export const metadata = { title: "Administration" };

const todayFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Africa/Brazzaville",
});

function dashboardHref(params) {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value));
  return query.size > 0 ? `/admin?${query}` : "/admin";
}

export default async function AdminHomePage({ searchParams }) {
  await requireRole("admin", "/admin");
  const { periode, repartition } = await searchParams;
  const period = periodFromParam(periode);
  const view = breakdownFromParam(repartition);

  const [data, pendingReports, log, recentListings] = await Promise.all([
    getDashboardData(),
    getPendingReportsPreview(),
    getModerationLog(),
    getRecentListings(),
  ]);
  const pending = data.pendingReports.length;

  const periods = Object.entries(PERIODS).map(([value, { label, param }]) => ({
    value,
    label,
    href: dashboardHref({ periode: param, repartition: BREAKDOWNS[view].param }),
  }));
  const views = Object.entries(BREAKDOWNS).map(([value, { label, param }]) => ({
    value,
    label,
    href: dashboardHref({ periode: PERIODS[period].param, repartition: param }),
  }));

  return (
    <>
      <AdminPageHeader title="Vue d'ensemble" description={capitalize(todayFormatter.format(new Date()))}>
        <Link href="/admin/annonces" className={shell.button}>
          Toutes les annonces
        </Link>
        <Link href="/admin/signalements" className={`${shell.button} ${shell.buttonPrimary}`}>
          Examiner les signalements
          {pending > 0 && <span className={`${shell.buttonCount} tabular`}>{pending}</span>}
        </Link>
      </AdminPageHeader>

      <KpiStrip kpis={buildKpis(data)} />

      <div className={dashboard.grid}>
        <CreatedChart chart={buildCreatedChart(data.listings, period)} periods={periods} current={period} />
        <StatusBreakdown breakdown={buildStatusBreakdown(data.listings)} />
        <PendingReportsTable reports={pendingReports} total={pending} />
        <ModerationLog entries={log} />
        <RecentListingsTable listings={recentListings} />
        <Breakdown breakdown={buildBreakdown(data, view)} views={views} current={view} />
      </div>
    </>
  );
}
