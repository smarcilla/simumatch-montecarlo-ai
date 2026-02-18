// src/infrastructure/scripts/seed-matches.script.ts
import { connectionManager } from "../db/connection-manager";
import { MatchModel } from "../db/models/match.model";
import { TeamModel } from "../db/models/team.model";
import { LeagueModel } from "../db/models/league.model";
import { SeasonModel } from "../db/models/season.model";
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

try {
  console.log(
    `\n🔧 Target database: ${process.env.MONGODB_NAME || "default"}\n`
  );

  await connectionManager.initialize();

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not established");
  }

  console.log("📖 Reading matches from league_matches_raw collection...");
  const matchesRaw = await db
    .collection<MatchRawDocument>("league_matches_raw")
    .find({})
    .toArray();

  console.log(`   Found ${matchesRaw.length} raw matches`);

  if (matchesRaw.length === 0) {
    console.log("\n⚠️  No raw matches found. Exiting...");
    process.exit(0);
  }

  console.log("\n📋 Loading reference data...");

  // Load teams
  const teams = await TeamModel.find({});
  const teamMap = new Map(teams.map((team) => [team.externalId, team._id]));
  console.log(`   Loaded ${teams.length} teams`);

  // Load leagues
  const leagues = await LeagueModel.find({});
  const leagueMap = new Map(
    leagues.map((league) => [league.externalId, league._id])
  );
  console.log(`   Loaded ${leagues.length} leagues`);

  // Load seasons
  const seasons = await SeasonModel.find({});
  const seasonMap = new Map(
    seasons.map((season) => [season.externalId, season._id])
  );
  console.log(`   Loaded ${seasons.length} seasons`);

  console.log("\n🔄 Syncing matches...");
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const rawMatch of matchesRaw) {
    // Validate required data
    if (!rawMatch.id) {
      console.warn(`   ⚠️  Match missing id, skipping...`);
      skipped++;
      continue;
    }

    const homeTeamId = teamMap.get(rawMatch.homeTeam?.id);
    const awayTeamId = teamMap.get(rawMatch.awayTeam?.id);
    const leagueId = leagueMap.get(rawMatch.league_external_id);
    const seasonId = seasonMap.get(rawMatch.season_id);

    if (!homeTeamId) {
      console.warn(
        `   ⚠️  Home team not found: ${rawMatch.homeTeam?.id} (match ${rawMatch.id})`
      );
      skipped++;
      continue;
    }

    if (!awayTeamId) {
      console.warn(
        `   ⚠️  Away team not found: ${rawMatch.awayTeam?.id} (match ${rawMatch.id})`
      );
      skipped++;
      continue;
    }

    if (!leagueId) {
      console.warn(
        `   ⚠️  League not found: ${rawMatch.league_external_id} (match ${rawMatch.id})`
      );
      skipped++;
      continue;
    }

    if (!seasonId) {
      console.warn(
        `   ⚠️  Season not found: ${rawMatch.season_id} (match ${rawMatch.id})`
      );
      skipped++;
      continue;
    }

    if (
      rawMatch.homeScore?.display === undefined ||
      rawMatch.awayScore?.display === undefined
    ) {
      console.warn(
        `   ⚠️  Match missing scores, skipping... (match ${rawMatch.id})`
      );
      skipped++;
      continue;
    }

    // Convert timestamp to Date
    const date = new Date(rawMatch.startTimestamp * 1000);

    const matchData = {
      homeTeamId: homeTeamId,
      awayTeamId: awayTeamId,
      leagueId: leagueId,
      seasonId: seasonId,
      date: date,
      status: "finished" as const,
      homeScore: rawMatch.homeScore?.display,
      awayScore: rawMatch.awayScore?.display,
      externalId: rawMatch.id,
    };

    // Find by externalId and update or insert
    const result = await MatchModel.updateOne(
      { externalId: matchData.externalId },
      { $set: matchData },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      inserted++;
    } else if (result.modifiedCount > 0) {
      updated++;
    }
  }

  console.log("\n📊 Sync results:");
  console.log(`   ✅ Inserted: ${inserted} new matches`);
  console.log(`   🔄 Updated: ${updated} existing matches`);
  console.log(`   ⏭️  Skipped: ${skipped} (missing references)`);
  console.log(`   📌 Total in raw: ${matchesRaw.length}`);

  console.log("\n✅ Sync completed successfully!");
} catch (error) {
  console.error("❌ Script failed:", error);
  process.exit(1);
} finally {
  await connectionManager.close();
  process.exit(0);
}
