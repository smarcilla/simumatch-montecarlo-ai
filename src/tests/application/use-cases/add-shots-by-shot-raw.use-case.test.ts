import { AddShotsByShotRawUseCase } from "@/application/use-cases/add-shots-by-shot-raw.use-case";
import { ShotRepository } from "@/domain/repositories/shot.repository";
import { DIContainer } from "@/infrastructure/di-container";
import { buildMatchWithContext, buildPlayer } from "@/tests/helpers/builders";
import { beforeEach, describe, expect, it } from "vitest";

describe("AddShotsByShotRawUseCase", () => {
  let useCase: AddShotsByShotRawUseCase;
  let shotRepository: ShotRepository;

  beforeEach(async () => {
    useCase = await DIContainer.getAddShotsByShotRawUseCase();
    shotRepository = DIContainer.getShotRepository();
  });

  it("should persist a shot when all lookups succeed", async () => {
    await buildPlayer({ externalId: 788141 });
    await buildPlayer({ externalId: 94527 });
    await buildMatchWithContext({ match: { externalId: 14083236 } });

    await useCase.execute([
      {
        externalId: 6611223,
        xg: 0.057,
        xgot: 0,
        isHome: false,
        shotType: "miss",
        situation: "corner",
        bodyPart: "head",
        timeSeconds: 4809,
        playerExternalId: 788141,
        goalkeeperExternalId: 94527,
        matchExternalId: 14083236,
      },
    ]);

    expect(await shotRepository.findByExternalId(6611223)).not.toBeNull();
  });

  it("should skip the shot when player is not found", async () => {
    await buildMatchWithContext({ match: { externalId: 14083236 } });

    await useCase.execute([
      {
        externalId: 6611223,
        xg: 0.057,
        xgot: 0,
        isHome: false,
        shotType: "miss",
        situation: "corner",
        bodyPart: "head",
        timeSeconds: 4809,
        playerExternalId: 999999,
        goalkeeperExternalId: null,
        matchExternalId: 14083236,
      },
    ]);

    expect(await shotRepository.findByExternalId(6611223)).toBeNull();
  });

  it("should skip the shot when match is not found", async () => {
    await buildPlayer({ externalId: 788141 });

    await useCase.execute([
      {
        externalId: 6611223,
        xg: 0.057,
        xgot: 0,
        isHome: false,
        shotType: "miss",
        situation: "corner",
        bodyPart: "head",
        timeSeconds: 4809,
        playerExternalId: 788141,
        goalkeeperExternalId: null,
        matchExternalId: 99999999,
      },
    ]);

    expect(await shotRepository.findByExternalId(6611223)).toBeNull();
  });

  it("should skip the shot when shotType is invalid", async () => {
    await buildPlayer({ externalId: 788141 });
    await buildMatchWithContext({ match: { externalId: 14083236 } });

    await useCase.execute([
      {
        externalId: 6611223,
        xg: 0.057,
        xgot: 0,
        isHome: false,
        shotType: "unknown-type",
        situation: "corner",
        bodyPart: "head",
        timeSeconds: 4809,
        playerExternalId: 788141,
        goalkeeperExternalId: null,
        matchExternalId: 14083236,
      },
    ]);

    expect(await shotRepository.findByExternalId(6611223)).toBeNull();
  });

  it("should skip the shot when situation is invalid", async () => {
    await buildPlayer({ externalId: 788141 });
    await buildMatchWithContext({ match: { externalId: 14083236 } });

    await useCase.execute([
      {
        externalId: 6611223,
        xg: 0.057,
        xgot: 0,
        isHome: false,
        shotType: "miss",
        situation: "unknown-situation",
        bodyPart: "head",
        timeSeconds: 4809,
        playerExternalId: 788141,
        goalkeeperExternalId: null,
        matchExternalId: 14083236,
      },
    ]);

    expect(await shotRepository.findByExternalId(6611223)).toBeNull();
  });

  it("should skip the shot when bodyPart is invalid", async () => {
    await buildPlayer({ externalId: 788141 });
    await buildMatchWithContext({ match: { externalId: 14083236 } });

    await useCase.execute([
      {
        externalId: 6611223,
        xg: 0.057,
        xgot: 0,
        isHome: false,
        shotType: "miss",
        situation: "corner",
        bodyPart: "chest",
        timeSeconds: 4809,
        playerExternalId: 788141,
        goalkeeperExternalId: null,
        matchExternalId: 14083236,
      },
    ]);

    expect(await shotRepository.findByExternalId(6611223)).toBeNull();
  });

  it("should persist a shot without goalkeeper when goalkeeperExternalId is null", async () => {
    await buildPlayer({ externalId: 788141 });
    await buildMatchWithContext({ match: { externalId: 14083236 } });

    await useCase.execute([
      {
        externalId: 6611223,
        xg: 0.057,
        xgot: 0,
        isHome: false,
        shotType: "miss",
        situation: "corner",
        bodyPart: "head",
        timeSeconds: 4809,
        playerExternalId: 788141,
        goalkeeperExternalId: null,
        matchExternalId: 14083236,
      },
    ]);

    const shot = await shotRepository.findByExternalId(6611223);
    expect(shot).not.toBeNull();
    expect(shot!.goalkeeper).toBeNull();
  });

  it("should do nothing when commands array is empty", async () => {
    await useCase.execute([]);

    expect(await shotRepository.findByExternalId(6611223)).toBeNull();
  });

  it("should persist all shots when multiple commands share the same player and match", async () => {
    await buildPlayer({ externalId: 788141 });
    const { match } = await buildMatchWithContext({
      match: { externalId: 14083236 },
    });

    await useCase.execute([
      {
        externalId: 1,
        xg: 0.1,
        xgot: 0,
        isHome: true,
        shotType: "miss",
        situation: "corner",
        bodyPart: "head",
        timeSeconds: 10,
        playerExternalId: 788141,
        goalkeeperExternalId: null,
        matchExternalId: 14083236,
      },
      {
        externalId: 2,
        xg: 0.2,
        xgot: 0,
        isHome: true,
        shotType: "save",
        situation: "regular",
        bodyPart: "right-foot",
        timeSeconds: 20,
        playerExternalId: 788141,
        goalkeeperExternalId: null,
        matchExternalId: 14083236,
      },
      {
        externalId: 3,
        xg: 0.3,
        xgot: 0,
        isHome: true,
        shotType: "goal",
        situation: "free-kick",
        bodyPart: "left-foot",
        timeSeconds: 30,
        playerExternalId: 788141,
        goalkeeperExternalId: null,
        matchExternalId: 14083236,
      },
    ]);

    const shots = await shotRepository.findAllByMatchId(match._id.toString());
    expect(shots).toHaveLength(3);
  });

  it("should process all shots across multiple batches", async () => {
    await buildPlayer({ externalId: 788141 });
    const { match } = await buildMatchWithContext({
      match: { externalId: 14083236 },
    });

    const commands = Array.from({ length: 25 }, (_, i) => ({
      externalId: 100 + i,
      xg: 0.1,
      xgot: 0,
      isHome: true,
      shotType: "miss",
      situation: "corner",
      bodyPart: "head",
      timeSeconds: 100 + i,
      playerExternalId: 788141,
      goalkeeperExternalId: null,
      matchExternalId: 14083236,
    }));

    await useCase.execute(commands);

    const shots = await shotRepository.findAllByMatchId(match._id.toString());
    expect(shots).toHaveLength(25);
  });

  it("should persist all shots across multiple batches sharing the same player", async () => {
    await buildPlayer({ externalId: 788141 });
    const { match } = await buildMatchWithContext({
      match: { externalId: 14083236 },
    });

    const commands = Array.from({ length: 15 }, (_, i) => ({
      externalId: 200 + i,
      xg: 0.1,
      xgot: 0,
      isHome: true,
      shotType: "miss",
      situation: "corner",
      bodyPart: "head",
      timeSeconds: 200 + i,
      playerExternalId: 788141,
      goalkeeperExternalId: null,
      matchExternalId: 14083236,
    }));

    await useCase.execute(commands);

    const shots = await shotRepository.findAllByMatchId(match._id.toString());
    expect(shots).toHaveLength(15);
  });
});
