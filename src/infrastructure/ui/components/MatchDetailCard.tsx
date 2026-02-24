import { FindMatchByIdResult } from "@/application/results/find-match-by-id.result";

const STATUS_LABELS: Record<string, string> = {
  finished: "Finalizado",
  simulated: "Simulado",
  chronicle_generated: "Crónica generada",
};

function TeamShield({
  primary,
  secondary,
}: {
  readonly primary: string;
  readonly secondary: string;
}) {
  return (
    <svg
      width="64"
      height="74"
      viewBox="0 0 40 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 2L4 8V22C4 32 11.5 40.5 20 44C28.5 40.5 36 32 36 22V8L20 2Z"
        fill={primary}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
      />
      <clipPath id={`clip-${primary.replace("#", "")}-detail`}>
        <path d="M20 2L4 8V22C4 32 11.5 40.5 20 44C28.5 40.5 36 32 36 22V8L20 2Z" />
      </clipPath>
      <rect
        x="24"
        y="0"
        width="12"
        height="46"
        fill={secondary}
        fillOpacity="0.75"
        clipPath={`url(#clip-${primary.replace("#", "")}-detail)`}
      />
    </svg>
  );
}

interface MatchDetailCardProps {
  readonly match: FindMatchByIdResult;
}

export function MatchDetailCard({ match }: MatchDetailCardProps) {
  return (
    <div
      className="match-detail-card"
      style={
        {
          "--team-home-primary": match.homeColorPrimary,
          "--team-home-secondary": match.homeColorSecondary,
          "--team-away-primary": match.awayColorPrimary,
          "--team-away-secondary": match.awayColorSecondary,
        } as React.CSSProperties
      }
    >
      <div className="match-detail-teams">
        <div className="match-detail-team home">
          <TeamShield
            primary={match.homeColorPrimary}
            secondary={match.homeColorSecondary}
          />
          <span className="match-detail-team-name">{match.home}</span>
        </div>

        <div className="match-detail-score">
          <span className="match-detail-score-number">{match.homeScore}</span>
          <span className="match-detail-score-separator">-</span>
          <span className="match-detail-score-number">{match.awayScore}</span>
        </div>

        <div className="match-detail-team away">
          <TeamShield
            primary={match.awayColorPrimary}
            secondary={match.awayColorSecondary}
          />
          <span className="match-detail-team-name">{match.away}</span>
        </div>
      </div>

      <div className="match-detail-footer">
        <span className="match-detail-date">
          {new Date(match.date).toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <span className="match-detail-status">
          {STATUS_LABELS[match.status] ?? match.status}
        </span>
      </div>
    </div>
  );
}
