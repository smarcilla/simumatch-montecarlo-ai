import { DashboardLayout } from "@/infrastructure/ui/layout/DashboardLayout";
import { getMatchesByLeagueAndSeason } from "@/infrastructure/actions/match.actions";

interface PageProps {
  readonly searchParams: Promise<{ league?: string; season?: string }>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const leagueId = searchParams.league;
  const seasonId = searchParams.season;

  // Show loading/empty state if params are missing
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

  // Fetch matches with valid params
  const matches = await getMatchesByLeagueAndSeason(leagueId, seasonId);

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
            Temporada activa 2025/2026
          </p>
        </div>

        <div className="matches-grid">
          {matches.map((match) => (
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

                {/* VS Central */}
                <div className="match-vs">
                  <span className="match-vs-text">VS</span>
                  <div className="match-vs-divider" />
                </div>

                {/* Equipo Visitante */}
                <div className="team-container away">
                  <span className="team-name">{match.away}</span>
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
                </div>
              </div>

              <div className="match-meta">
                <time>
                  {new Date(match.date).toLocaleDateString("es-ES", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </time>
                <span className="league-badge">La Liga</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
