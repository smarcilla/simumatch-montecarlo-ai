import { connectionManager } from "../db/connection-manager";
import { DIContainer } from "../di-container";
import dotenv from "dotenv";

dotenv.config();

const scriptStart = Date.now();

try {
  console.log(`Target database: ${process.env.MONGODB_NAME || "default"}`);

  const useCase = await DIContainer.getClearSeasonsUseCase();

  console.log("Clearing seasons...");
  const clearStart = Date.now();
  await useCase.execute();
  console.log(`Seasons cleared [${Date.now() - clearStart}ms]`);

  console.log(`Script completed [${Date.now() - scriptStart}ms]`);
} catch (error) {
  console.error("Script failed:", error);
  process.exit(1);
} finally {
  await connectionManager.close();
  process.exit(0);
}
