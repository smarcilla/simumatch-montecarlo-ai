import { Types } from "mongoose";
import {
  ILeagueDocument,
  LeagueModel,
} from "@/infrastructure/db/models/league.model";
import { SeasonModel } from "@/infrastructure/db/models/season.model";
import { TeamModel } from "@/infrastructure/db/models/team.model";
import { MatchModel } from "@/infrastructure/db/models/match.model";
import { ShotModel } from "@/infrastructure/db/models/shot.model";
import { PlayerModel } from "@/infrastructure/db/models/player.model";

let counter = 0;

const nextId = () => ++counter;

export async function buildLeague(overrides: Record<string, unknown> = {}) {
  const id = nextId();
  return LeagueModel.create({
    name: `League ${id}`,
    country: "Spain",
    externalId: `ext-${id}`,
    ...overrides,
  }) as Promise<ILeagueDocument>;
}

export async function buildSeason(
  leagueId: Types.ObjectId | string,
  overrides: Record<string, unknown> = {}
) {
  const id = nextId();
  const y1 = String(id % 100).padStart(2, "0");
  const y2 = String((id + 1) % 100).padStart(2, "0");
  return SeasonModel.create({
    name: `Season ${y1}/${y2}`,
    seasonYear: `${y1}/${y2}`,
    leagueId: new Types.ObjectId(leagueId.toString()),
    externalId: id,
    ...overrides,
  });
}

export async function buildTeam(overrides: Record<string, unknown> = {}) {
  const id = nextId();
  return TeamModel.create({
    name: `Team ${id}`,
    slug: `team-${id}`,
    shortName: `T${id}`,
    primaryColor: "#ffffff",
    secondaryColor: "#000000",
    externalId: id,
    ...overrides,
  });
}

export async function buildPlayer(overrides: Record<string, unknown> = {}) {
  const id = nextId();
  return PlayerModel.create({
    name: `Player ${id}`,
    slug: `player-${id}`,
    shortName: `P${id}`,
    position: "forward",
    jerseyNumber: `${id % 99}`,
    externalId: id,
    ...overrides,
  });
}

export async function buildMatch(
  leagueId: Types.ObjectId | string,
  seasonId: Types.ObjectId | string,
  homeTeamId: Types.ObjectId | string,
  awayTeamId: Types.ObjectId | string,
  overrides: Record<string, unknown> = {}
) {
  const id = nextId();
  return MatchModel.create({
    leagueId: new Types.ObjectId(leagueId.toString()),
    seasonId: new Types.ObjectId(seasonId.toString()),
    homeTeamId: new Types.ObjectId(homeTeamId.toString()),
    awayTeamId: new Types.ObjectId(awayTeamId.toString()),
    date: new Date(),
    status: "finished",
    homeScore: 1,
    awayScore: 0,
    externalId: id,
    ...overrides,
  });
}

export async function buildShot(
  matchId: Types.ObjectId | string,
  playerId: Types.ObjectId | string,
  overrides: Record<string, unknown> = {}
) {
  const id = nextId();
  return ShotModel.create({
    xg: 0.1,
    xgot: 0.05,
    isHome: true,
    shotType: "save",
    situation: "regular",
    bodyPart: "right-foot",
    timeSeconds: id * 30,
    externalId: id,
    playerId: new Types.ObjectId(playerId.toString()),
    matchId: new Types.ObjectId(matchId.toString()),
    ...overrides,
  });
}

export async function buildShots(
  matchId: Types.ObjectId | string,
  count: number,
  overrides: Record<string, unknown> = {}
) {
  const shots = [];
  for (let i = 0; i < count; i++) {
    const player = await buildPlayer();
    shots.push(await buildShot(matchId, player._id, overrides));
  }
  return shots;
}

export async function buildMatchWithContext(
  overrides: { match?: Record<string, unknown> } = {}
) {
  const league = await buildLeague();
  const season = await buildSeason(league._id);
  const homeTeam = await buildTeam();
  const awayTeam = await buildTeam();
  const match = await buildMatch(
    league._id,
    season._id,
    homeTeam._id,
    awayTeam._id,
    overrides.match
  );
  return { league, season, homeTeam, awayTeam, match };
}
