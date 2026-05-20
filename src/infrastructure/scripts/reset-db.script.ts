import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import { connectionManager } from "../db/connection-manager";
import { DIContainer } from "../di-container";
import {
  describeDerivedSyncFilters,
  hasDerivedRawData,
  hasDerivedSyncFilters,
  loadDerivedRawData,
  parseDerivedSyncFilters,
  syncDerivedCollections,
} from "./derived-sync";
import { clearFilteredDerivedCollections } from "./reset-db.helpers";

const scriptStart = Date.now();
let exitCode = 0;

try {
  const filters = parseDerivedSyncFilters(process.argv.slice(2));

  console.log(`Target database: ${process.env.MONGODB_NAME || "default"}`);
  console.log(`Reset scope: ${describeDerivedSyncFilters(filters)}`);

  if (!hasDerivedSyncFilters(filters)) {
    console.warn(
      "WARNING: Full reset — all derived collections will be cleared"
    );
  }

  await connectionManager.initialize();

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not established");
  }

  console.log("--- CLEAR PHASE ---");

  if (hasDerivedSyncFilters(filters)) {
    await clearFilteredDerivedCollections(filters);
  } else {
    console.log("Clearing chronicles...");
    await (await DIContainer.getClearChroniclesUseCase()).execute();
    console.log("Chronicles cleared");

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

    console.log("Clearing seasons...");
    await (await DIContainer.getClearSeasonsUseCase()).execute();
    console.log("Seasons cleared");
  }

  console.log("--- SEED PHASE ---");

  const rawData = await loadDerivedRawData(db, filters);

  console.log(`Raw seasons found: ${rawData.seasonsRaw.length}`);
  console.log(`Raw matches found: ${rawData.matchesRaw.length}`);
  console.log(`Raw shots found: ${rawData.shotsRaw.length}`);

  if (hasDerivedRawData(rawData)) {
    await syncDerivedCollections(rawData);
  } else {
    console.log(
      `No raw data found for ${describeDerivedSyncFilters(filters)}. Reseed skipped.`
    );
  }

  console.log(`Database reset completed [${Date.now() - scriptStart}ms]`);
} catch (error) {
  exitCode = 1;
  console.error("Script failed:", error);
} finally {
  await connectionManager.close();
  process.exit(exitCode);
}
