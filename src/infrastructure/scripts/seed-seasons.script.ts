import { connectionManager } from "../db/connection-manager";
import { DIContainer } from "../di-container";
import { UpsertSeasonCommand } from "@/application/commands/upsert-season.command";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

interface SeasonRawDocument {
  _id: mongoose.Types.ObjectId;
  league_external_id: string;
  season_name: string;
  season_id: number;
}

const scriptStart = Date.now();

try {
  console.log(`Target database: ${process.env.MONGODB_NAME || "default"}`);

  await connectionManager.initialize();

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not established");
  }

  console.log("Reading seasons from seasons_raw collection...");
  const seasonsRaw = await db
    .collection<SeasonRawDocument>("seasons_raw")
    .find({})
    .toArray();

  console.log(`Found ${seasonsRaw.length} raw seasons`);

  if (seasonsRaw.length === 0) {
    console.log("No raw seasons found. Exiting...");
    process.exit(0);
  }

  const commands: UpsertSeasonCommand[] = [];
  let skipped = 0;

  for (const rawSeason of seasonsRaw) {
    if (!rawSeason.league_external_id) {
      console.warn("Season missing league_external_id, skipping");
      skipped++;
      continue;
    }

    if (!rawSeason.season_id) {
      console.warn("Season missing season_id, skipping");
      skipped++;
      continue;
    }

    commands.push({
      name: rawSeason.season_name,
      seasonYear: rawSeason.season_name,
      leagueExternalId: rawSeason.league_external_id,
      externalId: rawSeason.season_id,
    });
  }

  const useCase = await DIContainer.getUpsertSeasonsUseCase();

  console.log("Syncing seasons...");
  const syncStart = Date.now();
  await useCase.execute(commands);
  console.log(
    `Seasons synced [${Date.now() - syncStart}ms] - processed: ${commands.length}, skipped: ${skipped}`
  );

  console.log(`Script completed [${Date.now() - scriptStart}ms]`);
} catch (error) {
  console.error("Script failed:", error);
  process.exit(1);
} finally {
  await connectionManager.close();
  process.exit(0);
}
