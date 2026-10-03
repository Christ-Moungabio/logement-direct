import { createClient } from "@/lib/supabase/server";

export async function getFilterOptions() {
  const supabase = await createClient();

  const [cities, neighborhoods, types] = await Promise.all([
    supabase.from("cities").select("id, name").order("name"),
    supabase.from("neighborhoods").select("id, name, city_id").order("name"),
    supabase.from("property_types").select("id, name").order("id"),
  ]);

  const failed = cities.error ?? neighborhoods.error ?? types.error;
  if (failed) throw new Error(`Listes indisponibles : ${failed.message}`);

  return {
    cities: cities.data ?? [],
    neighborhoods: (neighborhoods.data ?? []).map((n) => ({
      id: n.id,
      name: n.name,
      cityId: n.city_id,
    })),  
    propertyTypes: types.data ?? [],
  };
}