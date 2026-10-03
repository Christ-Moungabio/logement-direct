import { describe, expect, it } from "vitest";

import {
  formatCalendarDay,
  formatDate,
  formatFcfa,
  formatLongDate,
  formatNumber,
  todayInBrazzaville,
} from "./format";

// Remplace les espaces insécables pour lire les attentes plus facilement.
const plain = (value) => value.replace(/ /g, " ");

describe("formatNumber", () => {
  it("sépare les milliers par une espace", () => {
    expect(plain(formatNumber(150000))).toBe("150 000");
    expect(plain(formatNumber(1250000))).toBe("1 250 000");
    expect(plain(formatNumber(999))).toBe("999");
    expect(plain(formatNumber(0))).toBe("0");
  });

  it("utilise une espace insécable", () => {
    expect(formatNumber(150000)).toBe("150 000");
  });

  it("arrondit et garde le signe", () => {
    expect(plain(formatNumber(1999.6))).toBe("2 000");
    expect(plain(formatNumber(-45000))).toBe("-45 000");
  });
});

describe("formatFcfa", () => {
  it("formate un montant au format « 150 000 FCFA »", () => {
    expect(plain(formatFcfa(150000))).toBe("150 000 FCFA");
    expect(plain(formatFcfa(450000))).toBe("450 000 FCFA");
    expect(plain(formatFcfa(25000))).toBe("25 000 FCFA");
  });
});

describe("dates", () => {
  it("formate un horodatage dans le fuseau de Brazzaville", () => {
    // 23 h 30 UTC le 27 septembre = 0 h 30 le 28 septembre à Brazzaville (UTC+1).
    expect(formatDate("2026-09-27T23:30:00Z")).toBe("28 sept. 2026");
    expect(formatLongDate("2026-09-27T23:30:00Z")).toBe("28 septembre 2026");
  });

  it("formate un jour calendaire sans décalage de fuseau", () => {
    expect(formatCalendarDay("2026-10-13")).toBe("13 octobre 2026");
    expect(formatCalendarDay("2027-01-01")).toBe("1 janvier 2027");
  });

  it("calcule le jour courant à Brazzaville", () => {
    expect(todayInBrazzaville(new Date("2026-10-02T22:59:00Z"))).toBe(
      "2026-10-02",
    );
    expect(todayInBrazzaville(new Date("2026-10-02T23:00:00Z"))).toBe(
      "2026-10-03",
    );
  });
});
