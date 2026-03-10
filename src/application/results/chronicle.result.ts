import {
  MomentumPointData,
  ScoreDistributionItemData,
  SimulationPlayerStat,
} from "@/domain/entities/simulation.types";

export type ChronicleAccent = "home" | "away" | "neutral";

export interface ChronicleSectionQuoteResult {
  text: string;
  attribution: string;
}

export interface ChronicleSectionResult {
  id: string;
  title: string;
  paragraphs: string[];
  quote?: ChronicleSectionQuoteResult;
}

export interface ChronicleHighlightResult {
  label: string;
  value: string;
  accent: ChronicleAccent;
}

export interface ChronicleKeyStatResult {
  label: string;
  value: string;
  context: string;
  accent: ChronicleAccent;
}

export interface ChronicleTimelineItemResult {
  minute: string;
  title: string;
  description: string;
  accent: ChronicleAccent;
}

export interface ChronicleSimulationSnapshotResult {
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  momentumTimeline: MomentumPointData[];
  playerStats: SimulationPlayerStat[];
  scoreDistribution: ScoreDistributionItemData[];
  xPtsHome: number;
  xPtsAway: number;
  homeTeam: string;
  awayTeam: string;
}

export interface ChronicleResult {
  matchId: string;
  kicker: string;
  title: string;
  summary: string;
  sections: ChronicleSectionResult[];
  highlights: ChronicleHighlightResult[];
  keyStats: ChronicleKeyStatResult[];
  timeline: ChronicleTimelineItemResult[];
  author: string;
  sourceLabel: string;
  generatedAt: string;
  relatedSimulation?: ChronicleSimulationSnapshotResult;
}
