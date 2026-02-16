import { SeasonYear } from "../value-objects/season-year.value";

/**
 * match_details_rows.season (name, year, id) Ese id equivale a externalId.
 */
export class Season {
  constructor(
    readonly name: string,
    readonly year: SeasonYear,
    readonly id?: string,
    readonly externalId?: string
  ) {}

  equals(other: Season): boolean {
    return this.name === other.name && this.year.equals(other.year);
  }
}
