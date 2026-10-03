import { describe, expect, it } from "vitest";

import {
  buildContactMessage,
  buildListingPageTitle,
  computeAdvanceAmount,
  getEffectiveAvailability,
} from "./rules";

const plain = (value) => value.replace(/ /g, " ");

describe("computeAdvanceAmount", () => {
  it("multiplie le loyer par le nombre de mois", () => {
    expect(computeAdvanceAmount(150000, 3)).toBe(450000);
    expect(computeAdvanceAmount(75000, 1)).toBe(75000);
    expect(computeAdvanceAmount(60000, 6)).toBe(360000);
  });
});

describe("getEffectiveAvailability", () => {
  const today = "2026-10-03";

  it("affiche Libre pour une annonce libre", () => {
    expect(
      getEffectiveAvailability(
        { availability: "available", availableFrom: null },
        today,
      ),
    ).toEqual({ status: "available" });
  });

  it("affiche Bientôt libre quand la date est future", () => {
    expect(
      getEffectiveAvailability(
        { availability: "available_soon", availableFrom: "2026-10-04" },
        today,
      ),
    ).toEqual({ status: "available_soon", from: "2026-10-04" });
  });

  it("affiche Libre quand la date est atteinte (RG-12)", () => {
    expect(
      getEffectiveAvailability(
        { availability: "available_soon", availableFrom: "2026-10-03" },
        today,
      ),
    ).toEqual({ status: "available" });
  });

  it("affiche Libre quand la date est dépassée", () => {
    expect(
      getEffectiveAvailability(
        { availability: "available_soon", availableFrom: "2026-09-30" },
        today,
      ),
    ).toEqual({ status: "available" });
  });

  it("affiche Libre si la date manque", () => {
    expect(
      getEffectiveAvailability(
        { availability: "available_soon", availableFrom: null },
        today,
      ),
    ).toEqual({ status: "available" });
  });
});

describe("titres et message", () => {
  const listing = {
    propertyType: "Appartement",
    neighborhood: "Bacongo",
    monthlyRent: 150000,
  };

  it("construit le titre de la page", () => {
    expect(plain(buildListingPageTitle(listing))).toBe(
      "Appartement à Bacongo · 150 000 FCFA/mois",
    );
  });

  it("mentionne l'annonce et son lien dans le message WhatsApp", () => {
    const message = buildContactMessage(
      listing,
      "https://exemple.cg/annonces/1",
    );
    expect(plain(message)).toContain(
      "Appartement à Bacongo · 150 000 FCFA/mois",
    );
    expect(message).toContain("https://exemple.cg/annonces/1");
  });
});
