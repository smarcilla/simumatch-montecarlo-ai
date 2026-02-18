import mongoose from "mongoose";

const DISCONNECTED = 0;
const CONNECTED = 1;

const connectionOptions = {
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let isConnecting = false;
let listenersRegistered = false;

const registerConnectionListeners = () => {
  if (listenersRegistered) return;
  listenersRegistered = true;

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
    isConnecting = false;
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
    isConnecting = false;
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
    isConnecting = false;
    setTimeout(() => {
      if (mongoose.connection.readyState === DISCONNECTED) {
        connectToDatabase();
      }
    }, 5000);
  });

  mongoose.connection.on("reconnected", () => {
    console.log("Reconnected to MongoDB");
  });
};

const buildMongoDBUri = (): string => {
  const baseUri = process.env.MONGODB_URI!;
  const dbName = process.env.MONGODB_NAME;

  if (!dbName) {
    return baseUri;
  }

  const url = new URL(baseUri);
  url.pathname = `/${dbName}`;

  return url.toString();
};

export const connectToDatabase = async () => {
  registerConnectionListeners();

  if (isConnecting) {
    console.log("Connection already in progress...");
    return;
  }

  if (mongoose.connection.readyState === CONNECTED) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    isConnecting = true;
    const mongoUri = buildMongoDBUri();
    const conn = await mongoose.connect(mongoUri, connectionOptions);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    isConnecting = false;

    setTimeout(connectToDatabase, 5000);
  }
};

export const disconnectFromDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== DISCONNECTED) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    throw error;
  }
};

const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Closing MongoDB connection...`);
  await disconnectFromDatabase();
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT")); // Ctrl+C
process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // Kill command
process.on("SIGUSR2", () => gracefulShutdown("SIGUSR2")); // Nodemon restart
