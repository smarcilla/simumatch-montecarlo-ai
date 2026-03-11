import {
  MomentumPointData,
  ScoreDistributionItemData,
  SimulationPlayerStat,
} from "./simulation.types";
import { Match } from "./match.entity";
import { Simulation } from "./simulation.entity";

export type ChronicleAccent = "home" | "away" | "neutral";

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
}
