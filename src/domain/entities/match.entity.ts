import { MatchDate } from "../value-objects/match-date.value";
import {
  MatchStatus,
  MatchStatusValue,
} from "../value-objects/match-status.value";
import { Score } from "../value-objects/score.value";
import { League } from "./league.entity";
import { Season } from "./season.entity";
import { Team } from "./team.entity";

export class Match {
  constructor(
    readonly id: string,
    readonly externalId: number,
    readonly league: League,
    readonly season: Season,
    readonly date: MatchDate,
    readonly score: Score,
    private status: MatchStatus,
    readonly homeTeam: Team,
    readonly awayTeam: Team
  ) {}

  canGenerateChronicle(hasSimulation: boolean): boolean {
    return (
      hasSimulation &&
      (this.status.equals(MatchStatus.create("simulated")) ||
        this.status.equals(MatchStatus.create("chronicle_generated")))
    );
  }

  canSimulate(): boolean {
    return this.status.equals(MatchStatus.create("finished"));
  }

  simulate(): void {
    if (!this.canSimulate()) {
      throw new Error("Match cannot be simulated in its current state.");
    }

    this.status = MatchStatus.create("simulated");
  }

  generateChronicle(hasSimulation: boolean) {
    if (!this.canGenerateChronicle(hasSimulation)) {
      throw new Error(
        "Match cannot have a chronicle generated in its current state."
      );
    }

    this.status = MatchStatus.create("chronicle_generated");
  }

  get statusValue(): MatchStatusValue {
    return this.status.value;
  }
}
