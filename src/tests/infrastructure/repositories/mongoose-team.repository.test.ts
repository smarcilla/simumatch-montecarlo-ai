import { MongooseTeamRepository } from "@/infrastructure/repositories/mongoose-team.repository";
import { beforeEach, describe, expect, it } from "vitest";
import { buildTeam } from "@/tests/helpers/builders";

describe("MongooseTeamRepository", () => {
  let repository: MongooseTeamRepository;

  beforeEach(() => {
    repository = new MongooseTeamRepository();
  });

  it("should find a team by slug", async () => {
    await buildTeam({
      name: "FC Barcelona",
      slug: "fc-barcelona",
      shortName: "BAR",
    });

    const result = await repository.findBySlug("fc-barcelona");

    expect(result).not.toBeNull();
    expect(result!.name).toBe("FC Barcelona");
  });

  it("should return null when slug does not exist", async () => {
    const result = await repository.findBySlug("team-does-not-exist");
    expect(result).toBeNull();
  });

  it("should find teams by pattern within provided ids", async () => {
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
    await buildTeam({
      name: "Barcelona SC",
      shortName: "BSC",
      slug: "barcelona-sc",
    });

    const byName = await repository.findByNamePattern("bar", [
      barcelona._id.toString(),
      madrid._id.toString(),
    ]);
    const byShortName = await repository.findByNamePattern("rma", [
      barcelona._id.toString(),
      madrid._id.toString(),
    ]);

    expect(byName).toHaveLength(1);
    expect(byName[0]!.slug).toBe("fc-barcelona");
    expect(byShortName).toHaveLength(1);
    expect(byShortName[0]!.slug).toBe("real-madrid");
  });
});
