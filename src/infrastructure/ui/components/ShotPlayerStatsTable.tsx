import { PlayerShotStatsResult } from "@/application/results/shot-match-stats.result";
import { TableTeamShield } from "@/infrastructure/ui/components/ShotIcons";

interface ShotPlayerStatsTableProps {
  readonly playerStats: PlayerShotStatsResult[];
  readonly homeTeam: string;
  readonly awayTeam: string;
  readonly homeColor: string;
  readonly awayColor: string;
  readonly homeColorSecondary: string;
  readonly awayColorSecondary: string;
}

export function ShotPlayerStatsTable({
  playerStats,
  homeTeam,
  awayTeam,
  homeColor,
  awayColor,
  homeColorSecondary,
  awayColorSecondary,
}: ShotPlayerStatsTableProps) {
  const tableData = playerStats
    .slice()
    .sort((a, b) => b.totalXg - a.totalXg)
    .map((p) => ({
      playerShortName: p.playerShortName,
      primaryColor: p.isHome ? homeColor : awayColor,
      secondaryColor: p.isHome ? homeColorSecondary : awayColorSecondary,
      teamName: p.isHome ? homeTeam : awayTeam,
      shots: p.shots,
      goals: p.goals,
      totalXg: p.totalXg.toFixed(2),
      totalXgot: p.totalXgot > 0 ? p.totalXgot.toFixed(2) : "—",
    }));

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
            {tableData.map((p) => (
              <tr key={p.playerShortName} className="shot-stats-row">
                <td className="shot-stats-td">{p.playerShortName}</td>
                <td className="shot-stats-td">
                  <TableTeamShield
                    primary={p.primaryColor}
                    secondary={p.secondaryColor}
                    name={p.teamName}
                  />
                </td>
                <td className="shot-stats-td shot-stats-td-number">
                  {p.shots} ({p.goals})
                </td>
                <td className="shot-stats-td shot-stats-td-number">
                  {p.totalXg} ({p.totalXgot})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
