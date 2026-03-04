"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SimulationPlayerStat } from "@/domain/entities/simulation.types";

const TOOLTIP_BOX = {
  background: "#1E2633",
  border: "1px solid #2A3342",
  borderRadius: "8px",
  padding: "8px 12px",
};

interface PlayerBarShape {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  isHome?: boolean;
}

function makeBarShape(homeColor: string, awayColor: string) {
  return function PlayerBarShapeRenderer(props: PlayerBarShape) {
    return (
      <rect
        x={props.x}
        y={props.y}
        width={Math.max(0, props.width ?? 0)}
        height={props.height ?? 0}
        fill={props.isHome ? homeColor : awayColor}
        rx={4}
        ry={4}
      />
    );
  };
}

const CHART_MIN_HEIGHT = 300;
const ROW_HEIGHT = 36;

interface BarTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function BarTooltip({ active, payload, label }: Readonly<BarTooltipProps>) {
  if (!active || !payload || payload.length === 0) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div style={TOOLTIP_BOX}>
      <span style={{ color: "#E8EAED", fontWeight: 700, fontSize: "1rem" }}>
        {label} {value}%
      </span>
    </div>
  );
}

interface PlayerStatsChartProps {
  readonly playerStats: SimulationPlayerStat[];
  readonly homeTeam: string;
  readonly awayTeam: string;
  readonly homeColor: string;
  readonly awayColor: string;
}

export function PlayerStatsChart({
  playerStats,
  homeTeam,
  awayTeam,
  homeColor,
  awayColor,
}: PlayerStatsChartProps) {
  const sorted = [...playerStats].sort(
    (a, b) => b.goalProbability - a.goalProbability
  );

  const chartData = sorted.map((p) => ({
    name: p.playerShortName,
    value: Math.round(p.goalProbability * 10) / 10,
    isHome: p.isHome,
  }));

  const tableData = sorted.map((p) => ({
    playerName: p.playerShortName,
    team: p.isHome ? homeTeam : awayTeam,
    goalProbability: (Math.round(p.goalProbability * 10) / 10).toFixed(1),
    sga: p.sga.toFixed(3),
  }));

  const chartHeight = Math.max(CHART_MIN_HEIGHT, chartData.length * ROW_HEIGHT);
  const barShape = useMemo(
    () => makeBarShape(homeColor, awayColor),
    [homeColor, awayColor]
  );

  return (
    <div className="simulation-card">
      <h3 className="simulation-section-title">
        Probabilidad de gol por jugador
      </h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 40, left: 8, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2A3342"
            horizontal={false}
          />
          <XAxis
            type="number"
            unit="%"
            tick={{ fill: "#8B92A8", fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#8B92A8", fontSize: 12 }}
            width={80}
          />
          <Tooltip
            content={<BarTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} shape={barShape} />
        </BarChart>
      </ResponsiveContainer>
      <div className="simulation-table-wrapper">
        <table className="simulation-table">
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Equipo</th>
              <th>Goal Prob.</th>
              <th>SGA</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((p) => (
              <tr key={p.playerName}>
                <td>{p.playerName}</td>
                <td>{p.team}</td>
                <td>{p.goalProbability}%</td>
                <td>{p.sga}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
