import { Suspense } from "react";
import { FindLeagueResult } from "@/application/results/find-leagues.result";
import { SeasonSelector } from "./SeasonSelector";
import { StatusFilter } from "./StatusFilter";
import { DateRangeFilter } from "./DateRangeFilter";

interface MatchFiltersBarProps {
  readonly activeLeague: FindLeagueResult;
  readonly currentSeasonId: string;
}

export function MatchFiltersBar({
  activeLeague,
  currentSeasonId,
}: MatchFiltersBarProps) {
  const currentSeason = activeLeague.seasons.find(
    (s) => s.id === currentSeasonId
  );
  const currentSeasonYear = currentSeason?.year ?? "";

  return (
    <div className="match-filters-bar">
      <Suspense fallback={null}>
        <SeasonSelector
          seasons={activeLeague.seasons}
          currentSeasonId={currentSeasonId}
        />
      </Suspense>
      <Suspense fallback={null}>
        <StatusFilter />
      </Suspense>
      <Suspense fallback={null}>
        <DateRangeFilter seasonYear={currentSeasonYear} />
      </Suspense>
    </div>
  );
}
