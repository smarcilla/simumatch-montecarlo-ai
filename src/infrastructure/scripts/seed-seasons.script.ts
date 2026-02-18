// src/infrastructure/scripts/sync-seasons.script.ts
import { connectionManager } from "../db/connection-manager";
import { SeasonModel } from "../db/models/season.model";
import { LeagueModel } from "../db/models/league.model";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

interface SeasonRawDocument {
  _id: mongoose.Types.ObjectId;
  league_external_id: string;
  league_id: mongoose.Types.ObjectId;
  season_name: string;
  season_id: number;
}

try {
  console.log(
    `\n🔧 Target database: ${process.env.MONGODB_NAME || "default"}\n`
  );

  await connectionManager.initialize();

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not established");
  }

  console.log("📖 Reading seasons from seasons_raw collection...");
  const seasonsRaw = await db
    .collection<SeasonRawDocument>("seasons_raw")
    .find({})
    .toArray();

  console.log(`   Found ${seasonsRaw.length} raw seasons`);

  if (seasonsRaw.length === 0) {
    console.log("\n⚠️  No raw seasons found. Exiting...");
    process.exit(0);
  }

  console.log("\n📋 Loading leagues for mapping...");
  const leagues = await LeagueModel.find({});
  const leagueMap = new Map(
    leagues.map((league) => [league.externalId, league._id])
  );
  console.log(`   Loaded ${leagues.length} leagues`);

  console.log("\n🔄 Syncing seasons...");
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const rawSeason of seasonsRaw) {
    const leagueId = leagueMap.get(rawSeason.league_external_id);

    if (!leagueId) {
      console.warn(
        `   ⚠️  League not found for externalId: ${rawSeason.league_external_id}`
      );
      skipped++;
      continue;
    }

    const league = leagues.find(
      (l) => l.externalId === rawSeason.league_external_id
    );
    const leagueName = league?.name || "Unknown";

    const seasonData = {
      name: `${leagueName} ${rawSeason.season_name}`,
      seasonYear: rawSeason.season_name,
      leagueId: leagueId,
      externalId: rawSeason.season_id.toString(),
    };

    // Buscar si ya existe por externalId
    const result = await SeasonModel.updateOne(
      { externalId: seasonData.externalId },
      { $set: seasonData },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      inserted++;
    } else if (result.modifiedCount > 0) {
      updated++;
    }
  }

  console.log("\n📊 Sync results:");
  console.log(`   ✅ Inserted: ${inserted} new seasons`);
  console.log(`   🔄 Updated: ${updated} existing seasons`);
  console.log(`   ⏭️  Skipped: ${skipped} (league not found)`);
  console.log(`   📌 Total in raw: ${seasonsRaw.length}`);

  console.log("\n✅ Sync completed successfully!");
} catch (error) {
  console.error("❌ Script failed:", error);
  process.exit(1);
} finally {
  await connectionManager.close();
  process.exit(0);
}
