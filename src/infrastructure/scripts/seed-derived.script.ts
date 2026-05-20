import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectionManager } from "../db/connection-manager";
import {
  describeDerivedSyncFilters,
  hasDerivedRawData,
  loadDerivedRawData,
  parseDerivedSyncFilters,
  syncDerivedCollections,
} from "./derived-sync";

dotenv.config();

const scriptStart = Date.now();
let exitCode = 0;

try {
  const filters = parseDerivedSyncFilters(process.argv.slice(2));

  console.log(`Target database: ${process.env.MONGODB_NAME || "default"}`);
  console.log(`Sync scope: ${describeDerivedSyncFilters(filters)}`);

  await connectionManager.initialize();

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not established");
  }

  const rawData = await loadDerivedRawData(db, filters);

  console.log(`Raw seasons found: ${rawData.seasonsRaw.length}`);
  console.log(`Raw matches found: ${rawData.matchesRaw.length}`);
  console.log(`Raw shots found: ${rawData.shotsRaw.length}`);

  if (hasDerivedRawData(rawData)) {
    await syncDerivedCollections(rawData);
    console.log(`Seed derived completed [${Date.now() - scriptStart}ms]`);
  } else {
    console.log(
      `No raw data found for ${describeDerivedSyncFilters(filters)}. Exiting...`
    );
  }
} catch (error) {
  exitCode = 1;
  console.error("Script failed:", error);
} finally {
  await connectionManager.close();
  process.exit(exitCode);
}
