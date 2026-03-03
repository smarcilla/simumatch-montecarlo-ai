export class ScoreDistributionItem {
  private constructor(
    readonly home: number,
    readonly away: number,
    readonly count: number,
    readonly percentage: number
  ) {
    if (home < 0 || away < 0) {
      throw new Error(`Scores cannot be negative: home=${home}, away=${away}`);
    }
    if (count < 0) {
      throw new Error(`Count cannot be negative: count=${count}`);
    }
    if (percentage < 0 || percentage > 100) {
      throw new Error(
        `Percentage must be between 0 and 100: percentage=${percentage}`
      );
    }
  }

  equals(other: ScoreDistributionItem): boolean {
    return (
      this.home === other.home &&
      this.away === other.away &&
      this.count === other.count &&
      this.percentage === other.percentage
    );
  }

  static create(
    home: number,
    away: number,
    count: number,
    percentage: number
  ): ScoreDistributionItem {
    return new ScoreDistributionItem(home, away, count, percentage);
  }
}
