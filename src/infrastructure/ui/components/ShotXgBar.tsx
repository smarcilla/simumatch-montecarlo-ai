import { TableTeamShield } from "@/infrastructure/ui/components/ShotIcons";
import { getTranslations } from "next-intl/server";

interface ShotXgBarProps {
  readonly homeTeam: string;
  readonly awayTeam: string;
  readonly homeXg: number;
  readonly awayXg: number;
  readonly homeGoals: number;
  readonly awayGoals: number;
  readonly homeColor: string;
  readonly awayColor: string;
  readonly homeColorSecondary: string;
  readonly awayColorSecondary: string;
}

export async function ShotXgBar({
  homeTeam,
  awayTeam,
  homeXg,
  awayXg,
  homeGoals,
  awayGoals,
  homeColor,
  awayColor,
  homeColorSecondary,
  awayColorSecondary,
}: ShotXgBarProps) {
  const t = await getTranslations("common");
  const tSim = await getTranslations("simulation");
  const homeXgFormatted = homeXg.toFixed(2);
  const awayXgFormatted = awayXg.toFixed(2);
  const homeXgRatio = homeXg > 0 ? (homeGoals / homeXg).toFixed(2) : "—";
  const awayXgRatio = awayXg > 0 ? (awayGoals / awayXg).toFixed(2) : "—";

  return (
    <div className="shot-stats-xg-bar">
      <div
        className="shot-stats-xg-team"
        style={
          {
            "--xg-team-color": homeColor,
            "--xg-team-secondary": homeColorSecondary,
          } as React.CSSProperties
        }
      >
        <div className="shot-stats-xg-team-header">
          <TableTeamShield
            primary={homeColor}
            secondary={homeColorSecondary}
            name={homeTeam}
          />
          <span className="shot-stats-xg-team-name">{homeTeam}</span>
        </div>
        <span className="shot-stats-xg-value">{homeXgFormatted} xG</span>
        <span className="shot-stats-xg-goals">
          {homeGoals} {t("goals")}
        </span>
        <span className="shot-stats-xg-ratio">
          {tSim("ratio")}: {homeXgRatio}
        </span>
      </div>
      <div className="shot-stats-xg-divider" />
      <div
        className="shot-stats-xg-team shot-stats-xg-team-away"
        style={
          {
            "--xg-team-color": awayColor,
            "--xg-team-secondary": awayColorSecondary,
          } as React.CSSProperties
        }
      >
        <div className="shot-stats-xg-team-header">
          <span className="shot-stats-xg-team-name">{awayTeam}</span>
          <TableTeamShield
            primary={awayColor}
            secondary={awayColorSecondary}
            name={awayTeam}
          />
        </div>
        <span className="shot-stats-xg-value">{awayXgFormatted} xG</span>
        <span className="shot-stats-xg-goals">
          {awayGoals} {t("goals")}
        </span>
        <span className="shot-stats-xg-ratio">
          {tSim("ratio")}: {awayXgRatio}
        </span>
      </div>
    </div>
  );
}
