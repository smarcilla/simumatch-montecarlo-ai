"use server";

import { redirect } from "next/navigation";
import { DIContainer } from "@/infrastructure/di-container";
import { SimulateMatchResult } from "@/application/results/simulate-match.result";

export async function simulateMatch(id: string): Promise<SimulateMatchResult> {
  const useCase = await DIContainer.getSimulateMatchUseCase();
  return useCase.execute(id);
}

export async function viewSimulation(id: string): Promise<void> {
  redirect(`/match/${id}/simulation`);
}

export async function getSimulationByMatchId(
  matchId: string
): Promise<SimulateMatchResult | null> {
  const useCase = await DIContainer.getFindSimulationByMatchIdUseCase();
  return useCase.execute(matchId);
}

//TODO: mover a chronicle.actions.ts
export async function writeChronicle(id: string): Promise<void> {
  console.log("=== [action] writeChronicle | id:", id, "===");
}

export async function readChronicle(id: string): Promise<void> {
  console.log("=== [action] readChronicle | id:", id, "===");
}
