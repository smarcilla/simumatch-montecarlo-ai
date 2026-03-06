// src/infrastructure/repositories/mongoose-league.repository.ts
import { League } from "@/domain/entities/league.entity";
import { Season } from "@/domain/entities/season.entity";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { LeagueModel } from "../db/models/league.model";
import { ISeasonDocument } from "../db/models/season.model";
import { SeasonYear } from "@/domain/value-objects/season-year.value";
import { Types } from "mongoose";

interface ILeagueWithSeasons {
  _id: Types.ObjectId;
  name: string;
  country: string;
  externalId?: string;
  numericExternalId?: number;
  seasons: ISeasonDocument[];
}

interface ILeagueDocument {
  _id: Types.ObjectId;
  name: string;
  country: string;
  externalId?: string;
  numericExternalId?: number;
}

export class MongooseLeagueRepository implements LeagueRepository {
  async getLeagues(): Promise<League[]> {
    const leaguesWithSeasons = await LeagueModel.aggregate<ILeagueWithSeasons>([
      {
        $lookup: {
          from: "seasons",
          localField: "_id",
          foreignField: "leagueId",
          as: "seasons",
        },
      },
      {
        $match: {
          "seasons.0": { $exists: true },
        },
      },
      {
        $addFields: {
          seasons: {
            $sortArray: {
              input: "$seasons",
              sortBy: { seasonYear: -1 },
            },
          },
        },
      },
    ]);

    return leaguesWithSeasons.map(this.mapWithSeasonsToEntity);
  }

  async findAll(): Promise<League[]> {
    const docs = await LeagueModel.find({}).lean<ILeagueDocument[]>();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findByNumericExternalId(
    numericExternalId: number
  ): Promise<League | null> {
    const doc = await LeagueModel.findOne({
      numericExternalId,
    }).lean<ILeagueDocument>();
    if (!doc) return null;
    return this.mapToEntity(doc);
  }

  async upsert(league: League): Promise<void> {
    await LeagueModel.updateOne(
      { numericExternalId: league.numericExternalId },
      {
        $set: {
          name: league.name,
          country: league.country,
          externalId: league.externalId,
          numericExternalId: league.numericExternalId,
        },
      },
      { upsert: true }
    );
  }

  async deleteAll(): Promise<void> {
    await LeagueModel.deleteMany({});
  }

  private mapWithSeasonsToEntity(doc: ILeagueWithSeasons): League {
    const seasons = doc.seasons.map(
      (s) =>
        new Season(
          s.name,
          new SeasonYear(s.seasonYear),
          s._id.toString(),
          s.externalId
        )
    );

    return new League(
      doc.name,
      doc.country,
      seasons,
      doc._id.toString(),
      doc.externalId,
      doc.numericExternalId
    );
  }

  private mapToEntity(doc: ILeagueDocument): League {
    return new League(
      doc.name,
      doc.country,
      [],
      doc._id.toString(),
      doc.externalId,
      doc.numericExternalId
    );
  }
}
