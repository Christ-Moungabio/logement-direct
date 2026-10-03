import { Plus } from "lucide-react";
import Header from "../../components/Header";
import Button from "../../components/ui/Button";
import { requireRole } from "../../src/features/auth/queries";
import ListingsList from "../../src/features/listings/components/ListingsList";
import { getOwnerListings } from "../../src/features/listings/queries";
import styles from "./page.module.css";

export const metadata = { title: "Mes annonces" };

export default async function MyListingsPage() {
  const profile = await requireRole("owner", "/mes-annonces");
  const listings = await getOwnerListings(profile.id);

  return (
    <>
      <Header />
      <main className={`container ${styles.page}`}>
        <div className={styles.head}>
          <div>
            <h1 className="text-display-lg">Mes annonces</h1>
            <p className={`${styles.count} text-body-md`}>
              {listings.length} annonce{listings.length > 1 ? "s" : ""}
            </p>
          </div>
          <Button href="/mes-annonces/nouvelle">
            <Plus size={18} aria-hidden="true" />
            Publier une annonce
          </Button>
        </div>

        {listings.length === 0 ? (
          <p className={styles.empty}>
            Vous n&apos;avez pas encore d&apos;annonce. Commencez par en créer une, elle restera en brouillon
            tant que vous ne la publiez pas.
          </p>
        ) : (
          <ListingsList listings={listings} />
        )}
      </main>
    </>
  );
}
