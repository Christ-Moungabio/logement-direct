import Link from "next/link";
import { capitalize } from "../../lib/format";
import { requireRole } from "../../src/features/auth/queries";
import AdminPageHeader from "../../src/features/moderation/components/AdminPageHeader";
import CreatedChart from "../../src/features/moderation/components/CreatedChart";
import KpiStrip from "../../src/features/moderation/components/KpiStrip";
import ModerationLog from "../../src/features/moderation/components/ModerationLog";
import PendingReportsTable from "../../src/features/moderation/components/PendingReportsTable";
import StatusBreakdown from "../../src/features/moderation/components/StatusBreakdown";
import shell from "../../src/features/moderation/components/AdminShell.module.css";
import dashboard from "../../src/features/moderation/components/Dashboard.module.css";
import {
  buildCreatedChart,
  buildKpis,
  buildStatusBreakdown,
  periodFromParam,
} from "../../src/features/moderation/dashboard";
import {
  getDashboardData,
  getModerationLog,
  getPendingReportsPreview,
} from "../../src/features/moderation/queries";

export const metadata = { title: "Administration" };

const todayFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Africa/Brazzaville",
});

export default async function AdminHomePage({ searchParams }) {
  await requireRole("admin", "/admin");
  const { periode } = await searchParams;
  const period = periodFromParam(periode);
  const [data, pendingReports, log] = await Promise.all([
    getDashboardData(),
    getPendingReportsPreview(),
    getModerationLog(),
  ]);
  const pending = data.pendingReports.length;

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
        <CreatedChart chart={buildCreatedChart(data.listings, period)} period={period} />
        <StatusBreakdown breakdown={buildStatusBreakdown(data.listings)} />
        <PendingReportsTable reports={pendingReports} total={pending} />
        <ModerationLog entries={log} />
      </div>
    </>
  );
}
