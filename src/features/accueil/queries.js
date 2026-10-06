import "server-only";

import { createClient } from "../../lib/supabase/server";

const PHOTOS_BUCKET = "listing-photos";

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

export async function getPropertyTypes() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("property_types").select("id, name").order("id");
  if (error) {
    console.error("Types de biens indisponibles", error.message);
    return [];
  }
  return data.map((type) => ({ id: type.id, label: capitalize(type.name) }));
}

export async function getLatestListings(limit) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_listings")
    .select(
      `
      id, monthly_rent, advance_months, availability, available_from, published_at,
      property_types ( name ),
      cities ( name ),
      neighborhoods ( name ),
      listing_photos ( storage_path, is_primary, sort_order )
    `,
    )
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Annonces indisponibles", error.message);
    return [];
  }

  return data.map((row) => {
    const [photo] = [...(row.listing_photos ?? [])].sort(
      (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order,
    );

    return {
      id: row.id,
      typeLabel: capitalize(row.property_types?.name),
      city: row.cities?.name ?? "",
      district: row.neighborhoods?.name ?? "",
      price: row.monthly_rent,
      advanceMonths: row.advance_months,
      availability: { status: row.availability, date: row.available_from },
      publishedAt: row.published_at,
      photoUrl: photo
        ? supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(photo.storage_path).data.publicUrl
        : null,
    };
  });
}
