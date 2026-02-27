export type MatchStatusValue = "finished" | "simulated" | "chronicle_generated";

export class MatchStatus {
  private constructor(readonly value: MatchStatusValue) {}

  static create(value: MatchStatusValue): MatchStatus {
    if (!MatchStatus.isMatchStatus(value)) {
      throw new Error(`Invalid MatchStatus value: ${value}`);
    }

    return new MatchStatus(value);
  }

  static isMatchStatus(value: string): value is MatchStatusValue {
    return new Set(["finished", "simulated", "chronicle_generated"]).has(
      value as MatchStatusValue
    );
  }

  equals(other: MatchStatus): boolean {
    return this.value === other.value;
  }
}
