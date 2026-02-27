import { GoalkeeperShotStatsResult } from "@/application/results/shot-match-stats.result";

interface ShotGoalkeeperStatsTableProps {
  readonly goalkeeperStats: GoalkeeperShotStatsResult[];
  readonly homeTeam: string;
  readonly awayTeam: string;
}

export function ShotGoalkeeperStatsTable({
  goalkeeperStats,
  homeTeam,
  awayTeam,
}: ShotGoalkeeperStatsTableProps) {
  return (
    <div className="shot-stats-section">
      <h4 className="shot-stats-section-title">Rendimiento de porteros</h4>
      <div className="shot-stats-table-scroll">
        <table className="shot-stats-table">
          <thead>
            <tr>
              <th className="shot-stats-th">Portero</th>
              <th className="shot-stats-th">Equipo</th>
              <th
                className="shot-stats-th shot-stats-th-right"
                title="Expected Goals on Target recibidos / Goles encajados"
              >
                xGOT/Goles
              </th>
              <th className="shot-stats-th shot-stats-th-right" title="Paradas">
                Paradas
              </th>
            </tr>
          </thead>
          <tbody>
            {goalkeeperStats.map((gk) => (
              <tr key={gk.goalkeeperName} className="shot-stats-row">
                <td className="shot-stats-td">{gk.goalkeeperShortName}</td>
                <td className="shot-stats-td">
                  <span
                    className={`shots-team-badge shots-team-badge-${gk.isHome ? "home" : "away"}`}
                  >
                    {gk.isHome ? homeTeam : awayTeam}
                  </span>
                </td>
                <td className="shot-stats-td shot-stats-td-number">
                  <span>{gk.xgotFaced.toFixed(2)}</span>
                  <span className="shot-stats-td-sub">
                    {gk.goalsConceded} gol{gk.goalsConceded === 1 ? "" : "es"}
                  </span>
                </td>
                <td className="shot-stats-td shot-stats-td-number">
                  {gk.saves}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
