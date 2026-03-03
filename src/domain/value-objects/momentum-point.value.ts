const PROBABILITY_TOLERANCE = 0.01;

export class MomentumPoint {
  private constructor(
    readonly minute: number,
    readonly homeWinProbability: number,
    readonly drawProbability: number,
    readonly awayWinProbability: number
  ) {
    const sum = homeWinProbability + drawProbability + awayWinProbability;
    if (Math.abs(sum - 1) > PROBABILITY_TOLERANCE) {
      throw new Error(`Probabilities must sum to 1, got ${sum}`);
    }
    if (minute < 0) {
      throw new Error(`Minute cannot be negative: minute=${minute}`);
    }
  }

  equals(other: MomentumPoint): boolean {
    return (
      this.minute === other.minute &&
      this.homeWinProbability === other.homeWinProbability &&
      this.drawProbability === other.drawProbability &&
      this.awayWinProbability === other.awayWinProbability
    );
  }

  static create(
    minute: number,
    homeWinProbability: number,
    drawProbability: number,
    awayWinProbability: number
  ): MomentumPoint {
    return new MomentumPoint(
      minute,
      homeWinProbability,
      drawProbability,
      awayWinProbability
    );
  }
}
