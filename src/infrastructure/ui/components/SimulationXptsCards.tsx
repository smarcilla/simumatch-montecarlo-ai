interface SimulationXptsCardsProps {
  readonly xPtsHome: number;
  readonly xPtsAway: number;
  readonly homeTeam: string;
  readonly awayTeam: string;
  readonly homeColor: string;
  readonly awayColor: string;
  readonly homeColorSecondary: string;
  readonly awayColorSecondary: string;
}

export function SimulationXptsCards({
  xPtsHome,
  xPtsAway,
  homeTeam,
  awayTeam,
  homeColor,
  awayColor,
  homeColorSecondary,
  awayColorSecondary,
}: SimulationXptsCardsProps) {
  const formattedXPtsHome = xPtsHome.toFixed(2);
  const formattedXPtsAway = xPtsAway.toFixed(2);
  return (
    <div className="simulation-card">
      <h3 className="simulation-section-title">Puntos esperados (xPts)</h3>
      <div className="simulation-xpts-cards">
        <div
          className="simulation-xpts-card"
          style={
            {
              "--xpts-color": homeColor,
              "--xpts-secondary": homeColorSecondary,
            } as React.CSSProperties
          }
        >
          <span className="simulation-xpts-team">{homeTeam}</span>
          <span className="simulation-xpts-value">{formattedXPtsHome}</span>
        </div>
        <div
          className="simulation-xpts-card"
          style={
            {
              "--xpts-color": awayColor,
              "--xpts-secondary": awayColorSecondary,
            } as React.CSSProperties
          }
        >
          <span className="simulation-xpts-team">{awayTeam}</span>
          <span className="simulation-xpts-value">{formattedXPtsAway}</span>
        </div>
      </div>
    </div>
  );
}
