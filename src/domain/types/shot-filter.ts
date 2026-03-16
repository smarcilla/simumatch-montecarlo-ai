import { ShotTypeValue } from "../value-objects/shot-type.value";
import { ShotSituationValue } from "../value-objects/shot-situation.value";

export interface ShotFilterOptions {
  shotTypes?: ShotTypeValue[] | undefined;
  situations?: ShotSituationValue[] | undefined;
  isHome?: boolean | undefined;
  sortBy?: "timeSeconds" | "xg" | undefined;
  sortOrder?: "asc" | "desc" | undefined;
}
