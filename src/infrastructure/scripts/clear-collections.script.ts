import { connectionManager } from "../db/connection-manager";
import { DIContainer } from "../di-container";
import dotenv from "dotenv";

dotenv.config();

const scriptStart = Date.now();

try {
  console.log(`Target database: ${process.env.MONGODB_NAME || "default"}`);

  await connectionManager.initialize();

  console.log("Clearing simulations...");
  const clearSimulations = await DIContainer.getClearSimulationsUseCase();
  await clearSimulations.execute();
  console.log("Simulations cleared");

  console.log("Clearing shots...");
  const clearShots = await DIContainer.getClearShotsUseCase();
  await clearShots.execute();
  console.log("Shots cleared");

  console.log("Clearing players...");
  const clearPlayers = await DIContainer.getClearPlayersUseCase();
  await clearPlayers.execute();
  console.log("Players cleared");

  console.log("Clearing matches...");
  const clearMatches = await DIContainer.getClearMatchesUseCase();
  await clearMatches.execute();
  console.log("Matches cleared");

  console.log("Clearing teams...");
  const clearTeams = await DIContainer.getClearTeamsUseCase();
  await clearTeams.execute();
  console.log("Teams cleared");

  console.log(`All collections cleared [${Date.now() - scriptStart}ms]`);
} catch (error) {
  console.error("Script failed:", error);
  process.exit(1);
} finally {
  await connectionManager.close();
  process.exit(0);
}
