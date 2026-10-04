export function buildSearchHref(filters, overrides = {}) {
  const f = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (f.ville) params.set("ville", f.ville);
  f.quartiers.forEach((id) => params.append("quartiers", id));
  f.types.forEach((id) => params.append("types", String(id)));
  if (f.loyerMin !== undefined) params.set("loyerMin", String(f.loyerMin));
  if (f.loyerMax !== undefined) params.set("loyerMax", String(f.loyerMax));
  if (f.tri !== "recent") params.set("tri", f.tri);
  if (f.page > 1) params.set("page", String(f.page));

  const query = params.toString();
  return query ? `/recherche?${query}` : "/recherche";
}