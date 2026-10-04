import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "../../../../components/Header";
import { requireRole } from "../../../../src/features/auth/queries";
import { updateListing } from "../../../../src/features/listing-form/actions";
import ListingForm from "../../../../src/features/listing-form/components/ListingForm";
import PublishPanel from "../../../../src/features/listing-form/components/PublishPanel";
import PhotoManager from "../../../../src/features/listing-form/components/PhotoManager";
import { publishChecklist } from "../../../../src/features/listing-form/checklist";
import { getFormOptions, getListingPhotos } from "../../../../src/features/listing-form/queries";
import { createClient } from "../../../../src/lib/supabase/server";
import styles from "./page.module.css";

export const metadata = { title: "Modifier l'annonce" };

function toFormValues(listing) {
  return {
    propertyTypeId: listing.property_type_id ? String(listing.property_type_id) : "",
    cityId: listing.city_id ?? "",
    neighborhoodId: listing.neighborhood_id ?? "",
    monthlyRent: listing.monthly_rent ?? "",
    advanceMonths: listing.advance_months ?? "",
    description: listing.description ?? "",
    water: listing.water ?? "",
    electricity: listing.electricity ?? "",
    doorsCount: listing.doors_count ?? "",
    availability: listing.availability ?? "",
    availableFrom: listing.available_from ?? "",
  };
}

export default async function EditListingPage({ params }) {
  const { id } = await params;
  const profile = await requireRole("owner", `/mes-annonces/${id}/modifier`);

  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("owner_id", profile.id)
    .maybeSingle();
  if (!listing) notFound();
  if (listing.status === "hidden" || listing.status === "closed") redirect("/mes-annonces");

  const [options, photos] = await Promise.all([getFormOptions(), getListingPhotos(id)]);
  const isDraft = listing.status === "draft";
  const isScheduled = listing.status === "scheduled" && new Date(listing.visible_from) > new Date();

  return (
    <>
      <Header />
      <main className={`container ${styles.page}`}>
        <Link href="/mes-annonces" className={styles.back}>
          ← Mes annonces
        </Link>
        <div>
          <h1 className="text-display-lg">{isDraft ? "Terminer mon annonce" : "Modifier mon annonce"}</h1>
          <p className="text-body-md">
            {isDraft
              ? "Cette annonce est un brouillon, personne d'autre ne la voit."
              : "Vos modifications sont visibles tout de suite par les locataires."}
          </p>
        </div>
        {isScheduled && (
          <p className={styles.notice} role="status">
            Votre annonce est en cours de mise en ligne : les locataires la verront vers{" "}
            {new Date(listing.visible_from).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Africa/Brazzaville",
            })}
            . D&apos;ici là, vous pouvez encore la modifier ou la retirer depuis Mes annonces.
          </p>
        )}
        <PhotoManager listingId={id} photos={photos} />
        <ListingForm
          action={updateListing.bind(null, id)}
          options={options}
          initialValues={toFormValues(listing)}
          submitLabel="Enregistrer"
        />
        {isDraft && <PublishPanel listingId={id} checklist={publishChecklist(listing, photos.length)} />}
      </main>
    </>
  );
}
