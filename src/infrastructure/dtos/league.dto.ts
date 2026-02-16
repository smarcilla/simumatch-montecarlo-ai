import { SeasonDTO } from "./season.dto";

export interface LeagueDTO {
  readonly name: string;
  readonly country: string;
  readonly seasons: SeasonDTO[];
  readonly id?: string | undefined;
  readonly externalId?: string | undefined;
  readonly numericExternalId?: number | undefined;
}
