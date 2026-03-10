"use server";

import { redirect } from "next/navigation";
import { DIContainer } from "@/infrastructure/di-container";
import { SimulateMatchResult } from "@/application/results/simulate-match.result";
import { ChronicleResult } from "@/application/results/chronicle.result";
import chronicleMocks from "@/infrastructure/mocks/chronicles/index.json";

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

export async function writeChronicle(id: string): Promise<void> {
  console.log("=== [action] writeChronicle | id:", id, "===");
}

export async function getChronicleByMatchId(
  matchId: string
): Promise<ChronicleResult | null> {
  const chronicleSource = chronicleMocks as
    | ChronicleResult
    | Record<string, ChronicleResult>;

  if ("matchId" in chronicleSource) {
    const chronicle = chronicleSource as ChronicleResult;

    return chronicle.matchId === matchId || chronicle.matchId === "default"
      ? chronicle
      : null;
  }

  return chronicleSource[matchId] ?? chronicleSource.default ?? null;
}

export async function readChronicle(id: string): Promise<void> {
  redirect(`/match/${id}/chronicle`);
}
