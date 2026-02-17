/**
 * Este dato lo podemos sacar de:
 * match_details_rows.homeTeam.teamColors.primary
 * match_details_rows.homeTeam.teamColors.secondary
 * match_details_rows.awayTeam.teamColors.primary
 * match_details_rows.awayTeam.teamColors.secondary
 *
 */
export class Color {
  private constructor(readonly hex: string) {
    if (!this.isValidHex(hex)) {
      throw new Error(`Invalid hex color: ${hex}`);
    }
  }

  static create(hex: string): Color {
    return new Color(hex);
  }

  private isValidHex(hex: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(hex);
  }

  equals(other: Color): boolean {
    return this.hex === other.hex;
  }
}
