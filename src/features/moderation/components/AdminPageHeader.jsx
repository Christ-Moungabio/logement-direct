import styles from "./AdminShell.module.css";

export default function AdminPageHeader({ title, description, children }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <h1 className={styles.pageTitle}>{title}</h1>
        {description && <p className={styles.pageDescription}>{description}</p>}
      </div>
      {children && <div className={styles.pageActions}>{children}</div>}
    </div>
  );
}
