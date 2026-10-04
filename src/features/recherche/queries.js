import { createClient } from "@/src/lib/supabase/server";
import { PAGE_SIZE } from "./schemas";

const PHOTOS_BUCKET = "listing-photos";

function one(value) {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function searchListings(filters) {
  const supabase = await createClient();

  const from = (filters.page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // La vue ne contient que les annonces publiées et déjà visibles (REC-05)
  // et jamais le numéro du propriétaire (RG-13).
  let query = supabase
    .from("public_listings")
    .select(
      `
      id,
      monthly_rent,
      advance_months,
      availability,
      available_from,
      published_at,
      property_types ( name ),
      cities ( name ),
      neighborhoods ( name ),
      listing_photos ( storage_path, is_primary )
    `,
      { count: "exact" },
    )
    .eq("listing_photos.is_primary", true);

  if (filters.ville) query = query.eq("city_id", filters.ville);
  if (filters.quartiers.length > 0) {
    query = query.in("neighborhood_id", filters.quartiers);
  }
  if (filters.types.length > 0) {
    query = query.in("property_type_id", filters.types);
  }
  if (filters.loyerMin !== undefined) {
    query = query.gte("monthly_rent", filters.loyerMin);
  }
  if (filters.loyerMax !== undefined) {
    query = query.lte("monthly_rent", filters.loyerMax);
  }

  if (filters.tri === "prix-asc") {
    query = query.order("monthly_rent", { ascending: true });
  } else if (filters.tri === "prix-desc") {
    query = query.order("monthly_rent", { ascending: false });
  }
  // Tri par défaut (RG-19) et critère de départage stable entre les pages.
  query = query.order("published_at", { ascending: false }).order("id");

  const { data, count, error } = await query.range(from, to);

  // Page demandée au-delà du dernier résultat : on renvoie une liste vide.
  if (error?.code === "PGRST103") {
    return { items: [], total: 0, page: filters.page, pageCount: 1 };
  }
  if (error) throw new Error(`Recherche impossible : ${error.message}`);

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Africa/Brazzaville",
  });

  const items = (data ?? []).map((row) => {
    const photo = row.listing_photos?.[0] ?? null;
    const stillSoon =
      row.availability === "available_soon" &&
      row.available_from !== null &&
      row.available_from > today;

    return {
      id: row.id,
      rent: row.monthly_rent,
      advanceMonths: row.advance_months,
      advanceAmount: row.monthly_rent * row.advance_months,
      propertyType: one(row.property_types)?.name ?? "",
      city: one(row.cities)?.name ?? "",
      neighborhood: one(row.neighborhoods)?.name ?? "",
      photoUrl: photo
        ? supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(photo.storage_path)
            .data.publicUrl
        : null,
      isAvailableNow: !stillSoon,
      availableFrom: stillSoon ? row.available_from : null,
      publishedAt: row.published_at,
    };
  });

  const total = count ?? 0;

  return {
    items,
    total,
    page: filters.page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}