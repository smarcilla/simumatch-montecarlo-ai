import mongoose from "mongoose";
import { UpsertSeasonCommand } from "@/application/commands/upsert-season.command";
import { UpsertMatchCommand } from "@/application/commands/upsert-match.command";
import { AddPlayerByShotCommand } from "@/application/commands/add-player-by-shot.command";
import { AddShotByShotRawCommand } from "@/application/commands/add-shot-by-shot-raw.command";
import { DIContainer } from "../di-container";

type Database = NonNullable<typeof mongoose.connection.db>;

interface ScoreData {
  display: number;
}

interface SeasonRawDocument {
  league_external_id: string;
  season_name: string;
  season_id: number;
}

interface MatchRawDocument {
  id: number;
  homeTeam: { id: number };
  awayTeam: { id: number };
  league_external_id: string;
  season_id: number;
  startTimestamp: number;
  homeScore: ScoreData;
  awayScore: ScoreData;
  tournament?: { slug?: string };
  slug?: string;
}

interface RawPlayerData {
  id: number;
  name: string;
  slug: string;
  shortName: string;
  position: string;
  jerseyNumber: string;
}

interface RawShotDocument {
  id: number;
  xg: number;
  xgot: number;
  isHome: boolean;
  shotType: string;
  situation: string;
  bodyPart: string;
  timeSeconds: number;
  match_id: number;
  player?: RawPlayerData;
  goalkeeper?: RawPlayerData;
}

export interface DerivedSyncFilters {
  league?: string;
  seasons: string[];
}

export interface DerivedRawData {
  seasonsRaw: SeasonRawDocument[];
  matchesRaw: MatchRawDocument[];
  shotsRaw: RawShotDocument[];
  seasonExternalIds: number[];
  matchExternalIds: number[];
}

export interface DerivedDeletionTargets {
  seasonExternalIds: number[];
  matchExternalIds: number[];
  playerExternalIds: number[];
  shotExternalIds: number[];
}

export interface DerivedSyncSummary {
  seasonsProcessed: number;
  seasonsSkipped: number;
  matchesProcessed: number;
  matchesSkipped: number;
  playersProcessed: number;
  shotsProcessed: number;
}

function readFilterValue(
  argv: string[],
  index: number,
  option: "--league" | "--season"
): string {
  const nextValue = argv[index + 1];

  if (!nextValue || nextValue.startsWith("--")) {
    throw new Error(`Missing value for ${option}`);
  }

  return nextValue;
}

export function parseDerivedSyncFilters(argv: string[]): DerivedSyncFilters {
  let league: string | undefined;
  const seasons: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--league") {
      const value = readFilterValue(argv, index, "--league");

      if (league) {
        throw new Error("Only one --league value is supported");
      }

      league = value;
      index += 1;
      continue;
    }

    if (argument === "--season") {
      const value = readFilterValue(argv, index, "--season");
      seasons.push(value);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  if (seasons.length > 0 && !league) {
    throw new Error("--season requires --league");
  }

  if (!league) {
    return { seasons };
  }

  return {
    league,
    seasons,
  };
}

export function hasDerivedSyncFilters(filters: DerivedSyncFilters): boolean {
  return Boolean(filters.league) || filters.seasons.length > 0;
}

export function describeDerivedSyncFilters(
  filters: DerivedSyncFilters
): string {
  if (!filters.league) {
    return "all leagues and seasons";
  }

  if (filters.seasons.length === 0) {
    return `league "${filters.league}"`;
  }

  return `league "${filters.league}" and seasons ${filters.seasons
    .map((season) => `"${season}"`)
    .join(", ")}`;
}

export function hasDerivedRawData(rawData: DerivedRawData): boolean {
  return (
    rawData.seasonsRaw.length > 0 ||
    rawData.matchesRaw.length > 0 ||
    rawData.shotsRaw.length > 0
  );
}

