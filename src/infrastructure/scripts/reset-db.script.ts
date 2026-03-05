import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import { connectionManager } from "../db/connection-manager";
import { DIContainer } from "../di-container";
import { UpsertTeamCommand } from "@/application/commands/upsert-team.command";
import { UpsertMatchCommand } from "@/application/commands/upsert-match.command";
import { AddPlayerByShotCommand } from "@/application/commands/add-player-by-shot.command";
import { AddShotByShotRawCommand } from "@/application/commands/add-shot-by-shot-raw.command";

interface TeamData {
  name: string;
  slug: string;
  shortName: string;
  id: number;
  teamColors: {
    primary: string;
    secondary: string;
  };
}

interface MatchRawDocument {
  _id: mongoose.Types.ObjectId;
  id: number;
  homeTeam: { id: number } & TeamData;
  awayTeam: { id: number } & TeamData;
  league_external_id: string;
  season_id: number;
  startTimestamp: number;
  homeScore: { display: number };
  awayScore: { display: number };
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

const scriptStart = Date.now();

try {
  console.log(`Target database: ${process.env.MONGODB_NAME || "default"}`);

  await connectionManager.initialize();

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not established");
  }

  console.log("--- CLEAR PHASE ---");

  console.log("Clearing simulations...");
  await (await DIContainer.getClearSimulationsUseCase()).execute();
  console.log("Simulations cleared");

  console.log("Clearing shots...");
  await (await DIContainer.getClearShotsUseCase()).execute();
  console.log("Shots cleared");

  console.log("Clearing players...");
  await (await DIContainer.getClearPlayersUseCase()).execute();
  console.log("Players cleared");

  console.log("Clearing matches...");
  await (await DIContainer.getClearMatchesUseCase()).execute();
  console.log("Matches cleared");

  console.log("Clearing teams...");
  await (await DIContainer.getClearTeamsUseCase()).execute();
  console.log("Teams cleared");

  console.log("--- SEED PHASE ---");

  console.log("Reading league_matches_raw collection...");
  const matchesRaw = await db
    .collection<MatchRawDocument>("league_matches_raw")
    .find({})
    .toArray();
  console.log(`Found ${matchesRaw.length} raw matches`);

  console.log("Reading match_shots_raw collection...");
  const shotsRaw = await db
    .collection<RawShotDocument>("match_shots_raw")
    .find({})
    .toArray();
  console.log(`Found ${shotsRaw.length} raw shots`);

  if (matchesRaw.length === 0 && shotsRaw.length === 0) {
    console.log("No raw data found. Exiting...");
    process.exit(0);
  }

  console.log("Seeding teams...");
  const teamsMap = new Map<number, TeamData>();
  for (const match of matchesRaw) {
    if (match.homeTeam?.id) teamsMap.set(match.homeTeam.id, match.homeTeam);
    if (match.awayTeam?.id) teamsMap.set(match.awayTeam.id, match.awayTeam);
  }
  const teamCommands: UpsertTeamCommand[] = [];
  for (const [externalId, teamData] of teamsMap) {
    if (!teamData.teamColors?.primary || !teamData.teamColors?.secondary) {
      console.warn(
        `Team missing colors: ${teamData.name} (${externalId}), skipping`
      );
      continue;
    }
    teamCommands.push({
      externalId,
      name: teamData.name,
      slug: teamData.slug,
      shortName: teamData.shortName,
      primaryColor: teamData.teamColors.primary,
      secondaryColor: teamData.teamColors.secondary,
    });
  }
  await (await DIContainer.getUpsertTeamsUseCase()).execute(teamCommands);
  console.log(`Teams seeded: ${teamCommands.length}`);

  console.log("Seeding matches...");
  const matchCommands: UpsertMatchCommand[] = [];
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
      continue;
    }
    matchCommands.push({
      externalId: rawMatch.id,
      homeTeamExternalId: rawMatch.homeTeam.id,
      awayTeamExternalId: rawMatch.awayTeam.id,
      leagueExternalId: rawMatch.league_external_id,
      seasonExternalId: rawMatch.season_id,
      date: rawMatch.startTimestamp * 1000,
      homeScore: rawMatch.homeScore.display,
      awayScore: rawMatch.awayScore.display,
      status: "finished",
    });
  }
  await (await DIContainer.getUpsertMatchesUseCase()).execute(matchCommands);
  console.log(`Matches seeded: ${matchCommands.length}`);

  console.log("Seeding players...");
  const playersMap = new Map<number, RawPlayerData>();
  for (const shot of shotsRaw) {
    if (shot.player?.id) playersMap.set(shot.player.id, shot.player);
    if (shot.goalkeeper?.id)
      playersMap.set(shot.goalkeeper.id, shot.goalkeeper);
  }
  const playerCommands: AddPlayerByShotCommand[] = Array.from(
    playersMap.values()
  ).map((p) => ({
    name: p.name,
    slug: p.slug,
    shortName: p.shortName,
    position: p.position,
    jerseyNumber: p.jerseyNumber,
    externalId: p.id,
  }));
  await (
    await DIContainer.getAddPlayersByShotsUseCase()
  ).execute(playerCommands);
  console.log(`Players seeded: ${playerCommands.length}`);

  console.log("Seeding shots...");
  const shotCommands: AddShotByShotRawCommand[] = shotsRaw
    .filter((shot) => shot.id && shot.player?.id && shot.match_id)
    .map((shot) => ({
      externalId: shot.id,
      xg: shot.xg ?? 0,
      xgot: shot.xgot ?? 0,
      isHome: shot.isHome ?? false,
      shotType: shot.shotType ?? "",
      situation: shot.situation ?? "",
      bodyPart: shot.bodyPart ?? "",
      timeSeconds: shot.timeSeconds ?? 0,
      playerExternalId: shot.player!.id,
      goalkeeperExternalId: shot.goalkeeper?.id ?? null,
      matchExternalId: shot.match_id,
    }));
  await (await DIContainer.getAddShotsByShotRawUseCase()).execute(shotCommands);
  console.log(`Shots seeded: ${shotCommands.length}`);

  console.log(`Database reset completed [${Date.now() - scriptStart}ms]`);
} catch (error) {
  console.error("Script failed:", error);
  process.exit(1);
} finally {
  await connectionManager.close();
  process.exit(0);
}
