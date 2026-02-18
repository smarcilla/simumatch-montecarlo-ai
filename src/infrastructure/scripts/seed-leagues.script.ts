// src/infrastructure/scripts/seed-big5-leagues.script.ts
import { connectionManager } from "../db/connection-manager";
import { LeagueModel } from "../db/models/league.model";
import dotenv from "dotenv";

dotenv.config();

const LEAGUES = [
  {
    name: "La Liga",
    country: "Spain",
    externalId: "Spain La Liga",
    numericExternalId: 8,
  },
  {
    name: "Premier League",
    country: "England",
    externalId: "England Premier League",
    numericExternalId: 17,
  },
  {
    name: "Ligue 1",
    country: "France",
    externalId: "France Ligue 1",
    numericExternalId: 34,
  },
  {
    name: "Bundesliga",
    country: "Germany",
    externalId: "Germany Bundesliga",
    numericExternalId: 35,
  },
  {
    name: "Serie A",
    country: "Italy",
    externalId: "Italy Serie A",
    numericExternalId: 23,
  },
];

try {
  console.log(`\nTarget database: ${process.env.MONGODB_NAME || "default"}\n`);

  await connectionManager.initialize();

  console.log("Cleaning League collection...");
  const deleteResult = await LeagueModel.deleteMany({});
  console.log(`   Deleted ${deleteResult.deletedCount} existing leagues`);

  console.log("\nCreating leagues...");
  const createdLeagues = await LeagueModel.insertMany(LEAGUES);
  console.log(`   Created ${createdLeagues.length} leagues:`);
  createdLeagues.forEach((league) => {
    console.log(
      `   ✓ ${league.name} (${league.country}) - SofaScore ID: ${league.numericExternalId}`
    );
  });

  console.log("\nSeed completed successfully!");
} catch (error) {
  console.error("Script failed:", error);
  process.exit(1);
} finally {
  await connectionManager.close();
  process.exit(0);
}
