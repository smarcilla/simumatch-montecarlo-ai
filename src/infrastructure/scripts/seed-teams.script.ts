// src/infrastructure/scripts/seed-teams.script.ts
import { connectionManager } from "../db/connection-manager";
import { DIContainer } from "../di-container";
import { UpsertTeamCommand } from "@/application/commands/upsert-team.command";
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

const scriptStart = Date.now();

try {
  console.log(`Target database: ${process.env.MONGODB_NAME || "default"}`);

  await connectionManager.initialize();

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not established");
  }

  console.log("Reading teams from league_matches_raw collection...");
  const matchesRaw = await db
    .collection<MatchRawDocument>("league_matches_raw")
    .find({})
    .toArray();

  console.log(`Found ${matchesRaw.length} raw matches`);

  if (matchesRaw.length === 0) {
    console.log("No raw matches found. Exiting...");
    process.exit(0);
  }

  console.log("Extracting unique teams...");
  const teamsMap = new Map<number, TeamData>();

  for (const match of matchesRaw) {
    if (match.homeTeam?.id) {
      teamsMap.set(match.homeTeam.id, match.homeTeam);
    }
    if (match.awayTeam?.id) {
      teamsMap.set(match.awayTeam.id, match.awayTeam);
    }
  }

  console.log(`Extracted ${teamsMap.size} unique teams`);

  const commands: UpsertTeamCommand[] = [];
  let skipped = 0;

  for (const [externalId, teamData] of teamsMap) {
    if (!teamData.teamColors?.primary || !teamData.teamColors?.secondary) {
      console.warn(
        `Team missing colors: ${teamData.name} (${externalId}), skipping`
      );
      skipped++;
      continue;
    }
    commands.push({
      externalId,
      name: teamData.name,
      slug: teamData.slug,
      shortName: teamData.shortName,
      primaryColor: teamData.teamColors.primary,
      secondaryColor: teamData.teamColors.secondary,
    });
  }

  const useCase = await DIContainer.getUpsertTeamsUseCase();

  console.log("Syncing teams...");
  const syncStart = Date.now();
  await useCase.execute(commands);
  console.log(
    `Teams synced [${Date.now() - syncStart}ms] - processed: ${commands.length}, skipped: ${skipped}`
  );

  console.log(`Script completed [${Date.now() - scriptStart}ms]`);
} catch (error) {
  console.error("Script failed:", error);
  process.exit(1);
} finally {
  await connectionManager.close();
  process.exit(0);
}
