import { Simulation } from "@/domain/entities/simulation.entity";
import { SimulationRepository } from "@/domain/repositories/simulation.repository";
import {
  ISimulationDocument,
  SimulationModel,
} from "../db/models/simulation.model";
import { ScoreDistributionItem } from "@/domain/value-objects/score-distribution-item.value";
import { MomentumPoint } from "@/domain/value-objects/momentum-point.value";
import { Types } from "mongoose";

export class MongooseSimulationRepository implements SimulationRepository {
  async save(simulation: Simulation): Promise<void> {
    await SimulationModel.updateOne(
      { matchId: new Types.ObjectId(simulation.matchId) },
      {
        $set: {
          matchId: new Types.ObjectId(simulation.matchId),
          homeWinProbability: simulation.homeWinProbability,
          drawProbability: simulation.drawProbability,
          awayWinProbability: simulation.awayWinProbability,
          xPtsHome: simulation.xPtsHome,
          xPtsAway: simulation.xPtsAway,
          scoreDistribution: simulation.scoreDistribution,
          playerStats: simulation.playerStats,
          momentumTimeline: simulation.momentumTimeline,
        },
      },
      { upsert: true }
    );
  }

  async findByMatchId(matchId: string): Promise<Simulation | null> {
    const doc = (await SimulationModel.findOne({
      matchId: new Types.ObjectId(matchId),
    }).lean()) as ISimulationDocument | null;

    return doc ? this.mapToEntity(doc) : null;
  }

  async deleteAll(): Promise<void> {
    await SimulationModel.deleteMany({});
  }

  private mapToEntity(doc: ISimulationDocument): Simulation {
    return new Simulation(
      doc._id.toString(),
      doc.matchId.toString(),
      doc.homeWinProbability,
      doc.drawProbability,
      doc.awayWinProbability,
      doc.xPtsHome,
      doc.xPtsAway,
      doc.scoreDistribution.map((s) =>
        ScoreDistributionItem.create(s.home, s.away, s.count, s.percentage)
      ),
      doc.playerStats,
      doc.momentumTimeline.map((m) =>
        MomentumPoint.create(
          m.minute,
          m.homeWinProbability,
          m.drawProbability,
          m.awayWinProbability
        )
      ),
      doc.createdAt
    );
  }
}
