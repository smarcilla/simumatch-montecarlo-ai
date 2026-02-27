import { PlayerShotStatsResult } from "@/application/results/shot-match-stats.result";

interface ShotPlayerStatsTableProps {
  readonly playerStats: PlayerShotStatsResult[];
  readonly homeTeam: string;
  readonly awayTeam: string;
}

export function ShotPlayerStatsTable({
  playerStats,
  homeTeam,
  awayTeam,
}: ShotPlayerStatsTableProps) {
  return (
    <div className="shot-stats-section">
      <h4 className="shot-stats-section-title">xG por jugador</h4>
      <div className="shot-stats-table-scroll">
        <table className="shot-stats-table">
          <thead>
            <tr>
              <th className="shot-stats-th">Jugador</th>
              <th className="shot-stats-th">Equipo</th>
              <th
                className="shot-stats-th shot-stats-th-right"
                title="Disparos / Goles"
              >
                Disp./Goles
              </th>
              <th
                className="shot-stats-th shot-stats-th-right"
                title="Expected Goals / Expected Goals on Target"
              >
                xG/xGOT
              </th>
            </tr>
          </thead>
          <tbody>
            {playerStats
              .slice()
              .sort((a, b) => b.totalXg - a.totalXg)
              .map((p) => (
                <tr key={p.playerName} className="shot-stats-row">
                  <td className="shot-stats-td">{p.playerShortName}</td>
                  <td className="shot-stats-td">
                    <span
                      className={`shots-team-badge shots-team-badge-${p.isHome ? "home" : "away"}`}
                    >
                      {p.isHome ? homeTeam : awayTeam}
                    </span>
                  </td>
                  <td className="shot-stats-td shot-stats-td-number">
                    <span>{p.shots}</span>
                    <span className="shot-stats-td-sub">
                      {p.goals} gol{p.goals === 1 ? "" : "es"}
                    </span>
                  </td>
                  <td className="shot-stats-td shot-stats-td-number">
                    <span>{p.totalXg.toFixed(2)}</span>
                    <span className="shot-stats-td-sub">
                      {p.totalXgot > 0 ? p.totalXgot.toFixed(2) : "—"}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
