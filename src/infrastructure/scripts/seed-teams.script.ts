// src/infrastructure/scripts/seed-teams.script.ts
import { connectionManager } from "../db/connection-manager";
import { TeamModel } from "../db/models/team.model";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

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
  homeTeam: TeamData;
  awayTeam: TeamData;
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

  console.log("📖 Reading teams from league_matches_raw collection...");
  const matchesRaw = await db
    .collection<MatchRawDocument>("league_matches_raw")
    .find({})
    .toArray();

  console.log(`   Found ${matchesRaw.length} raw matches`);

  if (matchesRaw.length === 0) {
    console.log("\n⚠️  No raw matches found. Exiting...");
    process.exit(0);
  }

  console.log("\n🔄 Extracting unique teams...");

  // Map to store unique teams by externalId
  const teamsMap = new Map<number, TeamData>();

  for (const match of matchesRaw) {
    if (match.homeTeam?.id) {
      teamsMap.set(match.homeTeam.id, match.homeTeam);
    }
    if (match.awayTeam?.id) {
      teamsMap.set(match.awayTeam.id, match.awayTeam);
    }
  }

  console.log(`   Extracted ${teamsMap.size} unique teams`);

  console.log("\n🔄 Syncing teams...");
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const [externalId, teamData] of teamsMap) {
    if (!teamData.teamColors?.primary || !teamData.teamColors?.secondary) {
      console.warn(
        `   ⚠️  Team missing colors: ${teamData.name} (${externalId})`
      );
      skipped++;
      continue;
    }

    const teamDocument = {
      name: teamData.name,
      slug: teamData.slug,
      shortName: teamData.shortName,
      primaryColor: teamData.teamColors.primary,
      secondaryColor: teamData.teamColors.secondary,
      externalId: externalId,
    };

    // Find by externalId and update or insert
    const result = await TeamModel.updateOne(
      { externalId: teamDocument.externalId },
      { $set: teamDocument },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      inserted++;
    } else if (result.modifiedCount > 0) {
      updated++;
    }
  }

  console.log("\n📊 Sync results:");
  console.log(`   ✅ Inserted: ${inserted} new teams`);
  console.log(`   🔄 Updated: ${updated} existing teams`);
  console.log(`   ⏭️  Skipped: ${skipped} (missing colors)`);
  console.log(`   📌 Total unique teams: ${teamsMap.size}`);

  console.log("\n✅ Sync completed successfully!");
} catch (error) {
  console.error("❌ Script failed:", error);
  process.exit(1);
} finally {
  await connectionManager.close();
  process.exit(0);
}
