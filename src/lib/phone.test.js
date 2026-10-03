import { describe, expect, it } from "vitest";

import {
  buildTelLink,
  buildWhatsAppLink,
  formatPhoneNumber,
  normalizeWhatsappNumber,
} from "./phone";

describe("normalizeWhatsappNumber", () => {
  it.each([
    ["06 123 45 67", "+242061234567"],
    ["061234567", "+242061234567"],
    ["+242 06 123 45 67", "+242061234567"],
    ["242061234567", "+242061234567"],
    ["00242-06-123-45-67", "+242061234567"],
  ])("normalise %s", (input, expected) => {
    expect(normalizeWhatsappNumber(input)).toBe(expected);
  });

  it.each(["", "1234", "+33612345678", "06 123 45 6", "abc", null])(
    "refuse %s",
    (input) => {
      expect(normalizeWhatsappNumber(input)).toBeNull();
    },
  );
});

describe("formatPhoneNumber", () => {
  it("regroupe les chiffres", () => {
    expect(formatPhoneNumber("+242061234567")).toBe("+242 06 123 45 67");
  });
});

describe("liens de contact", () => {
  it("construit un lien d'appel", () => {
    expect(buildTelLink("+242061234567")).toBe("tel:+242061234567");
  });

  it("construit un lien WhatsApp avec message encodé", () => {
    const link = buildWhatsAppLink("+242061234567", "Bonjour, l'annonce ?");
    expect(link).toBe(
      "https://wa.me/242061234567?text=Bonjour%2C%20l'annonce%20%3F",
    );
    const url = new URL(link);
    expect(url.searchParams.get("text")).toBe("Bonjour, l'annonce ?");
  });
});
