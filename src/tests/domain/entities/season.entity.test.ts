import { Season } from "@/domain/entities/season.entity";
import { SeasonYear } from "@/domain/value-objects/season-year.value";

import { describe, it, expect } from "vitest";

describe("Season Entity", () => {
  it("should create a Season instance with valid name and year", () => {
    const seasonYear = new SeasonYear("25/26");
    const season = new Season("La Liga 2025/2026", seasonYear);

    expect(season.name).toBe("La Liga 2025/2026");
    expect(season.year.value).toBe("25/26");
  });

  it("should consider two Season instances equal if their names and years are the same", () => {
    const seasonYear1 = new SeasonYear("25/26");
    const seasonYear2 = new SeasonYear("25/26");
    const season1 = new Season("La Liga 2025/2026", seasonYear1);
    const season2 = new Season("La Liga 2025/2026", seasonYear2);
    const season3 = new Season("La Liga 2024/2025", seasonYear1);

    expect(season1.equals(season2)).toBe(true);
    expect(season1.equals(season3)).toBe(false);
  });
});
