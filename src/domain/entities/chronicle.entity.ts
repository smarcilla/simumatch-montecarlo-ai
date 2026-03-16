import {
  MomentumPointData,
  ScoreDistributionItemData,
  SimulationPlayerStat,
} from "./simulation.types";
import { Match } from "./match.entity";
import { Simulation } from "./simulation.entity";

export type ChronicleAccent = "home" | "away" | "neutral";

const VALID_ACCENTS: ReadonlySet<string> = new Set(["home", "away", "neutral"]);
const VALID_SECTION_IDS: readonly string[] = [
  "pulse",
  "turning-point",
  "closing",
];
const REQUIRED_SECTIONS_COUNT = 3;
const REQUIRED_HIGHLIGHTS_COUNT = 3;
const REQUIRED_KEY_STATS_COUNT = 3;
const REQUIRED_TIMELINE_COUNT = 3;
const MIN_PARAGRAPHS = 2;
const MAX_PARAGRAPHS = 3;
const TIMELINE_MINUTE_PATTERN = /^\d+'$/;

export interface ChronicleSectionQuote {
  text: string;
  attribution: string;
}

export interface ChronicleSection {
  id: string;
  title: string;
  paragraphs: string[];
  quote?: ChronicleSectionQuote;
}

export interface ChronicleHighlight {
  label: string;
  value: string;
  accent: ChronicleAccent;
}

export interface ChronicleKeyStat {
  label: string;
  value: string;
  context: string;
  accent: ChronicleAccent;
}

export interface ChronicleTimelineItem {
  minute: string;
  title: string;
  description: string;
  accent: ChronicleAccent;
}

export interface ChronicleSimulationSnapshot {
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

export interface ChronicleGenerationSnapshot extends ChronicleSimulationSnapshot {
  homeScore: number;
  awayScore: number;
}

export interface ChronicleGeneratedContent {
  kicker: string;
  title: string;
  summary: string;
  sections: ChronicleSection[];
  highlights: ChronicleHighlight[];
  keyStats: ChronicleKeyStat[];
  timeline: ChronicleTimelineItem[];
  author: string;
  sourceLabel: string;
  generatedAt: string;
}

export class ChronicleGenerationContext {
  constructor(
    readonly matchId: string,
    readonly relatedSimulation: ChronicleGenerationSnapshot
  ) {}

  static create(
    match: Match,
    simulation: Simulation
  ): ChronicleGenerationContext {
    return new ChronicleGenerationContext(match.id, {
      homeWinProbability: simulation.homeWinProbability,
      drawProbability: simulation.drawProbability,
      awayWinProbability: simulation.awayWinProbability,
      momentumTimeline: simulation.momentumTimeline.map((point) => ({
        minute: point.minute,
        homeWinProbability: point.homeWinProbability,
        drawProbability: point.drawProbability,
        awayWinProbability: point.awayWinProbability,
      })),
      playerStats: simulation.playerStats.map((playerStat) => ({
        ...playerStat,
      })),
      scoreDistribution: simulation.scoreDistribution.map((scoreline) => ({
        home: scoreline.home,
        away: scoreline.away,
        count: scoreline.count,
        percentage: scoreline.percentage,
      })),
      xPtsHome: simulation.xPtsHome,
      xPtsAway: simulation.xPtsAway,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      homeScore: match.score.home,
      awayScore: match.score.away,
    });
  }

  toSimulationSnapshot(): ChronicleSimulationSnapshot {
    return {
      homeWinProbability: this.relatedSimulation.homeWinProbability,
      drawProbability: this.relatedSimulation.drawProbability,
      awayWinProbability: this.relatedSimulation.awayWinProbability,
      momentumTimeline: this.relatedSimulation.momentumTimeline.map(
        (point) => ({
          minute: point.minute,
          homeWinProbability: point.homeWinProbability,
          drawProbability: point.drawProbability,
          awayWinProbability: point.awayWinProbability,
        })
      ),
      playerStats: this.relatedSimulation.playerStats.map((playerStat) => ({
        ...playerStat,
      })),
      scoreDistribution: this.relatedSimulation.scoreDistribution.map(
        (scoreline) => ({
          home: scoreline.home,
          away: scoreline.away,
          count: scoreline.count,
          percentage: scoreline.percentage,
        })
      ),
      xPtsHome: this.relatedSimulation.xPtsHome,
      xPtsAway: this.relatedSimulation.xPtsAway,
      homeTeam: this.relatedSimulation.homeTeam,
      awayTeam: this.relatedSimulation.awayTeam,
    };
  }
}

export class Chronicle {
  constructor(
    readonly id: string | null,
    readonly matchId: string,
    readonly kicker: string,
    readonly title: string,
    readonly summary: string,
    readonly sections: ChronicleSection[],
    readonly highlights: ChronicleHighlight[],
    readonly keyStats: ChronicleKeyStat[],
    readonly timeline: ChronicleTimelineItem[],
    readonly author: string,
    readonly sourceLabel: string,
    readonly generatedAt: string,
    readonly relatedSimulation: ChronicleSimulationSnapshot
  ) {}

