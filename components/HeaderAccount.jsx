import Link from "next/link";
import { Menu } from "lucide-react";
import SignOutButton from "../src/features/auth/components/SignOutButton";
import { spaceLinkForRole } from "../src/features/auth/navigation";
import { getCurrentProfile } from "../src/features/auth/queries";
import styles from "./Header.module.css";

function firstName(fullName) {
  return fullName.trim().split(/\s+/)[0];
}

export default async function HeaderAccount({ navLinks }) {
  const profile = await getCurrentProfile();
  const space = profile ? spaceLinkForRole(profile.role) : null;
  const name = profile ? firstName(profile.full_name) : null;

  return (
    <div className={styles.actions}>
      {profile ? (
        <>
          {space && (
            <Link href={space.href} className={styles.login}>
              {space.label}
            </Link>
          )}
          <span className={styles.user}>
            <span className={styles.avatar} aria-hidden="true">
              {name.charAt(0).toUpperCase()}
            </span>
            {name}
          </span>
          <SignOutButton className={styles.logout} formClassName={styles.logoutForm} />
        </>
      ) : (
        <>
          <Link href="/connexion" className={styles.login}>
            Connexion
          </Link>
          <Link href="/inscription" className={styles.cta}>
            Créer un compte
          </Link>
        </>
      )}

      <details className={styles.menu}>
        <summary className={styles.menuButton} aria-label="Ouvrir le menu">
          <Menu size={22} strokeWidth={2.2} aria-hidden="true" />
        </summary>
        <nav className={styles.menuPanel} aria-label="Menu mobile">
          {profile && <p className={styles.menuUser}>Connecté en tant que {profile.full_name}</p>}
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.menuLink}>
              {link.label}
            </Link>
          ))}
          {profile ? (
            <>
              {space && (
                <Link href={space.href} className={styles.menuLink}>
                  {space.label}
                </Link>
              )}
              <SignOutButton className={`${styles.menuLink} ${styles.menuLogout}`} />
            </>
          ) : (
            <>
              <Link href="/connexion" className={styles.menuLink}>
                Connexion
              </Link>
              <Link href="/inscription" className={`${styles.menuLink} ${styles.menuCta}`}>
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </details>
    </div>
  );
}
