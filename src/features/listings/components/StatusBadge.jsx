import { STATUSES } from "../status";
import styles from "./Listings.module.css";

export default function StatusBadge({ status }) {
  const { label, tone } = STATUSES[status];
  return <span className={`${styles.badge} ${styles[tone]}`}>{label}</span>;
}
