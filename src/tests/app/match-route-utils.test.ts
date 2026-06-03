import { describe, expect, it } from "vitest";
import {
  buildCanonicalMatchChronicleHref,
  buildCanonicalMatchHref,
  buildCanonicalMatchSimulationHref,
  buildMatchRouteQuery,
  isCanonicalMatchPath,
} from "@/app/match/match-route-utils";

describe("match route utilities", () => {
  const match = {
    id: "match-1",
    tournamentSlug: "tournament-slug-1",
    matchSlug: "match-slug-1",
  };

  it("builds canonical match hrefs with optional back query", () => {
    expect(buildCanonicalMatchHref(match)).toBe(
      "/match/tournament-slug-1/match-slug-1/match-1"
    );
    expect(
      buildCanonicalMatchHref(match, { back: "/?league=39&season=2025" })
    ).toBe(
      "/match/tournament-slug-1/match-slug-1/match-1?back=%2F%3Fleague%3D39%26season%3D2025"
    );
  });

  it("builds canonical nested simulation and chronicle hrefs", () => {
    expect(buildCanonicalMatchSimulationHref(match)).toBe(
      "/match/tournament-slug-1/match-slug-1/match-1/simulation"
    );
    expect(buildCanonicalMatchChronicleHref(match)).toBe(
      "/match/tournament-slug-1/match-slug-1/match-1/chronicle"
    );
  });

  it("returns null when slugs are missing", () => {
    expect(
      buildCanonicalMatchHref({
        id: "match-1",
        tournamentSlug: undefined,
        matchSlug: undefined,
      })
    ).toBeNull();
  });

  it("compares current slug path to actual match slugs", () => {
    expect(
      isCanonicalMatchPath(match, "tournament-slug-1", "match-slug-1")
    ).toBe(true);
    expect(
      isCanonicalMatchPath(match, "other-tournament", "match-slug-1")
    ).toBe(false);
  });

  it("builds supported query params for redirect preservation", () => {
    expect(buildMatchRouteQuery()).toBeUndefined();
    expect(buildMatchRouteQuery({ back: "/?league=39" })).toBe(
      "back=%2F%3Fleague%3D39"
    );
  });
});
