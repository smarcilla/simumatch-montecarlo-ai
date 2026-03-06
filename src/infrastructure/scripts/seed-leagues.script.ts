import { connectionManager } from "../db/connection-manager";
import { DIContainer } from "../di-container";
import { UpsertLeagueCommand } from "@/application/commands/upsert-league.command";
import dotenv from "dotenv";
import leaguesData from "./data/leagues.json";

dotenv.config();

const scriptStart = Date.now();

try {
  console.log(`Target database: ${process.env.MONGODB_NAME || "default"}`);

  const commands: UpsertLeagueCommand[] = leaguesData.map((league) => ({
    name: league.name,
    country: league.country,
    externalId: league.externalId,
    numericExternalId: league.numericExternalId,
  }));

  const useCase = await DIContainer.getUpsertLeaguesUseCase();

  console.log("Syncing leagues...");
  const syncStart = Date.now();
  await useCase.execute(commands);
  console.log(
    `Leagues synced [${Date.now() - syncStart}ms] - processed: ${commands.length}`
  );

  console.log(`Script completed [${Date.now() - scriptStart}ms]`);
} catch (error) {
  console.error("Script failed:", error);
  process.exit(1);
} finally {
  await connectionManager.close();
  process.exit(0);
}
