"use client";

import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SimulationProbabilityChartProps {
  readonly homeWinProbability: number;
  readonly drawProbability: number;
  readonly awayWinProbability: number;
  readonly homeTeam: string;
  readonly awayTeam: string;
  readonly homeColor: string;
  readonly awayColor: string;
}

const NEUTRAL_COLOR = "#5C6370";

const TOOLTIP_BOX = {
  background: "#1E2633",
  border: "1px solid #2A3342",
  borderRadius: "8px",
  padding: "8px 12px",
};

interface PieTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
}

function PieTooltip({ active, payload }: Readonly<PieTooltipProps>) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0]!;
  return (
    <div style={TOOLTIP_BOX}>
      <span style={{ color: "#E8EAED", fontWeight: 700, fontSize: "1rem" }}>
        {entry.name} {entry.value}%
      </span>
    </div>
  );
}

function LegendLabel({ value }: Readonly<{ value: string }>) {
  return (
    <span style={{ color: "#E8EAED", fontSize: "0.875rem" }}>{value}</span>
  );
}

function formatLegendLabel(value: string) {
  return <LegendLabel value={value} />;
}

export function SimulationProbabilityChart({
  homeWinProbability,
  drawProbability,
  awayWinProbability,
  homeTeam,
  awayTeam,
  homeColor,
  awayColor,
}: SimulationProbabilityChartProps) {
  const data = [
    {
      name: homeTeam,
      value: Math.round(homeWinProbability * 1000) / 10,
      fill: homeColor,
    },
    {
      name: "Empate",
      value: Math.round(drawProbability * 1000) / 10,
      fill: NEUTRAL_COLOR,
    },
    {
      name: awayTeam,
      value: Math.round(awayWinProbability * 1000) / 10,
      fill: awayColor,
    },
  ];

  return (
    <div className="simulation-card">
      <h3 className="simulation-section-title">Probabilidades del partido</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            dataKey="value"
            labelLine={false}
          />
          <Tooltip content={<PieTooltip />} />
          <Legend formatter={formatLegendLabel} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
