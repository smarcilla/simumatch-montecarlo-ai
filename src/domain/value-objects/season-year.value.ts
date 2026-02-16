/**
 * match_details_rows.season.year (Formato es YY/YY, 25/26)
 */
export class SeasonYear {
  constructor(readonly value: string) {
    if (!this.isValidSeasonYear(value)) {
      throw new Error(`Invalid season year format: ${value}`);
    }
  }

  private isValidSeasonYear(value: string): boolean {
    return /^\d{2}\/\d{2}$/.test(value);
  }

  equals(other: SeasonYear): boolean {
    return this.value === other.value;
  }
}
