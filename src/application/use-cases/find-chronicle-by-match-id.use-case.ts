import { ChronicleResult } from "../results/chronicle.result";
import { Chronicle } from "@/domain/entities/chronicle.entity";
import { ChronicleRepository } from "@/domain/repositories/chronicle.repository";

export class FindChronicleByMatchIdUseCase {
  constructor(private readonly chronicleRepository: ChronicleRepository) {}

  async execute(matchId: string): Promise<ChronicleResult | null> {
    const chronicle = await this.chronicleRepository.findByMatchId(matchId);

    if (!chronicle) {
      return null;
    }

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
