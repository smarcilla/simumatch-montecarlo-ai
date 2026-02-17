export class MatchDate {
  private constructor(readonly date: Date) {}

  static create(timestamp: number): MatchDate {
    return new MatchDate(new Date(timestamp));
  }

  //   equals(other: MatchDate): boolean {
  //     return this.date.getTime() === other.date.getTime();
  //   }
}
