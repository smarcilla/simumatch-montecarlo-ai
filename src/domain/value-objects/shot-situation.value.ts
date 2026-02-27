export type ShotSituationValue =
  | "corner"
  | "assisted"
  | "penalty"
  | "set-piece"
  | "regular"
  | "free-kick"
  | "throw-in-set-piece"
  | "fast-break";

export class ShotSituation {
  private constructor(readonly value: ShotSituationValue) {}

  static create(value: string): ShotSituation {
    if (!ShotSituation.isShotSituation(value)) {
      throw new Error(`Invalid ShotSituation value: ${value}`);
    }
    return new ShotSituation(value as ShotSituationValue);
  }

  static isShotSituation(value: string): boolean {
    return new Set<ShotSituationValue>([
      "corner",
      "assisted",
      "penalty",
      "set-piece",
      "regular",
      "free-kick",
      "throw-in-set-piece",
      "fast-break",
    ]).has(value as ShotSituationValue);
  }

  equals(other: ShotSituation): boolean {
    return this.value === other.value;
  }
}
