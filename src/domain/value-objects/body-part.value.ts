const BODY_PART_VALUES = ["head", "left-foot", "right-foot", "other"] as const;
export type BodyPartValue = (typeof BODY_PART_VALUES)[number];

export class BodyPart {
  private constructor(readonly value: BodyPartValue) {}

  static create(value: string): BodyPart {
    if (!(BODY_PART_VALUES as ReadonlyArray<string>).includes(value)) {
      throw new Error(`Invalid BodyPart value: ${value}`);
    }
    return new BodyPart(value as BodyPartValue);
  }

  equals(other: BodyPart): boolean {
    return this.value === other.value;
  }
}
