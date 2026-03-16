import type { ShotFilterOptions } from "@/domain/types/shot-filter";
import { ShotTypeValue } from "@/domain/value-objects/shot-type.value";
import { ShotSituationValue } from "@/domain/value-objects/shot-situation.value";

export function createShotFilterOptions(
  shotTypes?: ShotTypeValue[] | undefined,
  situations?: ShotSituationValue[] | undefined,
  isHome?: boolean | undefined,
  sortBy?: "timeSeconds" | "xg" | undefined,
  sortOrder?: "asc" | "desc" | undefined
): ShotFilterOptions {
  return {
    shotTypes,
    situations,
    isHome,
    sortBy,
    sortOrder,
  };
}
