import { Shot } from "@/domain/entities/shot.entity";
import { ShotRepository } from "@/domain/repositories/shot.repository";
import { ShotModel } from "../db/models/shot.model";
import { Types } from "mongoose";
import { PaginationOptions } from "@/application/options/pagination.options";
import { ShotFilterOptions } from "@/application/options/shot-filter.options";
import { PaginatedResult } from "@/application/results/paginated.result";
import { Player } from "@/domain/entities/player.entity";
import { ShotType } from "@/domain/value-objects/shot-type.value";
import { ShotSituation } from "@/domain/value-objects/shot-situation.value";
import { BodyPart } from "@/domain/value-objects/body-part.value";

interface IPlayerPopulated {
  _id: Types.ObjectId;
  externalId: number;
  name: string;
  slug: string;
  shortName: string;
  position: string;
  jerseyNumber: string;
}

interface IShotPopulated {
  _id: Types.ObjectId;
  externalId: number;
  xg: number;
  xgot: number;
  isHome: boolean;
  shotType: string;
  situation: string;
  bodyPart: string;
  timeSeconds: number;
  playerId: IPlayerPopulated;
  goalkeeperPlayerId?: IPlayerPopulated;
  matchId: Types.ObjectId;
}

export class MongooseShotRepository implements ShotRepository {
  async findByExternalId(externalId: number): Promise<Shot | null> {
    const doc = await ShotModel.findOne({ externalId })
      .populate<{ playerId: IPlayerPopulated }>("playerId")
      .populate<{ goalkeeperPlayerId?: IPlayerPopulated }>("goalkeeperPlayerId")
      .lean<IShotPopulated>();
    if (!doc) return null;
    return this.mapToEntity(doc, doc.matchId.toString());
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

  async findByMatchId(
    matchId: string,
    options: PaginationOptions,
    filters: ShotFilterOptions
  ): Promise<PaginatedResult<Shot>> {
    const query = this.mapFiltersToQuery(matchId, filters);
    const sortField = filters.sortBy === "xg" ? "xg" : "timeSeconds";
    const sortDir = filters.sortOrder === "desc" ? -1 : 1;

    const total = await ShotModel.countDocuments(query);
    const docs = await ShotModel.find(query)
      .populate<{ playerId: IPlayerPopulated }>("playerId")
      .populate<{ goalkeeperPlayerId?: IPlayerPopulated }>("goalkeeperPlayerId")
      .sort({ [sortField]: sortDir })
      .skip(options.page * options.pageSize)
      .limit(options.pageSize)
      .lean<IShotPopulated[]>();

    const totalPages = Math.ceil(total / options.pageSize);
    return {
      results: docs.map((doc) => this.mapToEntity(doc, matchId)),
      total,
      page: options.page,
      pageSize: options.pageSize,
      totalPages,
      hasNextPage: options.page < totalPages - 1,
      hasPreviousPage: options.page > 0,
    };
  }

  async findAllByMatchId(matchId: string): Promise<Shot[]> {
    const docs = await ShotModel.find({
      matchId: new Types.ObjectId(matchId),
    })
      .populate<{ playerId: IPlayerPopulated }>("playerId")
      .populate<{ goalkeeperPlayerId?: IPlayerPopulated }>("goalkeeperPlayerId")
      .sort({ timeSeconds: 1 })
      .lean<IShotPopulated[]>();

    return docs.map((doc) => this.mapToEntity(doc, matchId));
  }

  private mapFiltersToQuery(
    matchId: string,
    filters: ShotFilterOptions
  ): Record<string, unknown> {
    const query: Record<string, unknown> = {
      matchId: new Types.ObjectId(matchId),
    };

    if (filters.shotTypes && filters.shotTypes.length > 0) {
      query.shotType = { $in: filters.shotTypes };
    }
    if (filters.situations && filters.situations.length > 0) {
      query.situation = { $in: filters.situations };
    }
    if (filters.isHome !== undefined) {
      query.isHome = filters.isHome;
    }

    return query;
  }

  private mapToPlayer(doc: IPlayerPopulated): Player {
    return new Player(
      doc._id.toString(),
      doc.externalId,
      doc.name,
      doc.slug,
      doc.shortName,
      doc.position,
      doc.jerseyNumber
    );
  }

  private mapToEntity(doc: IShotPopulated, matchId: string): Shot {
    const player = this.mapToPlayer(doc.playerId);

    const goalkeeper = doc.goalkeeperPlayerId
      ? this.mapToPlayer(doc.goalkeeperPlayerId)
      : null;

    return new Shot(
      doc._id.toString(),
      doc.externalId,
      doc.xg,
      doc.xgot,
      doc.isHome,
      ShotType.create(doc.shotType),
      ShotSituation.create(doc.situation),
      BodyPart.create(doc.bodyPart),
      doc.timeSeconds,
      player,
      goalkeeper,
      matchId
    );
  }

  async deleteAll(): Promise<void> {
    await ShotModel.deleteMany({});
  }
}
