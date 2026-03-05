// src/infrastructure/scripts/seed-matches.script.ts
import { connectionManager } from "../db/connection-manager";
import { DIContainer } from "../di-container";
import { UpsertMatchCommand } from "@/application/commands/upsert-match.command";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

interface ScoreData {
  current: number;
  display: number;
  period1: number;
  period2: number;
  normaltime: number;
}

interface MatchRawDocument {
  _id: mongoose.Types.ObjectId;
  id: number;
  homeTeam: {
    id: number;
  };
  awayTeam: {
    id: number;
  };
  league_external_id: string;
  season_id: number;
  startTimestamp: number;
  homeScore: ScoreData;
  awayScore: ScoreData;
}

const scriptStart = Date.now();

try {
  console.log(`Target database: ${process.env.MONGODB_NAME || "default"}`);

  await connectionManager.initialize();

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not established");
  }

  console.log("Reading matches from league_matches_raw collection...");
  const matchesRaw = await db
    .collection<MatchRawDocument>("league_matches_raw")
    .find({})
    .toArray();

  console.log(`Found ${matchesRaw.length} raw matches`);

  if (matchesRaw.length === 0) {
    console.log("No raw matches found. Exiting...");
    process.exit(0);
  }

  const commands: UpsertMatchCommand[] = [];
  let skipped = 0;

  for (const rawMatch of matchesRaw) {
    if (!rawMatch.id) {
      console.warn("Match missing id, skipping");
      skipped++;
      continue;
    }

    if (!rawMatch.homeTeam?.id) {
      console.warn(`Match ${rawMatch.id} missing home team, skipping`);
      skipped++;
      continue;
    }

    if (!rawMatch.awayTeam?.id) {
      console.warn(`Match ${rawMatch.id} missing away team, skipping`);
      skipped++;
      continue;
    }

    if (!rawMatch.league_external_id) {
      console.warn(`Match ${rawMatch.id} missing league, skipping`);
      skipped++;
      continue;
    }

    if (!rawMatch.season_id) {
      console.warn(`Match ${rawMatch.id} missing season, skipping`);
      skipped++;
      continue;
    }

    if (
      rawMatch.homeScore?.display === undefined ||
      rawMatch.awayScore?.display === undefined
    ) {
      console.warn(`Match ${rawMatch.id} missing scores, skipping`);
      skipped++;
      continue;
    }

    commands.push({
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

  const useCase = await DIContainer.getUpsertMatchesUseCase();

  console.log("Syncing matches...");
  const syncStart = Date.now();
  await useCase.execute(commands);
  console.log(
    `Matches synced [${Date.now() - syncStart}ms] - processed: ${commands.length}, skipped: ${skipped}`
  );

  console.log(`Script completed [${Date.now() - scriptStart}ms]`);
} catch (error) {
  console.error("Script failed:", error);
  process.exit(1);
} finally {
  await connectionManager.close();
  process.exit(0);
}
