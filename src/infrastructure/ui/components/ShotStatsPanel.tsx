import { ShotMatchStatsResult } from "@/application/results/shot-match-stats.result";
import { ShotGoalkeeperStatsTable } from "./ShotGoalkeeperStatsTable";
import { ShotPlayerStatsTable } from "./ShotPlayerStatsTable";
import { ShotXgBar } from "./ShotXgBar";

interface ShotStatsPanelProps {
  readonly stats: ShotMatchStatsResult;
  readonly homeTeam: string;
  readonly awayTeam: string;
}

export function ShotStatsPanel({
  stats,
  homeTeam,
  awayTeam,
}: ShotStatsPanelProps) {
  return (
    <div className="shot-stats-panel">
      <h3 className="shot-stats-title">Estadísticas de disparos</h3>

      <ShotXgBar
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeXg={stats.homeXg}
        awayXg={stats.awayXg}
        homeGoals={stats.homeGoals}
        awayGoals={stats.awayGoals}
      />

      {stats.playerStats.length > 0 && (
        <ShotPlayerStatsTable
          playerStats={stats.playerStats}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}

      {stats.goalkeeperStats.length > 0 && (
        <ShotGoalkeeperStatsTable
          goalkeeperStats={stats.goalkeeperStats}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}
    </div>
  );
}