  static createGenerated(
    generationContext: ChronicleGenerationContext,
    generatedContent: ChronicleGeneratedContent,
    id: string | null = null
  ): Chronicle {
    Chronicle.validateGeneratedContent(generatedContent);

    return new Chronicle(
      id,
      generationContext.matchId,
      generatedContent.kicker,
      generatedContent.title,
      generatedContent.summary,
      generatedContent.sections.map((section) => ({
        id: section.id,
        title: section.title,
        paragraphs: [...section.paragraphs],
        ...(section.quote
          ? {
              quote: {
                text: section.quote.text,
                attribution: section.quote.attribution,
              },
            }
          : {}),
      })),
      generatedContent.highlights.map((highlight) => ({
        label: highlight.label,
        value: highlight.value,
        accent: highlight.accent,
      })),
      generatedContent.keyStats.map((keyStat) => ({
        label: keyStat.label,
        value: keyStat.value,
        context: keyStat.context,
        accent: keyStat.accent,
      })),
      generatedContent.timeline.map((timelineItem) => ({
        minute: timelineItem.minute,
        title: timelineItem.title,
        description: timelineItem.description,
        accent: timelineItem.accent,
      })),
      generatedContent.author,
      generatedContent.sourceLabel,
      generatedContent.generatedAt,
      generationContext.toSimulationSnapshot()
    );
  }

  private static validateGeneratedContent(
    content: ChronicleGeneratedContent
  ): void {
    if (content.sections.length !== REQUIRED_SECTIONS_COUNT) {
      throw new Error(
        `Chronicle must have exactly ${REQUIRED_SECTIONS_COUNT} sections, got ${content.sections.length}.`
      );
    }

    const sectionIds = content.sections.map((s) => s.id);
    if (!VALID_SECTION_IDS.every((id, i) => sectionIds[i] === id)) {
      throw new Error(
        `Chronicle section ids must be [${VALID_SECTION_IDS.join(", ")}] in order, got [${sectionIds.join(", ")}].`
      );
    }

    for (const section of content.sections) {
      if (
        section.paragraphs.length < MIN_PARAGRAPHS ||
        section.paragraphs.length > MAX_PARAGRAPHS
      ) {
        throw new Error(
          `Section "${section.id}" must have between ${MIN_PARAGRAPHS} and ${MAX_PARAGRAPHS} paragraphs, got ${section.paragraphs.length}.`
        );
      }
    }

    if (content.highlights.length !== REQUIRED_HIGHLIGHTS_COUNT) {
      throw new Error(
        `Chronicle must have exactly ${REQUIRED_HIGHLIGHTS_COUNT} highlights, got ${content.highlights.length}.`
      );
    }

    if (content.keyStats.length !== REQUIRED_KEY_STATS_COUNT) {
      throw new Error(
        `Chronicle must have exactly ${REQUIRED_KEY_STATS_COUNT} key stats, got ${content.keyStats.length}.`
      );
    }

    if (content.timeline.length !== REQUIRED_TIMELINE_COUNT) {
      throw new Error(
        `Chronicle must have exactly ${REQUIRED_TIMELINE_COUNT} timeline items, got ${content.timeline.length}.`
      );
    }

    const allAccents: string[] = [
      ...content.highlights.map((h) => h.accent),
      ...content.keyStats.map((k) => k.accent),
      ...content.timeline.map((t) => t.accent),
    ];
    for (const accent of allAccents) {
      if (!VALID_ACCENTS.has(accent)) {
        throw new Error(
          `Invalid accent value: "${accent}". Must be "home", "away" or "neutral".`
        );
      }
    }

    for (const item of content.timeline) {
      if (!TIMELINE_MINUTE_PATTERN.test(item.minute)) {
        throw new Error(
          String.raw`Invalid timeline minute format: "${item.minute}". Must match pattern "\d+'".`
        );
      }
    }
  }
}
