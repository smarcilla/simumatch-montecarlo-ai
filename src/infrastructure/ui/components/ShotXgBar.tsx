interface ShotXgBarProps {
  readonly homeTeam: string;
  readonly awayTeam: string;
  readonly homeXg: number;
  readonly awayXg: number;
  readonly homeGoals: number;
  readonly awayGoals: number;
}

export function ShotXgBar({
  homeTeam,
  awayTeam,
  homeXg,
  awayXg,
  homeGoals,
  awayGoals,
}: ShotXgBarProps) {
  const homeXgRatio = homeXg > 0 ? (homeGoals / homeXg).toFixed(2) : "—";
  const awayXgRatio = awayXg > 0 ? (awayGoals / awayXg).toFixed(2) : "—";

  return (
    <div className="shot-stats-xg-bar">
      <div className="shot-stats-xg-team">
        <span className="shot-stats-xg-team-name">{homeTeam}</span>
        <span className="shot-stats-xg-value">{homeXg.toFixed(2)} xG</span>
        <span className="shot-stats-xg-goals">{homeGoals} goles</span>
        <span className="shot-stats-xg-ratio">Ratio: {homeXgRatio}</span>
      </div>
      <div className="shot-stats-xg-divider" />
      <div className="shot-stats-xg-team shot-stats-xg-team-away">
        <span className="shot-stats-xg-team-name">{awayTeam}</span>
        <span className="shot-stats-xg-value">{awayXg.toFixed(2)} xG</span>
        <span className="shot-stats-xg-goals">{awayGoals} goles</span>
        <span className="shot-stats-xg-ratio">Ratio: {awayXgRatio}</span>
      </div>
    </div>
  );
}