export function buildDerivedDeletionTargets(
  rawData: DerivedRawData
): DerivedDeletionTargets {
  const playerExternalIds = uniqueNumbers(
    rawData.shotsRaw.flatMap((shot) => [shot.player?.id, shot.goalkeeper?.id])
  );
  const shotExternalIds = uniqueNumbers(
    rawData.shotsRaw.map((shot) => shot.id)
  );

  return {
    seasonExternalIds: rawData.seasonExternalIds,
    matchExternalIds: rawData.matchExternalIds,
    playerExternalIds,
    shotExternalIds,
  };
}

export async function loadDerivedRawData(
  db: Database,
  filters: DerivedSyncFilters
): Promise<DerivedRawData> {
  const seasonQuery: Record<string, unknown> = {};

  if (filters.league) {
    seasonQuery.league_external_id = filters.league;
  }

  if (filters.seasons.length > 0) {
    seasonQuery.season_name = { $in: filters.seasons };
  }

  const seasonsRaw = await db
    .collection<SeasonRawDocument>("seasons_raw")
    .find(seasonQuery)
    .toArray();

  const seasonExternalIds = uniqueNumbers(
    seasonsRaw.map((season) => season.season_id)
  );

  if (filters.league && seasonExternalIds.length === 0) {
    return {
      seasonsRaw,
      matchesRaw: [],
      shotsRaw: [],
      seasonExternalIds,
      matchExternalIds: [],
    };
  }

  const matchQuery: Record<string, unknown> = {};

  if (filters.league) {
    matchQuery.league_external_id = filters.league;
  }

  if (seasonExternalIds.length > 0 && hasDerivedSyncFilters(filters)) {
    matchQuery.season_id = { $in: seasonExternalIds };
  }

  const matchesRaw = await db
    .collection<MatchRawDocument>("league_matches_raw")
    .find(matchQuery)
    .toArray();

  const matchExternalIds = uniqueNumbers(matchesRaw.map((match) => match.id));

  if (matchExternalIds.length === 0) {
    return {
      seasonsRaw,
      matchesRaw,
      shotsRaw: [],
      seasonExternalIds,
      matchExternalIds,
    };
  }

  const shotQuery: Record<string, unknown> = hasDerivedSyncFilters(filters)
    ? { match_id: { $in: matchExternalIds } }
    : {};

  const shotsRaw = await db
    .collection<RawShotDocument>("match_shots_raw")
    .find(shotQuery)
    .toArray();

  return {
    seasonsRaw,
    matchesRaw,
    shotsRaw,
    seasonExternalIds,
    matchExternalIds,
  };
}

export async function syncDerivedCollections(
  rawData: DerivedRawData
): Promise<DerivedSyncSummary> {
  const seasonSync = buildSeasonCommands(rawData.seasonsRaw);
  console.log("Syncing seasons...");
  await (
    await DIContainer.getUpsertSeasonsUseCase()
  ).execute(seasonSync.commands);
  console.log(
    `Seasons synced: ${seasonSync.commands.length}, skipped: ${seasonSync.skipped}`
  );

  const matchSync = buildMatchCommands(rawData.matchesRaw);
  console.log("Syncing matches...");
  await (
    await DIContainer.getUpsertMatchesUseCase()
  ).execute(matchSync.commands);
  console.log(
    `Matches synced: ${matchSync.commands.length}, skipped: ${matchSync.skipped}`
  );

  const playerCommands = buildPlayerCommands(rawData.shotsRaw);
  console.log("Syncing players...");
  await (
    await DIContainer.getAddPlayersByShotsUseCase()
  ).execute(playerCommands);
  console.log(`Players synced: ${playerCommands.length}`);

  const shotCommands = buildShotCommands(rawData.shotsRaw);
  console.log("Syncing shots...");
  await (await DIContainer.getAddShotsByShotRawUseCase()).execute(shotCommands);
  console.log(`Shots synced: ${shotCommands.length}`);

  return {
    seasonsProcessed: seasonSync.commands.length,
    seasonsSkipped: seasonSync.skipped,
    matchesProcessed: matchSync.commands.length,
    matchesSkipped: matchSync.skipped,
    playersProcessed: playerCommands.length,
    shotsProcessed: shotCommands.length,
  };
}

