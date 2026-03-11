import {
  ChronicleHighlight,
  ChronicleKeyStat,
  ChronicleSection,
  ChronicleSectionQuote,
  ChronicleSimulationSnapshot,
  ChronicleTimelineItem,
} from "@/domain/entities/chronicle.entity";

export type { ChronicleAccent } from "@/domain/entities/chronicle.entity";

export type ChronicleSectionQuoteResult = ChronicleSectionQuote;

export type ChronicleSectionResult = ChronicleSection;

export type ChronicleHighlightResult = ChronicleHighlight;

export type ChronicleKeyStatResult = ChronicleKeyStat;

export type ChronicleTimelineItemResult = ChronicleTimelineItem;

export type ChronicleSimulationSnapshotResult = ChronicleSimulationSnapshot;

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
