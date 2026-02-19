import { FindMatchByLeagueAndSeasonResult } from "@/application/results/find-matches-by-league-and-season.result";

const STATUS_LABELS: Record<string, string> = {
  finished: "Finalizado",
  simulated: "Simulado",
  chronicle_generated: "Crónica generada",
};

interface TeamShieldProps {
  readonly primary: string;
  readonly secondary: string;
}

function TeamShield({ primary, secondary }: TeamShieldProps) {
  return (
    <svg
      width="40"
      height="46"
      viewBox="0 0 40 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="team-shield-svg"
      aria-hidden="true"
    >
      <path
        d="M20 2L4 8V22C4 32 11.5 40.5 20 44C28.5 40.5 36 32 36 22V8L20 2Z"
        fill={primary}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
      />
      <clipPath id={`clip-${primary.replace("#", "")}`}>
        <path d="M20 2L4 8V22C4 32 11.5 40.5 20 44C28.5 40.5 36 32 36 22V8L20 2Z" />
      </clipPath>
      <rect
        x="24"
        y="0"
        width="12"
        height="46"
        fill={secondary}
        fillOpacity="0.75"
        clipPath={`url(#clip-${primary.replace("#", "")})`}
      />
    </svg>
  );
}

interface MatchCardProps {
  readonly match: FindMatchByLeagueAndSeasonResult;
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <div
      className="match-card"
      style={
        {
          "--team-home-primary": match.homeColorPrimary,
          "--team-home-secondary": match.homeColorSecondary,
          "--team-away-primary": match.awayColorPrimary,
          "--team-away-secondary": match.awayColorSecondary,
        } as React.CSSProperties
      }
    >
      <div className="match-teams">
        <div className="team-side home">
          <TeamShield
            primary={match.homeColorPrimary}
            secondary={match.homeColorSecondary}
          />
          <span className="team-name">{match.home}</span>
        </div>

        <div className="match-score">
          <span className="score-number">{match.homeScore}</span>
          <span className="score-separator">-</span>
          <span className="score-number">{match.awayScore}</span>
        </div>

        <div className="team-side away">
          <span className="team-name">{match.away}</span>
          <TeamShield
            primary={match.awayColorPrimary}
            secondary={match.awayColorSecondary}
          />
        </div>
      </div>

      <div className="match-footer">
        <span className="match-date">
          {new Date(match.date).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span className="match-status">
          {STATUS_LABELS[match.status] ?? match.status}
        </span>
      </div>
    </div>
  );
}
