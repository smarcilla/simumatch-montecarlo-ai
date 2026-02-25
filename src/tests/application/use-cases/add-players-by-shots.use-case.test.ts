import { AddPlayersByShotsUseCase } from "@/application/use-cases/add-players-by-shots.use-case";
import { PlayerRepository } from "@/domain/repositories/player.repository";
import { Player } from "@/domain/entities/player.entity";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("AddPlayersByShotsUseCase", () => {
  let useCase: AddPlayersByShotsUseCase;
  let playerRepository: PlayerRepository;

  beforeEach(() => {
    playerRepository = {
      findByExternalId: vi.fn(),
      upsert: vi.fn().mockResolvedValue(undefined),
    };
    useCase = new AddPlayersByShotsUseCase(playerRepository);
  });

  it("should call upsert for each command", async () => {
    const commands = [
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
    ];

    await useCase.execute(commands);

    expect(playerRepository.upsert).toHaveBeenCalledTimes(2);
  });

  it("should upsert a Player entity with the correct externalId", async () => {
    const commands = [
      {
        name: "Jon Guridi",
        slug: "jon-guridi",
        shortName: "J. Guridi",
        position: "M",
        jerseyNumber: "18",
        externalId: 788141,
      },
    ];

    await useCase.execute(commands);

    const upsertedPlayer = (playerRepository.upsert as ReturnType<typeof vi.fn>)
      .mock.calls[0]![0] as Player;
    expect(upsertedPlayer.externalId).toBe(788141);
    expect(upsertedPlayer.name).toBe("Jon Guridi");
  });

  it("should do nothing when commands array is empty", async () => {
    await useCase.execute([]);
    expect(playerRepository.upsert).not.toHaveBeenCalled();
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

    expect(playerRepository.upsert).toHaveBeenCalledTimes(25);
  });
});
