import mongoose, { Schema, Document, Types } from "mongoose";
import { ISeasonDocument } from "./season.model";
import { ILeagueDocument } from "./league.model";
import { ITeamDocument } from "./team.model";

export interface IMatchDocument extends Document {
  homeTeamId: Types.ObjectId;
  awayTeamId: Types.ObjectId;
  leagueId: Types.ObjectId;
  seasonId: Types.ObjectId;
  date: Date;
  status: "finished" | "simulated" | "chronicle_generated";
  homeScore?: number;
  awayScore?: number;
  externalId: number;
}

export interface IMatchPopulated extends Omit<
  IMatchDocument,
  "leagueId" | "seasonId" | "homeTeamId" | "awayTeamId"
> {
  leagueId: ILeagueDocument;
  seasonId: ISeasonDocument;
  homeTeamId: ITeamDocument;
  awayTeamId: ITeamDocument;
}

const MatchSchema = new Schema<IMatchDocument>(
  {
    homeTeamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    awayTeamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    leagueId: { type: Schema.Types.ObjectId, ref: "League", required: true },
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["finished", "simulated", "chronicle_generated"],
      required: true,
    },
    homeScore: { type: Number },
    awayScore: { type: Number },
    externalId: { type: Number, required: true },
  },
  { timestamps: true }
);

MatchSchema.index({ leagueId: 1, seasonId: 1, date: 1 });
MatchSchema.index({ date: 1 });
MatchSchema.index({ status: 1 });

export const MatchModel =
  mongoose.models.Match || mongoose.model<IMatchDocument>("Match", MatchSchema);
