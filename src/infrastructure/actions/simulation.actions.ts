"use server";

import { DIContainer } from "@/infrastructure/di-container";
import { SimulateMatchResult } from "@/application/results/simulate-match.result";
import { ChronicleResult } from "@/application/results/chronicle.result";

export async function simulateMatch(
  id: string
): Promise<SimulateMatchResult | null> {
  const useCase = await DIContainer.getSimulateMatchUseCase();
  return useCase.execute(id);
}

export async function getSimulationByMatchId(
  matchId: string
): Promise<SimulateMatchResult | null> {
  const useCase = await DIContainer.getFindSimulationByMatchIdUseCase();
  return useCase.execute(matchId);
}

export async function writeChronicle(id: string): Promise<void> {
  const useCase = await DIContainer.getGenerateChronicleUseCase();
  await useCase.execute(id);
}

export async function getChronicleByMatchId(
  matchId: string
): Promise<ChronicleResult | null> {
  const useCase = await DIContainer.getFindChronicleByMatchIdUseCase();
  return useCase.execute(matchId);
}
