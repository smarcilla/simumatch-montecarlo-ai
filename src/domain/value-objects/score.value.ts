/**
 * match_details_rows.homeScore.display
 * match_details_rows.awayScore.display
 */

export class Score {
  constructor(
    readonly home: number,
    readonly away: number
  ) {
    if (home < 0 || away < 0) {
      throw new Error(`Scores cannot be negative: home=${home}, away=${away}`);
    }
  }

  equals(other: Score): boolean {
    return this.home === other.home && this.away === other.away;
  }
}
