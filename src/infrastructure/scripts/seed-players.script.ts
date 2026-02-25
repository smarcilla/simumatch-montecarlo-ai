import { connectionManager } from "../db/connection-manager";
import { DIContainer } from "../di-container";
import { AddPlayerByShotCommand } from "@/application/commands/add-player-by-shot.command";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

interface RawPlayerData {
  id: number;
  name: string;
  slug: string;
  shortName: string;
  position: string;
  jerseyNumber: string;
}

interface RawShotDocument {
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

  console.log("Reading shots from match_shots_raw collection...");
  const readStart = Date.now();
  const rawShots = await db
    .collection<RawShotDocument>("match_shots_raw")
    .find({})
    .toArray();
  console.log(
    `Found ${rawShots.length} raw shots [${Date.now() - readStart}ms]`
  );

  if (rawShots.length === 0) {
    console.log("No raw shots found. Exiting...");
    process.exit(0);
  }

  console.log("Extracting unique players...");
  const playersMap = new Map<number, RawPlayerData>();

  for (const shot of rawShots) {
    if (shot.player?.id) {
      playersMap.set(shot.player.id, shot.player);
    }
    if (shot.goalkeeper?.id) {
      playersMap.set(shot.goalkeeper.id, shot.goalkeeper);
    }
  }

  console.log(`Extracted ${playersMap.size} unique players`);

  const commands: AddPlayerByShotCommand[] = Array.from(
    playersMap.values()
  ).map((p) => ({
    name: p.name,
    slug: p.slug,
    shortName: p.shortName,
    position: p.position,
    jerseyNumber: p.jerseyNumber,
    externalId: p.id,
  }));

  const useCase = await DIContainer.getAddPlayersByShotsUseCase();

  console.log("Syncing players...");
  const syncStart = Date.now();
  await useCase.execute(commands);
  console.log(
    `Sync completed [${(Date.now() - syncStart) / 1000}s]. Total unique players: ${playersMap.size}`
  );
} catch (error) {
  console.error("Script failed:", error);
  process.exit(1);
} finally {
  await connectionManager.close();
  console.log(`Total execution time: ${(Date.now() - scriptStart) / 1000}s`);
  process.exit(0);
}
