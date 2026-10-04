import "server-only";

import { createClient } from "../../lib/supabase/server";
import { PHOTOS_BUCKET } from "./photos";

export async function getFormOptions() {
  const supabase = await createClient();

  const [types, cities, neighborhoods] = await Promise.all([
    supabase.from("property_types").select("id, name").order("id"),
    supabase.from("cities").select("id, name").order("name"),
    supabase.from("neighborhoods").select("id, name, city_id").order("name"),
  ]);

  const failed = types.error ?? cities.error ?? neighborhoods.error;
  if (failed) throw new Error(`Listes indisponibles : ${failed.message}`);

  return {
    propertyTypes: types.data,
    cities: cities.data,
    neighborhoods: neighborhoods.data,
  };
}

export async function getListingPhotos(listingId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listing_photos")
    .select("id, storage_path, sort_order, is_primary")
    .eq("listing_id", listingId)
    .order("sort_order");
  if (error) throw new Error(`Photos indisponibles : ${error.message}`);

  return data.map((photo) => ({
    id: photo.id,
    sortOrder: photo.sort_order,
    isPrimary: photo.is_primary,
    url: supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(photo.storage_path).data.publicUrl,
  }));
}
