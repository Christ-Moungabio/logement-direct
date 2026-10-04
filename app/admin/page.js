import { EyeOff, Flag, House } from "lucide-react";
import { requireRole } from "../../src/features/auth/queries";
import { getModerationCounts } from "../../src/features/moderation/queries";
import styles from "./page.module.css";

export const metadata = { title: "Administration" };

export default async function AdminHomePage() {
  const profile = await requireRole("admin", "/admin");
  const counts = await getModerationCounts();
  const firstName = profile.full_name.split(" ")[0];

  const stats = [
    { label: "Signalements à traiter", value: counts.pendingReports, icon: Flag, urgent: counts.pendingReports > 0 },
    { label: "Annonces masquées", value: counts.hiddenListings, icon: EyeOff },
    { label: "Annonces en ligne", value: counts.liveListings, icon: House },
  ];

  return (
    <>
      <div>
        <h1 className="text-display-lg">Administration</h1>
        <p className={`${styles.intro} text-body-md`}>
          Bonjour {firstName}. Les annonces sont publiées sans validation : ici, vous suivez les signalements des
          locataires et les annonces masquées.
        </p>
      </div>

      <ul className={styles.stats}>
        {stats.map(({ label, value, icon: Icon, urgent }) => (
          <li key={label} className={`${styles.stat} ${urgent ? styles.urgent : ""}`}>
            <Icon size={22} aria-hidden="true" className={styles.icon} />
            <p className={`${styles.value} tabular`}>{value}</p>
            <p className={styles.label}>{label}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
