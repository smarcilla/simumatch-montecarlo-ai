import { MatchDate } from "../value-objects/match-date.value";
import { MatchStatus } from "../value-objects/match-status.value";
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
    readonly status: MatchStatus,
    readonly homeTeam: Team,
    readonly awayTeam: Team
  ) {}

  //   equals(other: Match): boolean {
  //     return (
  //       this.identityIsSameAs(other) &&
  //       this.teamsAreSameAs(other) &&
  //       this.dateIsSameAs(other) &&
  //       this.statusIsSameAs(other) &&
  //       this.scoreIsSameAs(other)
  //     );
  //   }

  //   identityIsSameAs(other: Match): boolean {
  //     return this.id === other.id && this.externalId === other.externalId;
  //   }

  //   teamsAreSameAs(other: Match): boolean {
  //     return (
  //       this.homeTeam.equals(other.homeTeam) &&
  //       this.awayTeam.equals(other.awayTeam)
  //     );
  //   }

  //   dateIsSameAs(other: Match): boolean {
  //     return this.date.equals(other.date);
  //   }

  //   statusIsSameAs(other: Match): boolean {
  //     return this.status.equals(other.status);
  //   }

  //   scoreIsSameAs(other: Match): boolean {
  //     return this.score.equals(other.score);
  //   }
}
