import { UpsertTeamsUseCase } from "@/application/use-cases/upsert-teams.use-case";
import { TeamRepository } from "@/domain/repositories/team.repository";
import { DIContainer } from "@/infrastructure/di-container";
import { beforeEach, describe, expect, it } from "vitest";

describe("UpsertTeamsUseCase", () => {
  let useCase: UpsertTeamsUseCase;
  let teamRepository: TeamRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getUpsertTeamsUseCase();
    teamRepository = DIContainer.getTeamRepository();
  });

  it("should insert a new team when it does not exist", async () => {
    await useCase.execute([
      {
        externalId: 1001,
        name: "FC Test",
        slug: "fc-test",
        shortName: "FCT",
        primaryColor: "#FF0000",
        secondaryColor: "#FFFFFF",
      },
    ]);

    const team = await teamRepository.findByExternalId(1001);
    expect(team).not.toBeNull();
    expect(team!.name).toBe("FC Test");
    expect(team!.slug).toBe("fc-test");
    expect(team!.shortName).toBe("FCT");
    expect(team!.primaryColor.hex).toBe("#FF0000");
    expect(team!.secondaryColor.hex).toBe("#FFFFFF");
  });

  it("should update an existing team when executed again with same externalId", async () => {
    await useCase.execute([
      {
        externalId: 2001,
        name: "Old Name",
        slug: "old-name",
        shortName: "OLD",
        primaryColor: "#000000",
        secondaryColor: "#111111",
      },
    ]);

    await useCase.execute([
      {
        externalId: 2001,
        name: "New Name",
        slug: "new-name",
        shortName: "NEW",
        primaryColor: "#222222",
        secondaryColor: "#333333",
      },
    ]);

    const team = await teamRepository.findByExternalId(2001);
    expect(team).not.toBeNull();
    expect(team!.name).toBe("New Name");
    expect(team!.primaryColor.hex).toBe("#222222");
  });

  it("should insert multiple teams from a single execute call", async () => {
    await useCase.execute([
      {
        externalId: 3001,
        name: "Team A",
        slug: "team-a",
        shortName: "TA",
        primaryColor: "#AAAAAA",
        secondaryColor: "#BBBBBB",
      },
      {
        externalId: 3002,
        name: "Team B",
        slug: "team-b",
        shortName: "TB",
        primaryColor: "#CCCCCC",
        secondaryColor: "#DDDDDD",
      },
    ]);

    expect(await teamRepository.findByExternalId(3001)).not.toBeNull();
    expect(await teamRepository.findByExternalId(3002)).not.toBeNull();
  });
});
