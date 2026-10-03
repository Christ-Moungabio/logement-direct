import Header from "../../../components/Header";
import { requireRole } from "../../../src/features/auth/queries";
import { createDraft } from "../../../src/features/listing-form/actions";
import ListingForm from "../../../src/features/listing-form/components/ListingForm";
import { getFormOptions } from "../../../src/features/listing-form/queries";
import styles from "./page.module.css";

export const metadata = { title: "Nouvelle annonce" };

export default async function NewListingPage() {
  await requireRole("owner", "/mes-annonces/nouvelle");
  const options = await getFormOptions();

  return (
    <>
      <Header />
      <main className={`container ${styles.page}`}>
        <div>
          <h1 className="text-display-lg">Nouvelle annonce</h1>
          <p className="text-body-md">
            Remplissez ce que vous pouvez : tout est enregistré en brouillon, vous pourrez finir plus tard.
          </p>
        </div>
        <ListingForm action={createDraft} options={options} submitLabel="Enregistrer le brouillon" />
      </main>
    </>
  );
}
