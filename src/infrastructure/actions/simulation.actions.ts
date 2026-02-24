"use server";

export async function simulateMatch(id: string): Promise<void> {
  console.log("=== [action] simulateMatch | id:", id, "===");
}

export async function viewSimulation(id: string): Promise<void> {
  console.log("=== [action] viewSimulation | id:", id, "===");
}

export async function writeChronicle(id: string): Promise<void> {
  console.log("=== [action] writeChronicle | id:", id, "===");
}

export async function readChronicle(id: string): Promise<void> {
  console.log("=== [action] readChronicle | id:", id, "===");
}
