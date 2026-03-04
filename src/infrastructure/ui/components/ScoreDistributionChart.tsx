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

const NEUTRAL_COLOR = "#5C6370";

interface ScoreBarShape {
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly color?: string | undefined;
}

function ScoreBarShapeRenderer(props: Readonly<ScoreBarShape>) {
  return (
    <rect
      x={props.x}
      y={props.y}
      width={Math.max(0, props.width ?? 0)}
      height={props.height ?? 0}
      fill={props.color ?? NEUTRAL_COLOR}
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
    <div
      style={{
        background: "#1E2633",
        border: "1px solid #2A3342",
        borderRadius: "8px",
        padding: "8px 12px",
      }}
    >
      <span style={{ color: "#E8EAED", fontWeight: 700, fontSize: "1rem" }}>
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
}

function resolveBarColor(
  home: number,
  away: number,
  homeColor: string,
  awayColor: string
): string {
  if (home > away) return homeColor;
  if (away > home) return awayColor;
  return NEUTRAL_COLOR;
}

export function ScoreDistributionChart({
  scoreDistribution,
  homeTeam,
  awayTeam,
  homeColor,
  awayColor,
}: ScoreDistributionChartProps) {
  const chartData = scoreDistribution.map((item) => ({
    label: `${item.home}-${item.away}`,
    value: Math.round(item.percentage * 10) / 10,
    color: resolveBarColor(item.home, item.away, homeColor, awayColor),
  }));

  return (
    <div className="simulation-card">
      <h3 className="simulation-section-title">Distribución de marcadores</h3>
      <div className="simulation-score-legend">
        <span
          className="simulation-score-legend-item"
          style={{ borderColor: homeColor }}
        >
          {homeTeam} gana
        </span>
        <span
          className="simulation-score-legend-item"
          style={{ borderColor: NEUTRAL_COLOR }}
        >
          Empate
        </span>
        <span
          className="simulation-score-legend-item"
          style={{ borderColor: awayColor }}
        >
          {awayTeam} gana
        </span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 16, left: 0, bottom: 48 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2A3342"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "#E8EAED", fontSize: 12 }}
            angle={-40}
            textAnchor="end"
            interval={0}
          />
          <YAxis unit="%" tick={{ fill: "#8B92A8", fontSize: 12 }} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
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
              <th>Marcador</th>
              <th>{homeTeam}</th>
              <th>{awayTeam}</th>
              <th>Frecuencia</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {scoreDistribution.map((item) => (
              <tr key={`${item.home}-${item.away}`}>
                <td>
                  {item.home}-{item.away}
                </td>
                <td>{item.home}</td>
                <td>{item.away}</td>
                <td>{item.count}</td>
                <td>{(Math.round(item.percentage * 10) / 10).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
