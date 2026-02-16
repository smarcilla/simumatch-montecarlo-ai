type MatchStatusValue = "finished" | "simulated" | "chronicle_generated";

export class MatchStatus {
  private constructor(readonly value: MatchStatusValue) {}

  static finished() {
    return new MatchStatus("finished");
  }

  static simulated() {
    return new MatchStatus("simulated");
  }

  static chronicleGenerated() {
    return new MatchStatus("chronicle_generated");
  }

  equals(other: MatchStatus): boolean {
    return this.value === other.value;
  }
}
