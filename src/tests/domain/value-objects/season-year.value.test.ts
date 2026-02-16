import { SeasonYear } from "@/domain/value-objects/season-year.value";

import { describe, it, expect } from "vitest";

describe("SeasonYear Value Object", () => {
  it("should create a SeasonYear instance with a valid season year format", () => {
    const seasonYear = new SeasonYear("25/26");
    expect(seasonYear.value).toBe("25/26");
  });

  it("should throw an error for an invalid season year format", () => {
    expect(() => new SeasonYear("2025/2026")).toThrow(
      "Invalid season year format: 2025/2026"
    );
    expect(() => new SeasonYear("25-26")).toThrow(
      "Invalid season year format: 25-26"
    );
    expect(() => new SeasonYear("invalid")).toThrow(
      "Invalid season year format: invalid"
    );
  });

  it("should consider two SeasonYear instances equal if their values are the same", () => {
    const seasonYear1 = new SeasonYear("25/26");
    const seasonYear2 = new SeasonYear("25/26");
    const seasonYear3 = new SeasonYear("24/25");

    expect(seasonYear1.equals(seasonYear2)).toBe(true);
    expect(seasonYear1.equals(seasonYear3)).toBe(false);
  });
});
