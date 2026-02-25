const SHOT_TYPE_VALUES = ["miss", "save", "goal", "block", "post"] as const;
export type ShotTypeValue = (typeof SHOT_TYPE_VALUES)[number];

export class ShotType {
  private constructor(readonly value: ShotTypeValue) {}

  static create(value: string): ShotType {
    if (!(SHOT_TYPE_VALUES as ReadonlyArray<string>).includes(value)) {
      throw new Error(`Invalid ShotType value: ${value}`);
    }
    return new ShotType(value as ShotTypeValue);
  }

  equals(other: ShotType): boolean {
    return this.value === other.value;
  }
}
