import { DashboardLayout } from "@/infrastructure/ui/layout/DashboardLayout";
import { getMatchesByLeagueAndSeason } from "@/infrastructure/actions/match.actions";
import { getLeagues } from "@/infrastructure/actions/league.actions";
import { Pagination } from "@/infrastructure/ui/components/Pagination";
import { MatchFiltersBar } from "@/infrastructure/ui/components/filters/MatchFiltersBar";
import { MatchCard } from "@/infrastructure/ui/components/MatchCard";

interface PageProps {
  readonly searchParams: Promise<{
    league?: string;
    season?: string;
    page?: string;
    statuses?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const leagueId = searchParams.league;
  const seasonId = searchParams.season;
  const page = searchParams.page ? Number.parseInt(searchParams.page, 10) : 0;
  const statusesRaw = searchParams.statuses;
  const dateFromRaw = searchParams.dateFrom;
  const dateToRaw = searchParams.dateTo;

  if (!leagueId || !seasonId) {
    return (
      <DashboardLayout>
        <div className="main-content">
          <div
            style={{
              marginBottom: "var(--spacing-xl)",
              padding: "var(--spacing-lg)",
              background: "var(--primary-alpha)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--primary)",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "var(--spacing-sm)" }}>
              Bienvenido a SimuMatch
            </h2>
            <p
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--text-secondary)",
              }}
            >
              Selecciona una competición para ver los partidos
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const [result, leagues] = await Promise.all([
    getMatchesByLeagueAndSeason(
      leagueId,
      seasonId,
      page,
      12,
      statusesRaw,
      dateFromRaw,
      dateToRaw
    ),
    getLeagues(),
  ]);

  const activeLeague = leagues.find((l) => l.id === leagueId);
  const activeSeason = activeLeague?.seasons.find((s) => s.id === seasonId);

  const leagueTitle = activeLeague?.name ?? "Liga";

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
          <p className="page-header-meta">{result.total} partidos</p>
        </div>

        {activeLeague && (
          <MatchFiltersBar
            activeLeague={activeLeague}
            currentSeasonId={seasonId}
          />
        )}

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
          statusesRaw={statusesRaw}
          dateFromRaw={dateFromRaw}
          dateToRaw={dateToRaw}
        />
      </div>
    </DashboardLayout>
  );
}
