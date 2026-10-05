import Link from "next/link";
import { requireRole } from "../../../src/features/auth/queries";
import listingStyles from "../../../src/features/listings/components/Listings.module.css";
import ReportsList from "../../../src/features/moderation/components/ReportsList";
import { getReportCounts, getReports } from "../../../src/features/moderation/queries";
import { REPORT_STATUSES, reportStatusFromParam, reportsHref } from "../../../src/features/moderation/reports";
import styles from "./page.module.css";

export const metadata = { title: "Signalements · Administration" };

const EMPTY_MESSAGES = {
  pending: "Aucun signalement à traiter. Les nouveaux signalements des locataires apparaîtront ici.",
  resolved: "Aucun signalement traité pour le moment.",
  rejected: "Aucun signalement rejeté pour le moment.",
};

export default async function AdminReportsPage({ searchParams }) {
  await requireRole("admin", "/admin/signalements");
  const { statut } = await searchParams;
  const current = reportStatusFromParam(statut);

  const [reports, counts] = await Promise.all([getReports(current), getReportCounts()]);

  return (
    <>
      <div>
        <h1 className="text-display-lg">Signalements</h1>
        <p className={`${styles.intro} text-body-md`}>
          Les locataires signalent depuis la fiche une annonce fausse, déjà louée ou suspecte. Les plus anciens
          signalements à traiter apparaissent en premier.
        </p>
      </div>

      <nav className={listingStyles.filters} aria-label="Filtrer les signalements">
        {Object.entries(REPORT_STATUSES).map(([status, { label }]) => (
          <Link
            key={status}
            href={reportsHref(status)}
            className={`${listingStyles.filter} ${status === current ? listingStyles.filterActive : ""}`}
            aria-current={status === current ? "page" : undefined}
          >
            {label} · {counts[status]}
          </Link>
        ))}
      </nav>

      {reports.length === 0 ? (
        <p className={styles.empty}>{EMPTY_MESSAGES[current]}</p>
      ) : (
        <ReportsList reports={reports} />
      )}
    </>
  );
}
