"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ScoreDistributionItemData } from "@/domain/entities/simulation.types";
import { TableTeamShield } from "@/infrastructure/ui/components/ShotIcons";
import { useTranslations } from "next-intl";

const ITERATIONS = 10_000;
const NEUTRAL_COLOR = "#5C6370";
const NEUTRAL_SECONDARY = "#8B92A8";

interface ScoreBarShape {
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly color?: string | undefined;
  readonly strokeColor?: string | undefined;
}

function ScoreBarShapeRenderer(props: Readonly<ScoreBarShape>) {
  return (
    <rect
      x={props.x}
      y={props.y}
      width={Math.max(0, props.width ?? 0)}
      height={props.height ?? 0}
      fill={props.color ?? NEUTRAL_COLOR}
      stroke={props.strokeColor ?? NEUTRAL_SECONDARY}
      strokeWidth={1.5}
      rx={4}
      ry={4}
    />
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: Readonly<CustomTooltipProps>) {
  if (!active || !payload || payload.length === 0) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-label">
        {label} ({value}%)
      </span>
    </div>
  );
}

interface ScoreDistributionChartProps {
  readonly scoreDistribution: ScoreDistributionItemData[];
  readonly homeTeam: string;
  readonly awayTeam: string;
  readonly homeColor: string;
  readonly awayColor: string;
  readonly homeColorSecondary: string;
  readonly awayColorSecondary: string;
}

function resolveBarColors(
  home: number,
  away: number,
  homeColor: string,
  awayColor: string,
  homeColorSecondary: string,
  awayColorSecondary: string
): { fill: string; stroke: string } {
  if (home > away) return { fill: homeColor, stroke: homeColorSecondary };
  if (away > home) return { fill: awayColor, stroke: awayColorSecondary };
  return { fill: NEUTRAL_COLOR, stroke: NEUTRAL_SECONDARY };
}

export function ScoreDistributionChart({
  scoreDistribution,
  homeTeam,
  awayTeam,
  homeColor,
  awayColor,
  homeColorSecondary,
  awayColorSecondary,
}: ScoreDistributionChartProps) {
  const t = useTranslations("simulation");
  const tCommon = useTranslations("common");
  const totalSimulations = ITERATIONS;

  const chartData = scoreDistribution.map((item) => {
    const colors = resolveBarColors(
      item.home,
      item.away,
      homeColor,
      awayColor,
      homeColorSecondary,
      awayColorSecondary
    );
    return {
      label: `${item.home}-${item.away}`,
      value: Math.round(item.percentage * 10) / 10,
      color: colors.fill,
      strokeColor: colors.stroke,
    };
  });

  const tableData = scoreDistribution.map((item) => ({
    score: `${item.home}-${item.away}`,
    count: item.count,
    percentage: (Math.round(item.percentage * 10) / 10).toFixed(1),
  }));

  return (
    <div className="simulation-card">
      <h3 className="simulation-section-title">{t("scoreDistribution")}</h3>
      <div className="simulation-score-legend">
        <span
          className="simulation-score-legend-item"
          style={
            {
              "--legend-primary": homeColor,
              "--legend-secondary": homeColorSecondary,
            } as React.CSSProperties
          }
        >
          {t("wins", { team: homeTeam })}
        </span>
        <span
          className="simulation-score-legend-item"
          style={
            {
              "--legend-primary": NEUTRAL_COLOR,
              "--legend-secondary": NEUTRAL_SECONDARY,
            } as React.CSSProperties
          }
        >
          {tCommon("draw")}
        </span>
        <span
          className="simulation-score-legend-item"
          style={
            {
              "--legend-primary": awayColor,
              "--legend-secondary": awayColorSecondary,
            } as React.CSSProperties
          }
        >
          {t("wins", { team: awayTeam })}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 16, left: 0, bottom: 48 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-default)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--text-primary)", fontSize: 12 }}
            angle={-40}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            unit="%"
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--bg-hover)" }}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            shape={ScoreBarShapeRenderer}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="simulation-table-wrapper">
        <table className="simulation-table">
          <thead>
            <tr>
              <th>{t("score")}</th>
              <th title={t("totalSimulations", { total: totalSimulations })}>
                {t("frequency")}
              </th>
              <th title={t("percentageOfSimulations")}>%</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item) => (
              <tr key={item.score}>
                <td className="score-cell-flex">
                  <TableTeamShield
                    primary={homeColor}
                    secondary={homeColorSecondary}
                    name={homeTeam}
                  />
                  <span className="score-cell-bold">{item.score}</span>
                  <TableTeamShield
                    primary={awayColor}
                    secondary={awayColorSecondary}
                    name={awayTeam}
                  />
                </td>
                <td
                  title={t("countOfSimulations", {
                    count: item.count,
                    total: totalSimulations,
                  })}
                >
                  {item.count}
                </td>
                <td title={t("percentageOfSimulations")}>{item.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
