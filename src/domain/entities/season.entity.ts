import { SeasonYear } from "../value-objects/season-year.value";

export class Season {
  constructor(
    readonly name: string,
    readonly year: SeasonYear,
    readonly id?: string,
    readonly externalId?: number
  ) {}

  equals(other: Season): boolean {
    return this.name === other.name && this.year.equals(other.year);
  }
}
