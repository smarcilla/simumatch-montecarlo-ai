import { BodyPart } from "../value-objects/body-part.value";
import { ShotSituation } from "../value-objects/shot-situation.value";
import { ShotType } from "../value-objects/shot-type.value";
import { Player } from "./player.entity";

export class Shot {
  readonly xg: number;
  readonly xgot: number;

  constructor(
    readonly id: string,
    readonly externalId: number,
    xg: number,
    xgot: number,
    readonly isHome: boolean,
    readonly shotType: ShotType,
    readonly situation: ShotSituation,
    readonly bodyPart: BodyPart,
    readonly timeSeconds: number,
    readonly player: Player,
    readonly goalkeeper: Player | null,
    readonly matchId: string
  ) {
    this.xg = Number.isNaN(xg) ? 0 : xg;
    this.xgot = Number.isNaN(xgot) ? 0 : xgot;
  }

  isGoal(): boolean {
    return this.shotType.value === "goal";
  }

  isSave(): boolean {
    return this.shotType.value === "save";
  }

  isOnTarget(): boolean {
    return this.shotType.value === "goal" || this.shotType.value === "save";
  }

  isPenalty(): boolean {
    return this.situation.value === "penalty";
  }
}
