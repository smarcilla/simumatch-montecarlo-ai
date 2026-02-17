// src/infrastructure/db/models/league.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ILeagueDocument extends Document {
  name: string;
  country: string;
  externalId?: string;
  numericExternalId?: number;
}

const LeagueSchema = new Schema<ILeagueDocument>(
  {
    name: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    externalId: { type: String, required: false },
    numericExternalId: { type: Number, required: false },
  },
  { timestamps: true }
);

export const LeagueModel =
  mongoose.models.League ||
  mongoose.model<ILeagueDocument>("League", LeagueSchema);
