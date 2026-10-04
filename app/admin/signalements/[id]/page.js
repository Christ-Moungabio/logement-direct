import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageIcon } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { formatAge, formatPrice, formatShortDate } from "../../../../lib/format";
import { REPORT_REASON_LABELS } from "../../../../src/features/annonces/labels";
import { requireRole } from "../../../../src/features/auth/queries";
import StatusBadge from "../../../../src/features/listings/components/StatusBadge";
import ReportDecision from "../../../../src/features/moderation/components/ReportDecision";
import { getReport } from "../../../../src/features/moderation/queries";
import { REPORT_STATUSES } from "../../../../src/features/moderation/reports";
import styles from "./page.module.css";

export const metadata = { title: "Signalement · Administration" };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const DECISIONS = {
  resolved: "Traité",
  rejected: "Rejeté",
};

function statusLine(report) {
  if (report.status === "pending") {
    return `${REPORT_STATUSES.pending.label} · envoyé ${formatAge(report.createdAt)} par ${report.reporterName ?? "un compte supprimé"}`;
  }
  return `${DECISIONS[report.status]} par ${report.handlerName ?? "un administrateur"} le ${formatShortDate(report.handledAt)}`;
}

function ListingSummary({ listing }) {
  if (!listing) {
    return <p className={styles.muted}>L&apos;annonce a été supprimée par son propriétaire.</p>;
  }

  return (
    <div className={styles.listing}>
      <div className={styles.photo}>
        {listing.photoUrl ? (
          <Image src={listing.photoUrl} alt="" fill sizes="160px" className={styles.photoImage} />
        ) : (
          <ImageIcon size={28} strokeWidth={1.6} aria-hidden="true" />
        )}
      </div>
      <div className={styles.listingText}>
        <div className={styles.listingHead}>
          <p className="text-heading-md">{listing.title}</p>
          <StatusBadge status={listing.status} />
        </div>
        <p className="text-body-sm">
          {listing.city ?? "Ville inconnue"} · <span className="tabular">{formatPrice(listing.rent)}</span> par mois ·
          avance de {listing.advanceMonths} mois · publiée le {formatShortDate(listing.publishedAt)}
        </p>
        <p className="text-body-sm">
          Propriétaire : {listing.ownerName ?? "inconnu"}
          {listing.ownerPhone && <span className="tabular"> · {listing.ownerPhone}</span>}
        </p>
        {listing.hiddenReason && <p className={styles.hidden}>Motif du masquage : « {listing.hiddenReason} »</p>}
        <p className={styles.description}>{listing.description}</p>
        {listing.status === "published" && (
          <Button href={`/annonces/${listing.id}`} size="sm" variant="secondary">
            Voir la fiche publique
          </Button>
        )}
      </div>
    </div>
  );
}

export default async function AdminReportPage({ params }) {
  const { id } = await params;
  await requireRole("admin", `/admin/signalements/${id}`);
  if (!UUID_PATTERN.test(id)) notFound();

  const report = await getReport(id);
  if (!report) notFound();

  return (
    <>
      <Link href="/admin/signalements" className={styles.back}>
        ← Signalements
      </Link>

      <div>
        <p className={styles.reason}>{REPORT_REASON_LABELS[report.reason]}</p>
        <h1 className="text-display-lg">Signalement</h1>
        <p className={`${styles.status} text-body-md`}>{statusLine(report)}</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.column}>
          <section className={styles.card} aria-labelledby="report-comment">
            <h2 id="report-comment" className="text-heading-sm">
              Ce que dit le locataire
            </h2>
            {report.comment ? (
              <blockquote className={styles.comment}>« {report.comment} »</blockquote>
            ) : (
              <p className={styles.muted}>Aucun commentaire, seulement le motif.</p>
            )}
            <p className="text-caption-sm">
              {report.reporterName ?? "Compte supprimé"} · {formatShortDate(report.createdAt)}
            </p>
          </section>

          <section className={styles.card} aria-labelledby="report-listing">
            <h2 id="report-listing" className="text-heading-sm">
              L&apos;annonce signalée
            </h2>
            <ListingSummary listing={report.listing} />
          </section>

          {report.otherReports.length > 0 && (
            <section className={styles.card} aria-labelledby="report-others">
              <h2 id="report-others" className="text-heading-sm">
                Autres signalements sur cette annonce · {report.otherReports.length}
              </h2>
              <ul className={styles.others}>
                {report.otherReports.map((other) => (
                  <li key={other.id} className={styles.other}>
                    <Link href={`/admin/signalements/${other.id}`} className={styles.otherReason}>
                      {REPORT_REASON_LABELS[other.reason]}
                    </Link>
                    {other.comment && <p className="text-body-sm">« {other.comment} »</p>}
                    <p className="text-caption-sm">
                      {other.reporterName ?? "Compte supprimé"} · {formatAge(other.createdAt)} ·{" "}
                      {DECISIONS[other.status] ?? REPORT_STATUSES.pending.label}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className={styles.column} aria-label="Décision">
          {report.status === "pending" ? (
            <ReportDecision reportId={report.id} listing={report.listing} />
          ) : (
            <p className={styles.card}>
              Ce signalement est clos : {DECISIONS[report.status].toLowerCase()} le {formatShortDate(report.handledAt)}
            </p>
          )}
        </aside>
      </div>
    </>
  );
}
