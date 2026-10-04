import Header from "../../components/Header";
import { requireRole } from "../../src/features/auth/queries";
import AdminNav from "../../src/features/moderation/components/AdminNav";
import styles from "./layout.module.css";

export default async function AdminLayout({ children }) {
  await requireRole("admin", "/admin");

  return (
    <>
      <Header />
      <div className={`container ${styles.shell}`}>
        <AdminNav />
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
}
