// src/infrastructure/repositories/fixtures/seasons.fixture.ts
import { Season } from "@/domain/entities/season.entity";
import { SeasonYear } from "@/domain/value-objects/season-year.value";

export const SEASONS = [
  new Season("Temporada 2022/2023", new SeasonYear("22/23"), "season-22-23", 1),
  new Season("Temporada 2023/2024", new SeasonYear("23/24"), "season-23-24", 2),
  new Season("Temporada 2024/2025", new SeasonYear("24/25"), "season-24-25", 3),
  new Season("Temporada 2025/2026", new SeasonYear("25/26"), "season-25-26", 4),
];

export function getSeasons(): Season[] {
  return SEASONS;
}
