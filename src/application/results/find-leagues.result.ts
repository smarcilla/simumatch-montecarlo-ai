export interface SeasonResult {
  readonly name: string;
  readonly year: string;
  readonly id?: string | undefined;
  readonly externalId?: string | undefined;
}

export interface FindLeagueResult {
  readonly name: string;
  readonly country: string;
  readonly seasons: SeasonResult[];
  readonly id?: string | undefined;
  readonly externalId?: string | undefined;
  readonly numericExternalId?: number | undefined;
}
