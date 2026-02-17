// src/infrastructure/db/connection-manager.ts
import { connectToDatabase, disconnectFromDatabase } from "./client";

class ConnectionManager {
  private static instance: ConnectionManager;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log("Database already initialized");
      return;
    }

    await connectToDatabase();
    this.isInitialized = true;
  }

  async close(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    await disconnectFromDatabase();
    this.isInitialized = false;
  }

  isConnected(): boolean {
    return this.isInitialized;
  }
}

export const connectionManager = ConnectionManager.getInstance();
