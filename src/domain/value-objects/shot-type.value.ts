export type ShotTypeValue = "miss" | "save" | "goal" | "block" | "post";

export class ShotType {
  private constructor(readonly value: ShotTypeValue) {}

  static create(value: string): ShotType {
    if (!ShotType.isShotType(value)) {
      throw new Error(`Invalid ShotType value: ${value}`);
    }
    return new ShotType(value as ShotTypeValue);
  }

  equals(other: ShotType): boolean {
    return this.value === other.value;
  }

  static isShotType(value: string): boolean {
    return new Set<ShotTypeValue>([
      "miss",
      "save",
      "goal",
      "block",
      "post",
    ]).has(value as ShotTypeValue);
  }
}
