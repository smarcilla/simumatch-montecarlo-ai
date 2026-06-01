import mongoose from "mongoose";

const CONNECTED = 1;
const DISCONNECTED = 0;

type MongooseCache = {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
};

type GlobalWithMongooseCache = typeof globalThis & {
  _mongooseCache?: MongooseCache;
};

const globalWithMongooseCache = globalThis as GlobalWithMongooseCache;

globalWithMongooseCache._mongooseCache ??= { conn: null, promise: null };

const cached = globalWithMongooseCache._mongooseCache;

const buildMongoDBUri = (): string => {
  const baseUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_NAME;

  if (!baseUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (!dbName) {
    return baseUri;
  }

  const url = new URL(baseUri);
  url.pathname = `/${dbName}`;

  return url.toString();
};

const getConnectionOptions = (): mongoose.ConnectOptions => {
  const parsedMaxPoolSize = Number.parseInt(
    process.env.MONGODB_MAX_POOL_SIZE ?? "2",
    10
  );

  return {
    maxPoolSize:
      Number.isFinite(parsedMaxPoolSize) && parsedMaxPoolSize > 0
        ? parsedMaxPoolSize
        : 2,
    autoIndex: process.env.NODE_ENV !== "production",
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };
};

export const connectToDatabase = async (): Promise<mongoose.Mongoose> => {
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = buildMongoDBUri();
    const connectionOptions = getConnectionOptions();

    cached.promise = mongoose
      .connect(mongoUri, connectionOptions)
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  console.log("Established new database connection");
  return cached.conn;
};

export const disconnectFromDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== DISCONNECTED) {
    await mongoose.disconnect();
  }

  cached.conn = null;
  cached.promise = null;
};

class ConnectionManager {
  private static instance: ConnectionManager;

  private constructor() {}

  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  async initialize(): Promise<void> {
    await connectToDatabase();
  }

  async close(): Promise<void> {
    await disconnectFromDatabase();
  }

  isConnected(): boolean {
    return mongoose.connection.readyState === CONNECTED;
  }
}

export const connectionManager = ConnectionManager.getInstance();
