import { ChronicleGenerator } from "../ports/chronicle-generator.port";
import { ChronicleResult } from "../results/chronicle.result";
import {
  Chronicle,
  ChronicleGenerationContext,
} from "@/domain/entities/chronicle.entity";
import { ChronicleRepository } from "@/domain/repositories/chronicle.repository";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { SimulationRepository } from "@/domain/repositories/simulation.repository";

export class GenerateChronicleUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly simulationRepository: SimulationRepository,
    private readonly chronicleRepository: ChronicleRepository,
    private readonly chronicleGenerator: ChronicleGenerator
  ) {}

  async execute(matchId: string): Promise<ChronicleResult | null> {
    const match = await this.matchRepository.findById(matchId);

    if (!match) {
      return null;
    }

    const simulation = await this.simulationRepository.findByMatchId(matchId);

    if (!match.canGenerateChronicle(!!simulation)) {
      return null;
    }

    const generationContext = ChronicleGenerationContext.create(
      match,
      simulation!
    );
    const chronicle = await this.chronicleGenerator.generate(generationContext);

    await this.chronicleRepository.upsert(chronicle);
    match.generateChronicle(true);
    await this.matchRepository.upsert(match);

    return this.mapToResult(chronicle);
  }

  private mapToResult(chronicle: Chronicle): ChronicleResult {
    return {
      matchId: chronicle.matchId,
      kicker: chronicle.kicker,
      title: chronicle.title,
      summary: chronicle.summary,
      sections: chronicle.sections.map((section) => ({
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
      highlights: chronicle.highlights.map((highlight) => ({
        label: highlight.label,
        value: highlight.value,
        accent: highlight.accent,
      })),
      keyStats: chronicle.keyStats.map((keyStat) => ({
        label: keyStat.label,
        value: keyStat.value,
        context: keyStat.context,
        accent: keyStat.accent,
      })),
      timeline: chronicle.timeline.map((timelineItem) => ({
        minute: timelineItem.minute,
        title: timelineItem.title,
        description: timelineItem.description,
        accent: timelineItem.accent,
      })),
      author: chronicle.author,
      sourceLabel: chronicle.sourceLabel,
      generatedAt: chronicle.generatedAt,
      relatedSimulation: {
        homeWinProbability: chronicle.relatedSimulation.homeWinProbability,
        drawProbability: chronicle.relatedSimulation.drawProbability,
        awayWinProbability: chronicle.relatedSimulation.awayWinProbability,
        momentumTimeline: chronicle.relatedSimulation.momentumTimeline.map(
          (point) => ({
            minute: point.minute,
            homeWinProbability: point.homeWinProbability,
            drawProbability: point.drawProbability,
            awayWinProbability: point.awayWinProbability,
          })
        ),
        playerStats: chronicle.relatedSimulation.playerStats.map(
          (playerStat) => ({
            ...playerStat,
          })
        ),
        scoreDistribution: chronicle.relatedSimulation.scoreDistribution.map(
          (scoreline) => ({
            home: scoreline.home,
            away: scoreline.away,
            count: scoreline.count,
            percentage: scoreline.percentage,
          })
        ),
        xPtsHome: chronicle.relatedSimulation.xPtsHome,
        xPtsAway: chronicle.relatedSimulation.xPtsAway,
        homeTeam: chronicle.relatedSimulation.homeTeam,
        awayTeam: chronicle.relatedSimulation.awayTeam,
      },
    };
  }
}
