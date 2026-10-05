import Link from "next/link";
import { EyeOff, Flag, House } from "lucide-react";
import { capitalize } from "../../lib/format";
import { requireRole } from "../../src/features/auth/queries";
import AdminPageHeader from "../../src/features/moderation/components/AdminPageHeader";
import { getModerationCounts } from "../../src/features/moderation/queries";
import styles from "./page.module.css";

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
  const counts = await getModerationCounts();

  const stats = [
    {
      label: "Signalements à traiter",
      value: counts.pendingReports,
      icon: Flag,
      urgent: counts.pendingReports > 0,
      href: "/admin/signalements",
    },
    { label: "Annonces masquées", value: counts.hiddenListings, icon: EyeOff, href: "/admin/annonces?statut=masquees" },
    { label: "Annonces en ligne", value: counts.liveListings, icon: House, href: "/admin/annonces" },
  ];

  return (
    <>
      <AdminPageHeader title="Vue d'ensemble" description={capitalize(todayFormatter.format(new Date()))} />

      <ul className={styles.stats}>
        {stats.map(({ label, value, icon: Icon, urgent, href }) => {
          const className = `${styles.stat} ${urgent ? styles.urgent : ""}`;
          const content = (
            <>
              <Icon size={22} aria-hidden="true" className={styles.icon} />
              <span className={`${styles.value} tabular`}>{value}</span>
              <span className={styles.label}>{label}</span>
            </>
          );
          return (
            <li key={label}>
              {href ? (
                <Link href={href} className={`${className} ${styles.statLink}`}>
                  {content}
                </Link>
              ) : (
                <div className={className}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
