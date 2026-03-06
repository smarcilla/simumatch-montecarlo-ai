export interface UpsertSeasonCommand {
  name: string;
  seasonYear: string;
  leagueExternalId: string;
  externalId: number;
}

export function filterValidUpsertSeasonCommands(
  commands: UpsertSeasonCommand[],
  leagueMap: Map<string | undefined, string>
): UpsertSeasonCommand[] {
  return commands.filter((command) => {
    const leagueId = leagueMap.get(command.leagueExternalId);
    if (!leagueId) {
      console.warn(
        `League not found for externalId: ${command.leagueExternalId}, skipping season ${command.externalId}`
      );
      return false;
    }
    return true;
  });
}
