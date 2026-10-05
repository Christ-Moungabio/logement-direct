import Link from "next/link";
import { capitalize } from "../../lib/format";
import { requireRole } from "../../src/features/auth/queries";
import AdminPageHeader from "../../src/features/moderation/components/AdminPageHeader";
import KpiStrip from "../../src/features/moderation/components/KpiStrip";
import shell from "../../src/features/moderation/components/AdminShell.module.css";
import { buildKpis } from "../../src/features/moderation/dashboard";
import { getDashboardData } from "../../src/features/moderation/queries";

export const metadata = { title: "Administration" };

const todayFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Africa/Brazzaville",
});

export default async function AdminHomePage() {
  await requireRole("admin", "/admin");
  const data = await getDashboardData();
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
    </>
  );
}
