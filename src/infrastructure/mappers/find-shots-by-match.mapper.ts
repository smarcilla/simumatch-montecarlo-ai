import {
  ShotType,
  ShotTypeValue,
} from "@/domain/value-objects/shot-type.value";
import {
  ShotSituation,
  ShotSituationValue,
} from "@/domain/value-objects/shot-situation.value";
import { PaginationOptions } from "@/domain/types/pagination";
import { FindShotsByMatchCommand } from "@/application/commands/find-shots-by-match.command";

function mapShotTypes(shotTypesRaw?: string): ShotTypeValue[] {
  return (
    (shotTypesRaw
      ?.split(",")
      .map((s) => s.trim())
      .filter((s) => ShotType.isShotType(s)) as ShotTypeValue[]) ?? []
  );
}

function mapShotSituations(situationsRaw?: string): ShotSituationValue[] {
  return (
    situationsRaw
      ?.split(",")
      .map((s) => s.trim())
      .filter((s): s is ShotSituationValue =>
        ShotSituation.isShotSituation(s)
      ) ?? []
  );
}

function mapIsHome(isHomeRaw?: string): boolean | undefined {
  if (isHomeRaw === undefined) {
    return undefined;
  }

  if (isHomeRaw === "true") {
    return true;
  }

  if (isHomeRaw === "false") {
    return false;
  }

  return undefined;
}

export function createFindShotsByMatchCommand(
  matchId: string,
  paginationOptions: PaginationOptions,
  shotTypesRaw?: string,
  situationsRaw?: string,
  isHomeRaw?: string,
  sortBy?: "timeSeconds" | "xg" | undefined,
  sortOrder?: "asc" | "desc" | undefined
): FindShotsByMatchCommand {
  const shotTypes = mapShotTypes(shotTypesRaw);

  const situations = mapShotSituations(situationsRaw);

  const isHome = mapIsHome(isHomeRaw);

  return {
    matchId,
    page: paginationOptions.page,
    pageSize: paginationOptions.pageSize,
    shotTypes,
    situations,
    isHome,
    sortBy,
    sortOrder,
  };
}
