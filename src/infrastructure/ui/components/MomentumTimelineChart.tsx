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
import { useTranslations } from "next-intl";

const NEUTRAL_COLOR = "#5C6370";
const NEUTRAL_SECONDARY = "#8B92A8";

interface AreaTooltipProps {
  active?: boolean;
  payload?: { dataKey: string; value: number }[];
  label?: string | number;
  homeTeam: string;
  awayTeam: string;
  drawLabel: string;
  minLabel: string;
}

const AreaTooltip = ({
  active,
  payload,
  label,
  homeTeam,
  awayTeam,
  drawLabel,
  minLabel,
}: Readonly<AreaTooltipProps>) => {
  if (!active || !payload || payload.length === 0) return null;
  const nameMap: Record<string, string> = {
    home: homeTeam,
    draw: drawLabel,
    away: awayTeam,
  };
  return (
    <div
      className="chart-tooltip"
      style={{ display: "flex", flexDirection: "column", gap: "4px" }}
    >
      {label !== undefined && (
        <span className="chart-tooltip-sublabel">
          {minLabel} {label}
        </span>
      )}
      {[...payload].reverse().map((entry) => (
        <span
          key={entry.dataKey}
          className="chart-tooltip-label"
          style={{ fontWeight: 600, fontSize: "0.9rem" }}
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
  readonly drawLabel: string;
}

function MomentumLegendLabel({
  value,
  homeTeam,
  awayTeam,
  drawLabel,
}: Readonly<MomentumLegendLabelProps>) {
  const labelMap: Record<string, string> = {
    home: homeTeam,
    draw: drawLabel,
    away: awayTeam,
  };
  const label = labelMap[value] ?? value;
  return <span className="chart-legend-label">{label}</span>;
}

function makeLegendFormatter(
  homeTeam: string,
  awayTeam: string,
  drawLabel: string
) {
  return function legendFormatter(value: string) {
    return (
      <MomentumLegendLabel
        value={value}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        drawLabel={drawLabel}
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
  const t = useTranslations("simulation");
  const tCommon = useTranslations("common");
  const drawLabel = tCommon("draw");
  const minLabel = t("min");
  const data = momentumTimeline.map((point) => ({
    minute: point.minute,
    home: Math.round(point.homeWinProbability * 1000) / 10,
    draw: Math.round(point.drawProbability * 1000) / 10,
    away: Math.round(point.awayWinProbability * 1000) / 10,
  }));

  const legendFormatter = useMemo(
    () => makeLegendFormatter(homeTeam, awayTeam, drawLabel),
    [homeTeam, awayTeam, drawLabel]
  );

  return (
    <div className="simulation-card">
      <h3 className="simulation-section-title">{t("matchEvolution")}</h3>
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
            content={
              <AreaTooltip
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                drawLabel={drawLabel}
                minLabel={minLabel}
              />
            }
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
