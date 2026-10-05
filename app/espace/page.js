import { Plus } from "lucide-react";
import Header from "../../components/Header";
import Button from "../../components/ui/Button";
import { requireRole } from "../../src/features/auth/queries";
import { getOwnerListings } from "../../src/features/listings/queries";
import RecentListings from "../../src/features/tableau-de-bord/components/RecentListings";
import StatCards from "../../src/features/tableau-de-bord/components/StatCards";
import styles from "./page.module.css";

export const metadata = { title: "Mon espace" };

function firstName(fullName) {
  return fullName.trim().split(/\s+/)[0];
}

export default async function OwnerDashboardPage() {
  const profile = await requireRole("owner", "/espace");
  const listings = await getOwnerListings(profile.id);

  return (
    <>
      <Header />
      <main className={`container ${styles.page}`}>
        <div className={styles.head}>
          <div>
            <h1 className="text-display-lg">Bonjour {firstName(profile.full_name)}</h1>
            <p className={`${styles.intro} text-body-md`}>Voici où en sont vos annonces.</p>
          </div>
          <Button href="/mes-annonces/nouvelle">
            <Plus size={18} aria-hidden="true" />
            Publier une annonce
          </Button>
        </div>

        <StatCards listings={listings} />
        <RecentListings listings={listings} />
      </main>
    </>
  );
}
