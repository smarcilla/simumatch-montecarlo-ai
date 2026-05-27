import { Suspense } from "react";
import { FindLeagueResult } from "@/application/results/find-leagues.result";
import { SeasonSelector } from "./SeasonSelector";
import { TeamSearchFilter } from "./TeamSearchFilter";

interface MatchFiltersBarProps {
  readonly activeLeague: FindLeagueResult;
  readonly currentSeasonId: string;
  readonly currentTeamSlug?: string;
  readonly currentTeamName?: string;
}

export function MatchFiltersBar({
  activeLeague,
  currentSeasonId,
  currentTeamSlug,
  currentTeamName,
}: MatchFiltersBarProps) {
  const teamSearchFilterProps = {
    ...(currentTeamSlug ? { currentTeamSlug } : {}),
    ...(currentTeamName ? { currentTeamName } : {}),
  };

  return (
    <div className="match-filters-bar">
      <Suspense fallback={null}>
        <SeasonSelector
          seasons={activeLeague.seasons}
          currentSeasonId={currentSeasonId}
        />
      </Suspense>
      <Suspense fallback={null}>
        <TeamSearchFilter {...teamSearchFilterProps} />
      </Suspense>
    </div>
  );
}
