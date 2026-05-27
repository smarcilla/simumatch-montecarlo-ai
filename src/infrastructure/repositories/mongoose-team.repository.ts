import { Team } from "@/domain/entities/team.entity";
import { TeamRepository } from "@/domain/repositories/team.repository";
import { Color } from "@/domain/value-objects/color.value";
import { Types } from "mongoose";
import { ITeamDocument, TeamModel } from "../db/models/team.model";

export class MongooseTeamRepository implements TeamRepository {
  async findByExternalId(externalId: number): Promise<Team | null> {
    const doc = await TeamModel.findOne({ externalId }).lean<ITeamDocument>();
    if (!doc) return null;
    return this.mapToEntity(doc);
  }

  async findBySlug(slug: string): Promise<Team | null> {
    const doc = await TeamModel.findOne({ slug }).lean<ITeamDocument>();
    if (!doc) return null;
    return this.mapToEntity(doc);
  }

  async findByNamePattern(
    pattern: string,
    withinIds: string[]
  ): Promise<Team[]> {
    if (withinIds.length === 0) {
      return [];
    }

    const ids = withinIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    if (ids.length === 0) {
      return [];
    }

    const regex = new RegExp(this.escapeRegExp(pattern), "i");

    const docs = await TeamModel.find({
      _id: { $in: ids },
      $or: [{ name: regex }, { shortName: regex }],
    })
      .sort({ name: 1 })
      .lean<ITeamDocument[]>();

    return docs.map((doc) => this.mapToEntity(doc));
  }

  async upsert(team: Team): Promise<void> {
    await TeamModel.updateOne(
      { externalId: team.externalId },
      {
        $set: {
          externalId: team.externalId,
          name: team.name,
          slug: team.slug,
          shortName: team.shortName,
          primaryColor: team.primaryColor.hex,
          secondaryColor: team.secondaryColor.hex,
        },
      },
      { upsert: true }
    );
  }

  async deleteAll(): Promise<void> {
    await TeamModel.deleteMany({});
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  }

  private mapToEntity(doc: ITeamDocument): Team {
    return new Team(
      doc._id.toString(),
      doc.externalId,
      doc.name,
      doc.slug,
      doc.shortName,
      Color.create(doc.primaryColor),
      Color.create(doc.secondaryColor),
      doc.flagUrl
    );
  }
}
