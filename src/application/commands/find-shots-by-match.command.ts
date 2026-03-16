import { ShotTypeValue } from "@/domain/value-objects/shot-type.value";
import { ShotSituationValue } from "@/domain/value-objects/shot-situation.value";

export interface FindShotsByMatchCommand {
  matchId: string;
  page?: number;
  pageSize?: number;
  shotTypes?: ShotTypeValue[];
  situations?: ShotSituationValue[];
  isHome?: boolean | undefined;
  sortBy?: "timeSeconds" | "xg" | undefined;
  sortOrder?: "asc" | "desc" | undefined;
}