function buildSeasonCommands(seasonsRaw: SeasonRawDocument[]): {
  commands: UpsertSeasonCommand[];
  skipped: number;
} {
  const commands: UpsertSeasonCommand[] = [];
  let skipped = 0;

  for (const rawSeason of seasonsRaw) {
    if (!rawSeason.league_external_id || !rawSeason.season_id) {
      skipped += 1;
      continue;
    }

    commands.push({
      name: rawSeason.season_name,
      seasonYear: rawSeason.season_name,
      leagueExternalId: rawSeason.league_external_id,
      externalId: rawSeason.season_id,
    });
  }

  return { commands, skipped };
}

export function buildMatchCommands(matchesRaw: MatchRawDocument[]): {
  commands: UpsertMatchCommand[];
  skipped: number;
} {
  const commands: UpsertMatchCommand[] = [];
  let skipped = 0;

  for (const rawMatch of matchesRaw) {
    if (
      !rawMatch.id ||
      !rawMatch.homeTeam?.id ||
      !rawMatch.awayTeam?.id ||
      !rawMatch.league_external_id ||
      !rawMatch.season_id ||
      rawMatch.homeScore?.display === undefined ||
      rawMatch.awayScore?.display === undefined
    ) {
      skipped += 1;
      continue;
    }

    commands.push({
      externalId: rawMatch.id,
      homeTeamExternalId: rawMatch.homeTeam.id,
      awayTeamExternalId: rawMatch.awayTeam.id,
      leagueExternalId: rawMatch.league_external_id,
      seasonExternalId: rawMatch.season_id,
      tournamentSlug: rawMatch.tournament?.slug,
      matchSlug: rawMatch.slug,
      date: rawMatch.startTimestamp * 1000,
      homeScore: rawMatch.homeScore.display,
      awayScore: rawMatch.awayScore.display,
      status: "finished",
    });
  }

  return { commands, skipped };
}

function buildPlayerCommands(
  shotsRaw: RawShotDocument[]
): AddPlayerByShotCommand[] {
  const playersMap = new Map<number, RawPlayerData>();

  for (const shot of shotsRaw) {
    if (shot.player?.id) {
      playersMap.set(shot.player.id, shot.player);
    }

    if (shot.goalkeeper?.id) {
      playersMap.set(shot.goalkeeper.id, shot.goalkeeper);
    }
  }

  return Array.from(playersMap.values()).map((player) => ({
    name: player.name,
    slug: player.slug,
    shortName: player.shortName,
    position: player.position,
    jerseyNumber: player.jerseyNumber,
    externalId: player.id,
  }));
}

function buildShotCommands(
  shotsRaw: RawShotDocument[]
): AddShotByShotRawCommand[] {
  return shotsRaw.reduce<AddShotByShotRawCommand[]>((commands, shot) => {
    if (!shot.id || !shot.player?.id || !shot.match_id) {
      return commands;
    }

    commands.push({
      externalId: shot.id,
      xg: shot.xg ?? 0,
      xgot: shot.xgot ?? 0,
      isHome: shot.isHome ?? false,
      shotType: shot.shotType ?? "",
      situation: shot.situation ?? "",
      bodyPart: shot.bodyPart ?? "",
      timeSeconds: shot.timeSeconds ?? 0,
      playerExternalId: shot.player.id,
      goalkeeperExternalId: shot.goalkeeper?.id ?? null,
      matchExternalId: shot.match_id,
    });

    return commands;
  }, []);
}

function uniqueNumbers(values: Array<number | undefined>): number[] {
  return Array.from(
    new Set(values.filter((value): value is number => Boolean(value)))
  );
}
