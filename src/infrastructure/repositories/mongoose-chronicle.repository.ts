import { Types } from "mongoose";
import { Chronicle } from "@/domain/entities/chronicle.entity";
import { ChronicleRepository } from "@/domain/repositories/chronicle.repository";
import {
  ChronicleModel,
  IChronicleDocument,
} from "../db/models/chronicle.model";

export class MongooseChronicleRepository implements ChronicleRepository {
  async upsert(chronicle: Chronicle): Promise<void> {
    await ChronicleModel.updateOne(
      { matchId: new Types.ObjectId(chronicle.matchId) },
      {
        $set: {
          matchId: new Types.ObjectId(chronicle.matchId),
          kicker: chronicle.kicker,
          title: chronicle.title,
          summary: chronicle.summary,
          sections: chronicle.sections,
          highlights: chronicle.highlights,
          keyStats: chronicle.keyStats,
          timeline: chronicle.timeline,
          author: chronicle.author,
          sourceLabel: chronicle.sourceLabel,
          generatedAt: chronicle.generatedAt,
          relatedSimulation: chronicle.relatedSimulation,
        },
      },
      { upsert: true }
    );
  }

  async findByMatchId(matchId: string): Promise<Chronicle | null> {
    const doc = (await ChronicleModel.findOne({
      matchId: new Types.ObjectId(matchId),
    }).lean()) as IChronicleDocument | null;

    return doc ? this.mapToEntity(doc) : null;
  }

  async deleteAll(): Promise<void> {
    await ChronicleModel.deleteMany({});
  }

  private mapToEntity(doc: IChronicleDocument): Chronicle {
    return new Chronicle(
      doc._id.toString(),
      doc.matchId.toString(),
      doc.kicker,
      doc.title,
      doc.summary,
      doc.sections.map((section) => ({
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
      doc.highlights.map((highlight) => ({
        label: highlight.label,
        value: highlight.value,
        accent: highlight.accent,
      })),
      doc.keyStats.map((keyStat) => ({
        label: keyStat.label,
        value: keyStat.value,
        context: keyStat.context,
        accent: keyStat.accent,
      })),
      doc.timeline.map((timelineItem) => ({
        minute: timelineItem.minute,
        title: timelineItem.title,
        description: timelineItem.description,
        accent: timelineItem.accent,
      })),
      doc.author,
      doc.sourceLabel,
      doc.generatedAt,
      {
        homeWinProbability: doc.relatedSimulation.homeWinProbability,
        drawProbability: doc.relatedSimulation.drawProbability,
        awayWinProbability: doc.relatedSimulation.awayWinProbability,
        momentumTimeline: doc.relatedSimulation.momentumTimeline.map(
          (point) => ({
            minute: point.minute,
            homeWinProbability: point.homeWinProbability,
            drawProbability: point.drawProbability,
            awayWinProbability: point.awayWinProbability,
          })
        ),
        playerStats: doc.relatedSimulation.playerStats.map((playerStat) => ({
          ...playerStat,
        })),
        scoreDistribution: doc.relatedSimulation.scoreDistribution.map(
          (scoreline) => ({
            home: scoreline.home,
            away: scoreline.away,
            count: scoreline.count,
            percentage: scoreline.percentage,
          })
        ),
        xPtsHome: doc.relatedSimulation.xPtsHome,
        xPtsAway: doc.relatedSimulation.xPtsAway,
        homeTeam: doc.relatedSimulation.homeTeam,
        awayTeam: doc.relatedSimulation.awayTeam,
      }
    );
  }
}
