import { Shot } from "@/domain/entities/shot.entity";
import { ShotRepository } from "@/domain/repositories/shot.repository";
import { ShotModel } from "../db/models/shot.model";
import { Types } from "mongoose";

export class MongooseShotRepository implements ShotRepository {
  async findByExternalId(externalId: number): Promise<Shot | null> {
    const doc = await ShotModel.findOne({ externalId }).lean();
    return doc ? (null as unknown as Shot) : null;
  }

  async upsert(shot: Shot): Promise<void> {
    const data: Record<string, unknown> = {
      xg: shot.xg,
      xgot: shot.xgot,
      isHome: shot.isHome,
      shotType: shot.shotType.value,
      situation: shot.situation.value,
      bodyPart: shot.bodyPart.value,
      timeSeconds: shot.timeSeconds,
      externalId: shot.externalId,
      playerId: new Types.ObjectId(shot.player.id),
      matchId: new Types.ObjectId(shot.matchId),
    };

    if (shot.goalkeeper) {
      data.goalkeeperPlayerId = new Types.ObjectId(shot.goalkeeper.id);
    }

    await ShotModel.updateOne(
      { externalId: shot.externalId },
      { $set: data },
      { upsert: true }
    );
  }
}
