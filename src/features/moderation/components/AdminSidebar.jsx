"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Flag, House, LayoutGrid, LogOut, Search } from "lucide-react";
import { signOut } from "../../auth/actions";
import styles from "./AdminShell.module.css";

function isActive(pathname, href) {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function AdminSidebar({ name, pendingReports, listingsCount }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Vue d'ensemble", icon: LayoutGrid },
    { href: "/admin/signalements", label: "Signalements", icon: Flag, count: pendingReports, urgent: pendingReports > 0 },
    { href: "/admin/annonces", label: "Annonces", icon: Building2, count: listingsCount },
  ];

  return (
    <aside className={styles.sidebar}>
      <Link href="/admin" className={styles.brand}>
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect x="3.5" y="3.5" width="25" height="25" rx="8" stroke="var(--color-primary)" strokeWidth="3" />
          <path d="M10 17.5 16 12l6 5.5V23H10z" fill="var(--color-ink)" />
        </svg>
        Ndako
        <span className={styles.brandTag}>Admin</span>
      </Link>

      <nav className={styles.group} aria-label="Modération">
        <p className={styles.groupLabel}>Modération</p>
        {links.map(({ href, label, icon: Icon, count, urgent }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${active ? styles.navActive : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span className={styles.navLabel}>{label}</span>
              {count !== undefined && (
                <span className={`${styles.count} ${urgent ? styles.countUrgent : ""} tabular`}>{count}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <nav className={`${styles.group} ${styles.siteGroup}`} aria-label="Site public">
        <p className={styles.groupLabel}>Site public</p>
        <Link href="/" className={styles.navLink}>
          <House size={18} strokeWidth={1.8} aria-hidden="true" />
          <span className={styles.navLabel}>Accueil</span>
        </Link>
        <Link href="/recherche" className={styles.navLink}>
          <Search size={18} strokeWidth={1.8} aria-hidden="true" />
          <span className={styles.navLabel}>Rechercher</span>
        </Link>
      </nav>

      <div className={styles.account}>
        <span className={styles.avatar} aria-hidden="true">
          {initials(name)}
        </span>
        <span className={styles.accountText}>
          <span className={styles.accountName}>{name}</span>
          <span className={styles.accountRole}>Administrateur</span>
        </span>
        <form action={signOut}>
          <button type="submit" className={styles.iconButton} aria-label="Se déconnecter" title="Se déconnecter">
            <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </form>
      </div>
    </aside>
  );
}
