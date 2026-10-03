import { describe, expect, it } from "vitest";

import { listingIdSchema, reportSchema } from "./schemas";

const ID = "8f14e45f-ceea-467a-9575-5c3ab1a2f1c0";

describe("listingIdSchema", () => {
  it("accepte un UUID", () => {
    expect(listingIdSchema.safeParse(ID).success).toBe(true);
  });

  it.each(["123", "abc", "", `${ID}x`])("refuse %s", (value) => {
    expect(listingIdSchema.safeParse(value).success).toBe(false);
  });
});

describe("reportSchema", () => {
  it("exige un motif connu", () => {
    const result = reportSchema.safeParse({ listingId: ID, reason: "spam" });
    expect(result.success).toBe(false);
  });

  it("rend le commentaire facultatif", () => {
    const result = reportSchema.parse({ listingId: ID, reason: "scam" });
    expect(result.comment).toBeNull();
  });

  it("transforme un commentaire vide en null", () => {
    const result = reportSchema.parse({
      listingId: ID,
      reason: "other",
      comment: "   ",
    });
    expect(result.comment).toBeNull();
  });

  it("limite la longueur du commentaire", () => {
    const result = reportSchema.safeParse({
      listingId: ID,
      reason: "other",
      comment: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});
