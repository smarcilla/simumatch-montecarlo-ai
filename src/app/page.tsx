// src/app/page.tsx
import { DashboardLayout } from "@/infrastructure/ui/layout/DashboardLayout";
import { getMatchesByLeagueAndSeason } from "@/infrastructure/actions/match.actions";
import { Pagination } from "@/infrastructure/ui/components/Pagination";

interface PageProps {
  readonly searchParams: Promise<{
    league?: string;
    season?: string;
    page?: string;
  }>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const leagueId = searchParams.league;
  const seasonId = searchParams.season;
  const page = searchParams.page ? Number.parseInt(searchParams.page, 10) : 0;

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

  const result = await getMatchesByLeagueAndSeason(leagueId, seasonId, page);

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
          }}
        >
          <h2 style={{ marginBottom: "var(--spacing-sm)" }}>
            Listado de Partidos
          </h2>
          <p
            style={{
              fontSize: "var(--font-size-sm)",
              color: "var(--text-secondary)",
            }}
          >
            Temporada activa 2025/2026 • {result.total} partidos
          </p>
        </div>

        <div className="matches-grid">
          {result.results.map((match) => (
            <div
              key={match.id}
              className="match-card"
              style={{
                // @ts-expect-error - CSS custom properties
                "--team-home-primary": match.homeColorPrimary,
                "--team-home-secondary": match.homeColorSecondary,
                "--team-away-primary": match.awayColorPrimary,
                "--team-away-secondary": match.awayColorSecondary,
              }}
            >
              <div className="match-teams">
                {/* Equipo Local */}
                <div className="team-container home">
                  <span className="team-name">{match.home}</span>
                  <div className="team-color-badge">
                    <div
                      className="team-color-dot"
                      style={{ backgroundColor: match.homeColorPrimary }}
                    />
                    <div
                      className="team-color-stripe"
                      style={{ backgroundColor: match.homeColorSecondary }}
                    />
                  </div>
                </div>

                {/* Score */}
                <div className="match-score">
                  <span className="score-number">{match.homeScore}</span>
                  <span className="score-separator">-</span>
                  <span className="score-number">{match.awayScore}</span>
                </div>

                {/* Equipo Visitante */}
                <div className="team-container away">
                  <div className="team-color-badge">
                    <div
                      className="team-color-dot"
                      style={{ backgroundColor: match.awayColorPrimary }}
                    />
                    <div
                      className="team-color-stripe"
                      style={{ backgroundColor: match.awayColorSecondary }}
                    />
                  </div>
                  <span className="team-name">{match.away}</span>
                </div>
              </div>

              <div className="match-date">
                {new Date(match.date).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={result.totalPages}
          leagueId={leagueId}
          seasonId={seasonId}
        />
      </div>
    </DashboardLayout>
  );
}
