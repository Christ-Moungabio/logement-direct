import { describe, expect, it } from "vitest";

import { loginUrl, safeRedirectPath } from "./navigation";

describe("safeRedirectPath", () => {
  it("accepte un chemin interne", () => {
    expect(safeRedirectPath("/annonces/abc")).toBe("/annonces/abc");
  });

  it.each([
    "https://exemple.com",
    "//exemple.com",
    "/\\exemple.com",
    "annonces",
    undefined,
    null,
  ])("refuse %s", (value) => {
    expect(safeRedirectPath(value)).toBe("/");
  });
});

describe("loginUrl", () => {
  it("encode la page de retour", () => {
    expect(loginUrl("/annonces/abc")).toBe(
      "/connexion?redirect=%2Fannonces%2Fabc",
    );
  });
});
