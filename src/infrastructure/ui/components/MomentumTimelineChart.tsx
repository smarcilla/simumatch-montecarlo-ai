"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MomentumPointData } from "@/domain/entities/simulation.types";

const NEUTRAL_COLOR = "#5C6370";
const NEUTRAL_SECONDARY = "#8B92A8";

const TOOLTIP_BOX = {
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-default)",
  borderRadius: "8px",
  padding: "8px 12px",
  display: "flex" as const,
  flexDirection: "column" as const,
  gap: "4px",
};

interface AreaTooltipProps {
  active?: boolean;
  payload?: { dataKey: string; value: number }[];
  label?: string | number;
  homeTeam: string;
  awayTeam: string;
}

const AreaTooltip = ({
  active,
  payload,
  label,
  homeTeam,
  awayTeam,
}: Readonly<AreaTooltipProps>) => {
  if (!active || !payload || payload.length === 0) return null;
  const nameMap: Record<string, string> = {
    home: homeTeam,
    draw: "Empate",
    away: awayTeam,
  };
  return (
    <div style={TOOLTIP_BOX}>
      {label !== undefined && (
        <span
          style={{
            color: "var(--text-secondary)",
            fontWeight: 500,
            fontSize: "0.8rem",
          }}
        >
          Min. {label}
        </span>
      )}
      {[...payload].reverse().map((entry) => (
        <span
          key={entry.dataKey}
          style={{
            color: "var(--text-primary)",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          {nameMap[entry.dataKey] ?? entry.dataKey}{" "}
          {(entry.value ?? 0).toFixed(1)}%
        </span>
      ))}
    </div>
  );
};

interface MomentumTimelineChartProps {
  readonly momentumTimeline: MomentumPointData[];
  readonly homeTeam: string;
  readonly awayTeam: string;
  readonly homeColor: string;
  readonly awayColor: string;
  readonly homeColorSecondary: string;
  readonly awayColorSecondary: string;
}

interface MomentumLegendLabelProps {
  readonly value: string;
  readonly homeTeam: string;
  readonly awayTeam: string;
}

function MomentumLegendLabel({
  value,
  homeTeam,
  awayTeam,
}: Readonly<MomentumLegendLabelProps>) {
  const labelMap: Record<string, string> = {
    home: homeTeam,
    draw: "Empate",
    away: awayTeam,
  };
  const label = labelMap[value] ?? value;
  return (
    <span style={{ color: "var(--text-primary)", fontSize: "0.875rem" }}>
      {label}
    </span>
  );
}

function makeLegendFormatter(homeTeam: string, awayTeam: string) {
  return function legendFormatter(value: string) {
    return (
      <MomentumLegendLabel
        value={value}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
      />
    );
  };
}

export function MomentumTimelineChart({
  momentumTimeline,
  homeTeam,
  awayTeam,
  homeColor,
  awayColor,
  homeColorSecondary,
  awayColorSecondary,
}: MomentumTimelineChartProps) {
  const data = momentumTimeline.map((point) => ({
    minute: point.minute,
    home: Math.round(point.homeWinProbability * 1000) / 10,
    draw: Math.round(point.drawProbability * 1000) / 10,
    away: Math.round(point.awayWinProbability * 1000) / 10,
  }));

  const legendFormatter = useMemo(
    () => makeLegendFormatter(homeTeam, awayTeam),
    [homeTeam, awayTeam]
  );

  return (
    <div className="simulation-card">
      <h3 className="simulation-section-title">Evolución del partido</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          stackOffset="expand"
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
          <XAxis
            dataKey="minute"
            label={{
              value: "Min.",
              position: "insideBottomRight",
              offset: -8,
              fill: "var(--text-secondary)",
              fontSize: 11,
            }}
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
          />
          <Tooltip
            content={<AreaTooltip homeTeam={homeTeam} awayTeam={awayTeam} />}
          />
          <Legend formatter={legendFormatter} />
          <Area
            type="monotone"
            dataKey="home"
            stackId="1"
            stroke={homeColorSecondary}
            fill={homeColor}
            fillOpacity={0.7}
          />
          <Area
            type="monotone"
            dataKey="draw"
            stackId="1"
            stroke={NEUTRAL_SECONDARY}
            fill={NEUTRAL_COLOR}
            fillOpacity={0.5}
          />
          <Area
            type="monotone"
            dataKey="away"
            stackId="1"
            stroke={awayColorSecondary}
            fill={awayColor}
            fillOpacity={0.7}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
