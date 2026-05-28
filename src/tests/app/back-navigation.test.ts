import { describe, expect, it } from "vitest";
import { buildBackUrl } from "@/app/page";
import { resolveBackHref } from "@/app/match/[id]/page";

describe("Back navigation", () => {
  it("builds backUrl from search params and keeps encoded href stable", () => {
    const backUrl = buildBackUrl({
      league: "39",
      season: "2025",
      page: "4",
      team: "spain",
    });

    expect(backUrl).toBe("/?league=39&season=2025&page=4&team=spain");
    expect(`/match/match-1?back=${encodeURIComponent(backUrl ?? "")}`).toBe(
      "/match/match-1?back=%2F%3Fleague%3D39%26season%3D2025%26page%3D4%26team%3Dspain"
    );
  });

  it("falls back when back param is missing or invalid absolute URL", () => {
    expect(resolveBackHref(undefined, "39", "2025")).toBe(
      "/?league=39&season=2025"
    );
    expect(resolveBackHref("https://evil.com", "39", "2025")).toBe(
      "/?league=39&season=2025"
    );
  });

  it("uses valid back param as href", () => {
    expect(
      resolveBackHref("/?league=39&season=2025&page=4", "39", "2025")
    ).toBe("/?league=39&season=2025&page=4");
  });
});
