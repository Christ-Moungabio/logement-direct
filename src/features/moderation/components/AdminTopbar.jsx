"use client";

import Form from "next/form";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";
import styles from "./AdminShell.module.css";

const PAGES = [
  { match: (pathname) => pathname === "/admin", label: "Vue d'ensemble" },
  {
    match: (pathname) => pathname.startsWith("/admin/signalements/"),
    label: "Signalement",
    parent: { href: "/admin/signalements", label: "Signalements" },
  },
  { match: (pathname) => pathname === "/admin/signalements", label: "Signalements" },
  { match: (pathname) => pathname.startsWith("/admin/annonces"), label: "Annonces" },
];

export default function AdminTopbar() {
  const pathname = usePathname();
  const page = PAGES.find((item) => item.match(pathname));
  const trail = [{ href: "/admin", label: "Administration" }, ...(page?.parent ? [page.parent] : [])];

  return (
    <header className={styles.topbar}>
      <nav aria-label="Fil d'Ariane">
        <ol className={styles.breadcrumb}>
          {trail.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
              <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
            </li>
          ))}
          <li aria-current="page" className={styles.breadcrumbCurrent}>
            {page?.label ?? "Administration"}
          </li>
        </ol>
      </nav>

      <Form action="/admin/annonces" className={styles.search} role="search">
        <label htmlFor="admin-search" className="visually-hidden">
          Rechercher une annonce
        </label>
        <Search size={16} strokeWidth={2} aria-hidden="true" className={styles.searchIcon} />
        <input
          id="admin-search"
          type="search"
          name="q"
          placeholder="Quartier, type, propriétaire…"
          className={styles.searchInput}
        />
      </Form>
    </header>
  );
}
