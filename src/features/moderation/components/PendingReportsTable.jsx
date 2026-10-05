import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { formatPrice } from "../../../../lib/format";
import { REPORT_REASON_LABELS } from "../../annonces/labels";
import { isOverdue, timeAgo } from "../dashboard";
import shell from "./AdminShell.module.css";
import styles from "./Dashboard.module.css";

export default function PendingReportsTable({ reports, total }) {
  return (
    <section aria-labelledby="pending-title" className={`${styles.tableCard} ${styles.wide}`}>
      <div className={styles.tableHead}>
        <h2 id="pending-title" className={styles.cardTitle}>
          Signalements en attente <span className={`${styles.titleCount} tabular`}>{total}</span>
        </h2>
        <Link href="/admin/signalements" className={styles.headLink}>
          Tout voir
        </Link>
      </div>

      {reports.length === 0 ? (
        <p className={styles.tableEmpty}>Aucun signalement en attente. Les nouveaux signalements apparaîtront ici.</p>
      ) : (
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Annonce</th>
                <th scope="col">Motif</th>
                <th scope="col">Signalé par</th>
                <th scope="col">Reçu</th>
                <th scope="col">
                  <span className="visually-hidden">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <span className={styles.listingCell}>
                      {report.listing?.photoUrl ? (
                        <Image
                          src={report.listing.photoUrl}
                          alt=""
                          width={40}
                          height={40}
                          sizes="40px"
                          className={styles.thumb}
                        />
                      ) : (
                        <span className={`${styles.thumb} ${styles.thumbEmpty}`} aria-hidden="true">
                          <ImageIcon size={18} strokeWidth={1.8} />
                        </span>
                      )}
                      <span className={styles.cellStack}>
                        <span className={styles.cellTitle}>{report.listing?.title ?? "Annonce supprimée"}</span>
                        {report.listing && (
                          <span className={styles.cellMeta}>
                            {[report.listing.neighborhood, report.listing.rent && formatPrice(report.listing.rent)]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        )}
                      </span>
                    </span>
                  </td>
                  <td>{REPORT_REASON_LABELS[report.reason]}</td>
                  <td className={styles.cellSoft}>{report.reporterName ?? "Compte supprimé"}</td>
                  <td className={`${styles.nowrap} ${isOverdue(report.createdAt) ? styles.overdue : styles.cellSoft}`}>
                    {timeAgo(report.createdAt)}
                  </td>
                  <td className={styles.actionCell}>
                    <Link href={`/admin/signalements/${report.id}`} className={`${shell.button} ${shell.buttonSmall}`}>
                      Examiner
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
