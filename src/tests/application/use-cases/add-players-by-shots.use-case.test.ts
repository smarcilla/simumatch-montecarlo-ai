import { AddPlayersByShotsUseCase } from "@/application/use-cases/add-players-by-shots.use-case";
import { PlayerRepository } from "@/domain/repositories/player.repository";
import { DIContainer } from "@/infrastructure/di-container";
import { beforeEach, describe, expect, it } from "vitest";

describe("AddPlayersByShotsUseCase", () => {
  let useCase: AddPlayersByShotsUseCase;
  let playerRepository: PlayerRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getAddPlayersByShotsUseCase();
    playerRepository = DIContainer.getPlayerRepository();
  });

  it("should persist all players for each command", async () => {
    await useCase.execute([
      {
        name: "Jon Guridi",
        slug: "jon-guridi",
        shortName: "J. Guridi",
        position: "M",
        jerseyNumber: "18",
        externalId: 788141,
      },
      {
        name: "Marko Dmitrovic",
        slug: "marko-dmitrovic",
        shortName: "M. Dmitrovic",
        position: "G",
        jerseyNumber: "13",
        externalId: 94527,
      },
    ]);

    expect(await playerRepository.findByExternalId(788141)).not.toBeNull();
    expect(await playerRepository.findByExternalId(94527)).not.toBeNull();
  });

  it("should persist a player with the correct fields", async () => {
    await useCase.execute([
      {
        name: "Jon Guridi",
        slug: "jon-guridi",
        shortName: "J. Guridi",
        position: "M",
        jerseyNumber: "18",
        externalId: 788141,
      },
    ]);

    const player = await playerRepository.findByExternalId(788141);
    expect(player).not.toBeNull();
    expect(player!.externalId).toBe(788141);
    expect(player!.name).toBe("Jon Guridi");
    expect(player!.slug).toBe("jon-guridi");
    expect(player!.shortName).toBe("J. Guridi");
    expect(player!.position).toBe("M");
    expect(player!.jerseyNumber).toBe("18");
  });

  it("should do nothing when commands array is empty", async () => {
    await useCase.execute([]);

    expect(await playerRepository.findByExternalId(788141)).toBeNull();
  });

  it("should process all players across multiple batches", async () => {
    const commands = Array.from({ length: 25 }, (_, i) => ({
      name: `Player ${i}`,
      slug: `player-${i}`,
      shortName: `P${i}`,
      position: "M",
      jerseyNumber: String(i),
      externalId: 100 + i,
    }));

    await useCase.execute(commands);

    expect(await playerRepository.findByExternalId(100)).not.toBeNull();
    expect(await playerRepository.findByExternalId(109)).not.toBeNull();
    expect(await playerRepository.findByExternalId(110)).not.toBeNull();
    expect(await playerRepository.findByExternalId(124)).not.toBeNull();
  });
});
