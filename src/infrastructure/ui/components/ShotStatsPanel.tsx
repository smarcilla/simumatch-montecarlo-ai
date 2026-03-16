import { ShotMatchStatsResult } from "@/application/results/shot-match-stats.result";
import { ShotGoalkeeperStatsTable } from "./ShotGoalkeeperStatsTable";
import { ShotPlayerStatsTable } from "./ShotPlayerStatsTable";
import { ShotXgBar } from "./ShotXgBar";
import { getTranslations } from "next-intl/server";

interface ShotStatsPanelProps {
  readonly stats: ShotMatchStatsResult;
  readonly homeTeam: string;
  readonly awayTeam: string;
  readonly homeColor: string;
  readonly awayColor: string;
  readonly homeColorSecondary: string;
  readonly awayColorSecondary: string;
}

export async function ShotStatsPanel({
  stats,
  homeTeam,
  awayTeam,
  homeColor,
  awayColor,
  homeColorSecondary,
  awayColorSecondary,
}: ShotStatsPanelProps) {
  const t = await getTranslations("shots");
  return (
    <div className="shot-stats-panel">
      <h3 className="shot-stats-title">{t("title")}</h3>

      <ShotXgBar
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeXg={stats.homeXg}
        awayXg={stats.awayXg}
        homeGoals={stats.homeGoals}
        awayGoals={stats.awayGoals}
        homeColor={homeColor}
        awayColor={awayColor}
        homeColorSecondary={homeColorSecondary}
        awayColorSecondary={awayColorSecondary}
      />

      {stats.playerStats.length > 0 && (
        <ShotPlayerStatsTable
          playerStats={stats.playerStats}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeColor={homeColor}
          awayColor={awayColor}
          homeColorSecondary={homeColorSecondary}
          awayColorSecondary={awayColorSecondary}
        />
      )}

      {stats.goalkeeperStats.length > 0 && (
        <ShotGoalkeeperStatsTable
          goalkeeperStats={stats.goalkeeperStats}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeColor={homeColor}
          awayColor={awayColor}
          homeColorSecondary={homeColorSecondary}
          awayColorSecondary={awayColorSecondary}
        />
      )}
    </div>
  );
}
