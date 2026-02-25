import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { connectionManager } from "../db/connection-manager";
import { DIContainer } from "../di-container";
import { AddShotByShotRawCommand } from "@/application/commands/add-shot-by-shot-raw.command";

interface RawPlayerRef {
  id: number;
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
  player?: RawPlayerRef;
  goalkeeper?: RawPlayerRef;
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

  const commands: AddShotByShotRawCommand[] = rawShots
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

  console.log(`Prepared ${commands.length} shot commands`);

  const useCase = await DIContainer.getAddShotsByShotRawUseCase();

  console.log("Syncing shots...");
  const syncStart = Date.now();
  await useCase.execute(commands);
  console.log(
    `Sync completed [${Date.now() - syncStart}ms]. Total shots processed: ${commands.length}`
  );
} catch (error) {
  console.error("Script failed:", error);
  process.exit(1);
} finally {
  await connectionManager.close();
  console.log(`Total execution time: ${Date.now() - scriptStart}ms`);
  process.exit(0);
}
