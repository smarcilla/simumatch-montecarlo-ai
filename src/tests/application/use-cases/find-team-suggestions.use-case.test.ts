import { FindTeamSuggestionsUseCase } from "@/application/use-cases/find-team-suggestions.use-case";
import { DIContainer } from "@/infrastructure/di-container";
import { beforeEach, describe, expect, it } from "vitest";
import {
  buildLeague,
  buildMatch,
  buildSeason,
  buildTeam,
} from "@/tests/helpers/builders";

describe("FindTeamSuggestionsUseCase", () => {
  let useCase: FindTeamSuggestionsUseCase;

  beforeEach(async () => {
    useCase = await DIContainer.getFindTeamSuggestionsUseCase();
  });

  it("should return suggestions only for teams in league and season context", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);
    const otherLeague = await buildLeague();
    const otherSeason = await buildSeason(otherLeague._id);

    const barcelona = await buildTeam({
      name: "FC Barcelona",
      shortName: "BAR",
      slug: "fc-barcelona",
    });
    const madrid = await buildTeam({
      name: "Real Madrid",
      shortName: "RMA",
      slug: "real-madrid",
    });
    const bayern = await buildTeam({
      name: "Bayern Munich",
      shortName: "FCB",
      slug: "bayern-munich",
    });

    await buildMatch(league._id, season._id, barcelona._id, madrid._id);
    await buildMatch(otherLeague._id, otherSeason._id, bayern._id, madrid._id);

    const result = await useCase.execute(
      "bar",
      league._id.toString(),
      season._id.toString()
    );

    expect(result).toHaveLength(1);
    expect(result[0]!.name).toBe("FC Barcelona");
    expect(result[0]!.slug).toBe("fc-barcelona");
  });

  it("should match teams by short name", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);

    const teamA = await buildTeam({
      name: "Atletico Madrid",
      shortName: "ATM",
      slug: "atletico-madrid",
    });
    const teamB = await buildTeam({
      name: "Sevilla",
      shortName: "SEV",
      slug: "sevilla",
    });

    await buildMatch(league._id, season._id, teamA._id, teamB._id);

    const result = await useCase.execute(
      "atm",
      league._id.toString(),
      season._id.toString()
    );

    expect(result).toHaveLength(1);
    expect(result[0]!.name).toBe("Atletico Madrid");
  });

  it("should return empty array when pattern length is below threshold", async () => {
    const league = await buildLeague();
    const season = await buildSeason(league._id);

    const result = await useCase.execute(
      "ba",
      league._id.toString(),
      season._id.toString()
    );

    expect(result).toHaveLength(0);
  });
});
