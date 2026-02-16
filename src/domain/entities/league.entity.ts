/**
 * leagues.externalId
 */

import { Season } from "./season.entity";

export class League {
  constructor(
    readonly name: string,
    readonly country: string,
    readonly seasons: Season[],
    readonly id?: string,
    readonly externalId?: string,
    readonly numericExternalId?: number
  ) {}

  equals(other: League): boolean {
    if (!this.isTheSameNameAndCountry(this, other)) return false;

    return this.areTheSameSeasons(this.seasons, other.seasons);
  }
  isTheSameNameAndCountry(league1: League, league2: League): boolean {
    return league1.name === league2.name && league1.country === league2.country;
  }

  areTheSameSeasons(seasons1: Season[], seasons2: Season[]): boolean {
    if (seasons1.length !== seasons2.length) return false;

    for (const season1 of seasons1) {
      const matchingSeason = seasons2.find((season2) =>
        season1.equals(season2)
      );
      if (!matchingSeason) return false;
    }

    return true;
  }
}
