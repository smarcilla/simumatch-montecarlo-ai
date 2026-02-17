export type MatchStatusValue = "finished" | "simulated" | "chronicle_generated";

export class MatchStatus {
  private constructor(readonly value: MatchStatusValue) {}

  static create(value: MatchStatusValue): MatchStatus {
    return new MatchStatus(value);
  }

  equals(other: MatchStatus): boolean {
    return this.value === other.value;
  }
}
