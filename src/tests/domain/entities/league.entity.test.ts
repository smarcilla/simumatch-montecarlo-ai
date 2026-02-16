import { Season } from "@/domain/entities/season.entity";

import { League } from "@/domain/entities/league.entity";
import { describe, expect, it } from "vitest";
import { SeasonYear } from "@/domain/value-objects/season-year.value";

describe("League entity", () => {
  it("should be equal if they have the same name, country and seasons", () => {
    const season1 = new Season(
      "La Liga 2020/2021",
      new SeasonYear("20/21"),
      "season1-id"
    );
    const season2 = new Season(
      "La Liga 2021/2022",
      new SeasonYear("21/22"),
      "season2-id"
    );

    const league1 = new League("La Liga", "Spain", [season1, season2]);
    const league2 = new League("La Liga", "Spain", [season1, season2]);

    expect(league1.equals(league2)).toBe(true);
  });

  it("should not be equal if they have different names", () => {
    const season1 = new Season(
      "La Liga 2020/2021",
      new SeasonYear("20/21"),
      "season1-id"
    );
    const season2 = new Season(
      "La Liga 2021/2022",
      new SeasonYear("21/22"),
      "season2-id"
    );

    const league1 = new League("La Liga", "Spain", [season1, season2]);
    const league2 = new League("Primera Division", "Spain", [season1, season2]);

    expect(league1.equals(league2)).toBe(false);
  });

  it("should not be equal if they have different countries", () => {
    const season1 = new Season(
      "La Liga 2020/2021",
      new SeasonYear("20/21"),
      "season1-id"
    );
    const season2 = new Season(
      "La Liga 2021/2022",
      new SeasonYear("21/22"),
      "season2-id"
    );

    const league1 = new League("La Liga", "Spain", [season1, season2]);
    const league2 = new League("La Liga", "Italy", [season1, season2]);

    expect(league1.equals(league2)).toBe(false);
  });

  it("should not be equal if they have different seasons", () => {
    const season1 = new Season(
      "La Liga 2020/2021",
      new SeasonYear("20/21"),
      "season1-id"
    );
    const season2 = new Season(
      "La Liga 2021/2022",
      new SeasonYear("21/22"),
      "season2-id"
    );
    const season3 = new Season(
      "La Liga 2022/2023",
      new SeasonYear("22/23"),
      "season3-id"
    );

    const league1 = new League("La Liga", "Spain", [season1, season2]);
    const league2 = new League("La Liga", "Spain", [season1, season3]);

    expect(league1.equals(league2)).toBe(false);
  });
});
