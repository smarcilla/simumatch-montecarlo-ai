import { AddShotsByShotRawUseCase } from "@/application/use-cases/add-shots-by-shot-raw.use-case";
import { PlayerRepository } from "@/domain/repositories/player.repository";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { ShotRepository } from "@/domain/repositories/shot.repository";
import { Player } from "@/domain/entities/player.entity";
import { Match } from "@/domain/entities/match.entity";
import { League } from "@/domain/entities/league.entity";
import { Season } from "@/domain/entities/season.entity";
import { Team } from "@/domain/entities/team.entity";
import { Color } from "@/domain/value-objects/color.value";
import { MatchDate } from "@/domain/value-objects/match-date.value";
import { Score } from "@/domain/value-objects/score.value";
import { MatchStatus } from "@/domain/value-objects/match-status.value";
import { SeasonYear } from "@/domain/value-objects/season-year.value";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPlayer = new Player(
  "player-id-1",
  788141,
  "Jon Guridi",
  "jon-guridi",
  "J. Guridi",
  "M",
  "18"
);
const mockGoalkeeper = new Player(
  "player-id-2",
  94527,
  "Marko Dmitrovic",
  "marko-dmitrovic",
  "M. Dmitrovic",
  "G",
  "13"
);

const mockLeague = new League("La Liga", "Spain", [], "league-id-1");
const mockSeason = new Season(
  "25/26",
  new SeasonYear("25/26"),
  "season-id-1",
  77559
);
const mockHomeTeam = new Team(
  "team-id-1",
  1001,
  "Team A",
  "team-a",
  "TA",
  Color.create("#000000"),
  Color.create("#ffffff")
);
const mockAwayTeam = new Team(
  "team-id-2",
  1002,
  "Team B",
  "team-b",
  "TB",
  Color.create("#ff0000"),
  Color.create("#0000ff")
);
const mockMatch = new Match(
  "match-id-1",
  14083236,
  mockLeague,
  mockSeason,
  MatchDate.create(1700000000000),
  Score.create(1, 0),
  MatchStatus.create("finished"),
  mockHomeTeam,
  mockAwayTeam
);

const validCommand = {
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
};

describe("AddShotsByShotRawUseCase", () => {
  let useCase: AddShotsByShotRawUseCase;
  let playerRepository: PlayerRepository;
  let matchRepository: MatchRepository;
  let shotRepository: ShotRepository;

  beforeEach(() => {
    playerRepository = {
      findByExternalId: vi.fn().mockImplementation((id: number) => {
        if (id === 788141) return Promise.resolve(mockPlayer);
        if (id === 94527) return Promise.resolve(mockGoalkeeper);
        return Promise.resolve(null);
      }),
      upsert: vi.fn().mockResolvedValue(undefined),
    };
    matchRepository = {
      findByLeagueAndSeason: vi.fn(),
      findById: vi.fn(),
      findByExternalId: vi.fn().mockResolvedValue(mockMatch),
    };
    shotRepository = {
      findByExternalId: vi.fn(),
      upsert: vi.fn().mockResolvedValue(undefined),
    };
    useCase = new AddShotsByShotRawUseCase(
      playerRepository,
      matchRepository,
      shotRepository
    );
  });

  it("should upsert a shot when all lookups succeed", async () => {
    await useCase.execute([validCommand]);
    expect(shotRepository.upsert).toHaveBeenCalledTimes(1);
  });

  it("should skip the shot when player is not found", async () => {
    (
      playerRepository.findByExternalId as ReturnType<typeof vi.fn>
    ).mockResolvedValue(null);
    await useCase.execute([validCommand]);
    expect(shotRepository.upsert).not.toHaveBeenCalled();
  });

  it("should skip the shot when match is not found", async () => {
    (
      matchRepository.findByExternalId as ReturnType<typeof vi.fn>
    ).mockResolvedValue(null);
    await useCase.execute([validCommand]);
    expect(shotRepository.upsert).not.toHaveBeenCalled();
  });

  it("should skip the shot when shotType is invalid", async () => {
    await useCase.execute([{ ...validCommand, shotType: "unknown-type" }]);
    expect(shotRepository.upsert).not.toHaveBeenCalled();
  });

  it("should skip the shot when situation is invalid", async () => {
    await useCase.execute([
      { ...validCommand, situation: "unknown-situation" },
    ]);
    expect(shotRepository.upsert).not.toHaveBeenCalled();
  });

  it("should skip the shot when bodyPart is invalid", async () => {
    await useCase.execute([{ ...validCommand, bodyPart: "chest" }]);
    expect(shotRepository.upsert).not.toHaveBeenCalled();
  });

  it("should upsert without goalkeeper when goalkeeperExternalId is null", async () => {
    await useCase.execute([{ ...validCommand, goalkeeperExternalId: null }]);
    expect(shotRepository.upsert).toHaveBeenCalledTimes(1);
  });

  it("should do nothing when commands array is empty", async () => {
    await useCase.execute([]);
    expect(shotRepository.upsert).not.toHaveBeenCalled();
  });

  it("should query each unique player only once when multiple shots share the same player", async () => {
    const commands = [
      { ...validCommand, externalId: 1 },
      { ...validCommand, externalId: 2 },
      { ...validCommand, externalId: 3 },
    ];

    await useCase.execute(commands);

    expect(shotRepository.upsert).toHaveBeenCalledTimes(3);
    const playerCalls = (
      playerRepository.findByExternalId as ReturnType<typeof vi.fn>
    ).mock.calls.filter((call: unknown[]) => call[0] === 788141);
    expect(playerCalls.length).toBe(1);
  });

  it("should query each unique match only once when multiple shots share the same match", async () => {
    const commands = [
      { ...validCommand, externalId: 10 },
      { ...validCommand, externalId: 11 },
      { ...validCommand, externalId: 12 },
    ];

    await useCase.execute(commands);

    expect(shotRepository.upsert).toHaveBeenCalledTimes(3);
    const matchCalls = (
      matchRepository.findByExternalId as ReturnType<typeof vi.fn>
    ).mock.calls.filter((call: unknown[]) => call[0] === 14083236);
    expect(matchCalls.length).toBe(1);
  });

  it("should process all shots across multiple batches", async () => {
    const commands = Array.from({ length: 25 }, (_, i) => ({
      ...validCommand,
      externalId: 100 + i,
    }));

    await useCase.execute(commands);

    expect(shotRepository.upsert).toHaveBeenCalledTimes(25);
  });

  it("should reuse the cache across batches for the same player", async () => {
    const commands = Array.from({ length: 15 }, (_, i) => ({
      ...validCommand,
      externalId: 200 + i,
    }));

    await useCase.execute(commands);

    expect(shotRepository.upsert).toHaveBeenCalledTimes(15);
    const playerCalls = (
      playerRepository.findByExternalId as ReturnType<typeof vi.fn>
    ).mock.calls.filter((call: unknown[]) => call[0] === 788141);
    expect(playerCalls.length).toBe(1);
  });
});
