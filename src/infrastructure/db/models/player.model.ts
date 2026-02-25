import mongoose, { Schema, Document } from "mongoose";

export interface IPlayerDocument extends Document {
  name: string;
  slug: string;
  shortName: string;
  position: string;
  jerseyNumber: string;
  externalId: number;
}

const PlayerSchema = new Schema<IPlayerDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    shortName: { type: String, required: true },
    position: { type: String, required: true },
    jerseyNumber: { type: String, required: true },
    externalId: { type: Number, required: true, unique: true },
  },
  { timestamps: true }
);

export const PlayerModel =
  mongoose.models.Player ||
  mongoose.model<IPlayerDocument>("Player", PlayerSchema);
