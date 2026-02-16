import { DashboardLayout } from "@/infrastructure/ui/layout/DashboardLayout";

export default function Home() {
  const mockMatches = [
    {
      id: 1,
      home: "Real Madrid",
      away: "Barcelona",
      date: "2026-02-15",
      homeColorPrimary: "#FEBE10",
      homeColorSecondary: "#00529F",
      awayColorPrimary: "#A50044",
      awayColorSecondary: "#004D98",
    },
    {
      id: 2,
      home: "Atlético Madrid",
      away: "Sevilla",
      date: "2026-02-15",
      homeColorPrimary: "#CB3524",
      homeColorSecondary: "#1B3D6D",
      awayColorPrimary: "#F43333",
      awayColorSecondary: "#FFFFFF",
    },
    {
      id: 3,
      home: "Valencia",
      away: "Villarreal",
      date: "2026-02-16",
      homeColorPrimary: "#EE3424",
      homeColorSecondary: "#000000",
      awayColorPrimary: "#FFED02",
      awayColorSecondary: "#005187",
    },
    {
      id: 4,
      home: "Real Sociedad",
      away: "Athletic Club",
      date: "2026-02-16",
      homeColorPrimary: "#0050A5",
      homeColorSecondary: "#FFFFFF",
      awayColorPrimary: "#EE2523",
      awayColorSecondary: "#FFFFFF",
    },
    {
      id: 5,
      home: "Betis",
      away: "Celta",
      date: "2026-02-17",
      homeColorPrimary: "#00954C",
      homeColorSecondary: "#FFFFFF",
      awayColorPrimary: "#7BAFD4",
      awayColorSecondary: "#FFFFFF",
    },
    {
      id: 6,
      home: "Getafe",
      away: "Osasuna",
      date: "2026-02-17",
      homeColorPrimary: "#005999",
      homeColorSecondary: "#0E2E5E",
      awayColorPrimary: "#D81E28",
      awayColorSecondary: "#172B88",
    },
  ];

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
          {mockMatches.map((match) => (
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
