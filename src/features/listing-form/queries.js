import "server-only";

import { createClient } from "../../lib/supabase/server";

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
