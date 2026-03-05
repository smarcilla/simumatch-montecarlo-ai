export interface UpsertTeamCommand {
  externalId: number;
  name: string;
  slug: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
}
