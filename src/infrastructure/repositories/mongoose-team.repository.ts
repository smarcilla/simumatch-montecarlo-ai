import { Team } from "@/domain/entities/team.entity";
import { TeamRepository } from "@/domain/repositories/team.repository";
import { Color } from "@/domain/value-objects/color.value";
import { ITeamDocument, TeamModel } from "../db/models/team.model";

export class MongooseTeamRepository implements TeamRepository {
  async findByExternalId(externalId: number): Promise<Team | null> {
    const doc = await TeamModel.findOne({ externalId }).lean<ITeamDocument>();
    if (!doc) return null;
    return this.mapToEntity(doc);
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

  private mapToEntity(doc: ITeamDocument): Team {
    return new Team(
      doc._id.toString(),
      doc.externalId,
      doc.name,
      doc.slug,
      doc.shortName,
      Color.create(doc.primaryColor),
      Color.create(doc.secondaryColor)
    );
  }
}
