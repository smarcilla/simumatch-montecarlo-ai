import { getTranslations } from "next-intl/server";
import { DashboardLayout } from "@/infrastructure/ui/layout/DashboardLayout";
import { LandingHero } from "@/infrastructure/ui/components/LandingHero";
import { getMatchesByLeagueAndSeason } from "@/infrastructure/actions/match.actions";
import { getTeamBySlug } from "@/infrastructure/actions/team.actions";
import { getLeagues } from "@/infrastructure/actions/league.actions";
import { Pagination } from "@/infrastructure/ui/components/Pagination";
import { MatchFiltersBar } from "@/infrastructure/ui/components/filters/MatchFiltersBar";
import { MatchCard } from "@/infrastructure/ui/components/MatchCard";

interface PageProps {
  readonly searchParams: Promise<{
    league?: string;
    season?: string;
    page?: string;
    team?: string;
  }>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const leagueId = searchParams.league;
  const seasonId = searchParams.season;
  const page = searchParams.page ? Number.parseInt(searchParams.page, 10) : 0;
  const teamSlug = searchParams.team;

  if (!leagueId || !seasonId) {
    return (
      <DashboardLayout>
        <div className="main-content">
          <LandingHero />
        </div>
      </DashboardLayout>
    );
  }

  const [result, leagues, currentTeam] = await Promise.all([
    getMatchesByLeagueAndSeason(leagueId, seasonId, page, 12, teamSlug),
    getLeagues(),
    teamSlug ? getTeamBySlug(teamSlug) : Promise.resolve(null),
  ]);

  const activeLeague = leagues.find((l) => l.id === leagueId);
  const activeSeason = activeLeague?.seasons.find((s) => s.id === seasonId);

  const t = await getTranslations("match");
  const leagueTitle = activeLeague?.name ?? t("defaultLeague");

  return (
    <DashboardLayout>
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-header-title">
            {leagueTitle}
            {activeSeason ? (
              <span className="page-header-season">
                {` ${activeSeason.year}`}
              </span>
            ) : null}
          </h1>
          <p className="page-header-meta">
            {result.total} {t("matches")}
          </p>
        </div>

        {activeLeague && (
          <MatchFiltersBar
            activeLeague={activeLeague}
            currentSeasonId={seasonId}
            {...(teamSlug ? { currentTeamSlug: teamSlug } : {})}
            {...(currentTeam?.name
              ? { currentTeamName: currentTeam.name }
              : {})}
          />
        )}

        {teamSlug && result.total === 0 ? (
          <div className="matches-empty-contextual">
            {t("teamNotInLeague", { team: currentTeam?.name ?? teamSlug })}
          </div>
        ) : null}

        <div className="matches-grid">
          {result.results.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={result.totalPages}
          leagueId={leagueId}
          seasonId={seasonId}
          {...(teamSlug ? { teamSlug } : {})}
        />
      </div>
    </DashboardLayout>
  );
}
