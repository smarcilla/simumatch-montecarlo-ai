import mongoose, { Schema, Document } from "mongoose";

export interface ITeamDocument extends Document {
  name: string;
  slug: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  externalId: number;
}

const TeamSchema = new Schema<ITeamDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    shortName: { type: String, required: true },
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String, required: true },
    externalId: { type: Number, required: true, unique: true },
  },
  { timestamps: true }
);

export const TeamModel =
  mongoose.models.Team || mongoose.model<ITeamDocument>("Team", TeamSchema);
