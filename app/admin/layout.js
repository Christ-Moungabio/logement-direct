import { requireRole } from "../../src/features/auth/queries";
import AdminSidebar from "../../src/features/moderation/components/AdminSidebar";
import AdminTopbar from "../../src/features/moderation/components/AdminTopbar";
import { getModerationCounts } from "../../src/features/moderation/queries";
import styles from "./layout.module.css";

export default async function AdminLayout({ children }) {
  const profile = await requireRole("admin", "/admin");
  const counts = await getModerationCounts();

  return (
    <div className={styles.app}>
      <AdminSidebar
        name={profile.full_name}
        pendingReports={counts.pendingReports}
        listingsCount={counts.liveListings + counts.hiddenListings}
      />
      <div className={styles.content}>
        <AdminTopbar />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
