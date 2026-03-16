import { GoalkeeperShotStatsResult } from "@/application/results/shot-match-stats.result";
import { TableTeamShield } from "@/infrastructure/ui/components/ShotIcons";
import { getTranslations } from "next-intl/server";

interface ShotGoalkeeperStatsTableProps {
  readonly goalkeeperStats: GoalkeeperShotStatsResult[];
  readonly homeTeam: string;
  readonly awayTeam: string;
  readonly homeColor: string;
  readonly awayColor: string;
  readonly homeColorSecondary: string;
  readonly awayColorSecondary: string;
}

export async function ShotGoalkeeperStatsTable({
  goalkeeperStats,
  homeTeam,
  awayTeam,
  homeColor,
  awayColor,
  homeColorSecondary,
  awayColorSecondary,
}: ShotGoalkeeperStatsTableProps) {
  const t = await getTranslations("shots");
  const tableData = goalkeeperStats.map((gk) => ({
    goalkeeperShortName: gk.goalkeeperShortName,
    primaryColor: gk.isHome ? homeColor : awayColor,
    secondaryColor: gk.isHome ? homeColorSecondary : awayColorSecondary,
    teamName: gk.isHome ? homeTeam : awayTeam,
    xgotFaced: gk.xgotFaced.toFixed(2),
    goalsConceded: gk.goalsConceded,
    saves: gk.saves,
  }));
  return (
    <div className="shot-stats-section">
      <h4 className="shot-stats-section-title">{t("goalkeeperPerformance")}</h4>
      <div className="shot-stats-table-scroll">
        <table className="shot-stats-table">
          <thead>
            <tr>
              <th className="shot-stats-th">{t("tableHeaders.goalkeeper")}</th>
              <th className="shot-stats-th">{t("tableHeaders.team")}</th>
              <th
                className="shot-stats-th shot-stats-th-right"
                title={t("tableHeaders.xgotGoals")}
              >
                {t("tableHeaders.xgotGoalsShort")}
              </th>
              <th
                className="shot-stats-th shot-stats-th-right"
                title={t("tableHeaders.savesTitle")}
              >
                {t("tableHeaders.savesShort")}
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((gk) => (
              <tr key={gk.goalkeeperShortName} className="shot-stats-row">
                <td className="shot-stats-td">{gk.goalkeeperShortName}</td>
                <td className="shot-stats-td">
                  <TableTeamShield
                    primary={gk.primaryColor}
                    secondary={gk.secondaryColor}
                    name={gk.teamName}
                  />
                </td>
                <td className="shot-stats-td shot-stats-td-number">
                  {gk.xgotFaced} ({gk.goalsConceded})
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
