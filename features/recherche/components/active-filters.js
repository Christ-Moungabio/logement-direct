import Link from "next/link";
import { capitalize, formatFcfa } from "@/lib/format";
import { buildSearchHref } from "../url";
import styles from "../recherche.module.css";

export function ActiveFilters({ filters, options }) {
  const without = (overrides) =>
    buildSearchHref(filters, { ...overrides, page: 1 });

  const chips = [];

  for (const id of filters.quartiers) {
    const n = options.neighborhoods.find((x) => x.id === id);
    if (n) {
      chips.push({
        label: n.name,
        href: without({ quartiers: filters.quartiers.filter((q) => q !== id) }),
      });
    }
  }

  for (const id of filters.types) {
    const t = options.propertyTypes.find((x) => x.id === id);
    if (t) {
      chips.push({
        label: capitalize(t.name),
        href: without({ types: filters.types.filter((x) => x !== id) }),
      });
    }
  }

  const { loyerMin, loyerMax } = filters;
  if (loyerMin !== undefined || loyerMax !== undefined) {
    const label =
      loyerMin !== undefined && loyerMax !== undefined
        ? `${formatFcfa(loyerMin)} – ${formatFcfa(loyerMax)}`
        : loyerMin !== undefined
          ? `Min ${formatFcfa(loyerMin)}`
          : `Max ${formatFcfa(loyerMax)}`;
    chips.push({
      label,
      href: without({ loyerMin: undefined, loyerMax: undefined }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={styles.chips}>
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href}
          aria-label={`Retirer le filtre ${chip.label}`}
          className={styles.chip}
        >
          {chip.label} <span aria-hidden="true">×</span>
        </Link>
      ))}
    </div>
  );
}