import Link from "next/link";
import Button from "../../../../components/ui/Button";
import { formatAge, formatShortDate } from "../../../../lib/format";
import { REPORT_REASON_LABELS } from "../../annonces/labels";
import StatusBadge from "../../listings/components/StatusBadge";
import styles from "./Reports.module.css";

const DECISIONS = {
  resolved: "Traité",
  rejected: "Rejeté",
};

function ListingLine({ listing, reportsOnListing }) {
  if (!listing) {
    return <p className={styles.deleted}>Annonce supprimée</p>;
  }

  return (
    <div className={styles.listing}>
      <p className="text-heading-sm">{listing.title}</p>
      <StatusBadge status={listing.status} />
      {reportsOnListing > 1 && (
        <span className={styles.many}>{reportsOnListing} signalements sur cette annonce</span>
      )}
    </div>
  );
}

export default function ReportsList({ reports }) {
  return (
    <ul className={styles.list}>
      {reports.map((report) => (
        <li key={report.id} className={styles.report}>
          <div className={styles.main}>
            <Link href={`/admin/signalements/${report.id}`} className={styles.reason}>
              {REPORT_REASON_LABELS[report.reason]}
            </Link>
            <ListingLine listing={report.listing} reportsOnListing={report.reportsOnListing} />
            {report.comment && <blockquote className={styles.comment}>« {report.comment} »</blockquote>}
            <p className={`${styles.meta} text-caption-sm`}>
              Signalé par {report.reporterName ?? "un compte supprimé"} · {formatAge(report.createdAt)}
              {report.status !== "pending" && (
                <>
                  {" "}
                  · {DECISIONS[report.status]} par {report.handlerName ?? "un administrateur"} le{" "}
                  {formatShortDate(report.handledAt)}
                </>
              )}
            </p>
          </div>

          <Button
            href={`/admin/signalements/${report.id}`}
            size="sm"
            variant={report.status === "pending" ? "primary" : "secondary"}
          >
            {report.status === "pending" ? "Traiter" : "Voir"}
          </Button>
        </li>
      ))}
    </ul>
  );
}
