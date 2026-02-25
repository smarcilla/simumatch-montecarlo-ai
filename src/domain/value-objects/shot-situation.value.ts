const SHOT_SITUATION_VALUES = [
  "corner",
  "assisted",
  "penalty",
  "set-piece",
  "regular",
  "free-kick",
  "throw-in-set-piece",
  "fast-break",
] as const;
export type ShotSituationValue = (typeof SHOT_SITUATION_VALUES)[number];

export class ShotSituation {
  private constructor(readonly value: ShotSituationValue) {}

  static create(value: string): ShotSituation {
    if (!(SHOT_SITUATION_VALUES as ReadonlyArray<string>).includes(value)) {
      throw new Error(`Invalid ShotSituation value: ${value}`);
    }
    return new ShotSituation(value as ShotSituationValue);
  }

  equals(other: ShotSituation): boolean {
    return this.value === other.value;
  }
}
