import { ShotTypeValue } from "@/domain/value-objects/shot-type.value";
import { ShotSituationValue } from "@/domain/value-objects/shot-situation.value";
import { BodyPartValue } from "@/domain/value-objects/body-part.value";

export interface FindShotResult {
  id: string;
  xg: number;
  xgot: number;
  isHome: boolean;
  shotType: ShotTypeValue;
  situation: ShotSituationValue;
  bodyPart: BodyPartValue;
  timeSeconds: number;
  playerName: string;
  playerShortName: string;
  goalkeeperName: string | null;
}
