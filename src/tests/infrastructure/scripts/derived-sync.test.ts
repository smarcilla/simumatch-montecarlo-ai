import { describe, expect, it } from "vitest";
import { buildMatchCommands } from "@/infrastructure/scripts/derived-sync";

describe("Derived sync slug handling", () => {
  it("maps tournament.slug and top-level slug into UpsertMatchCommand", () => {
    const rawMatches = [
      {
        id: 9000,
        homeTeam: { id: 1000 },
        awayTeam: { id: 1001 },
        league_external_id: "league-slug-1",
        season_id: 2025,
        startTimestamp: 1700000000,
        homeScore: { display: 1 },
        awayScore: { display: 2 },
        tournament: { slug: "tournament-slug-1" },
        slug: "match-slug-1",
      },
    ];

    const { commands, skipped } = buildMatchCommands(rawMatches);

    expect(skipped).toBe(0);
    expect(commands).toHaveLength(1);
    expect(commands[0]).toEqual(
      expect.objectContaining({
        tournamentSlug: "tournament-slug-1",
        matchSlug: "match-slug-1",
      })
    );
  });
});
