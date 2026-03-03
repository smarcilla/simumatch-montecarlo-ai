import { beforeAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { connectionManager } from "@/infrastructure/db/connection-manager";
import { DIContainer } from "@/infrastructure/di-container";

beforeAll(async () => {
  await connectionManager.initialize();
});

beforeEach(async () => {
  DIContainer.reset();
  const collections = Object.values(mongoose.connection.collections);
  await Promise.all(collections.map((col) => col.deleteMany({})));
});
