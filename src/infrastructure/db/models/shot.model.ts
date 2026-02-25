import mongoose, { Schema, Document, Types } from "mongoose";

export interface IShotDocument extends Document {
  xg: number;
  xgot: number;
  isHome: boolean;
  shotType: string;
  situation: string;
  bodyPart: string;
  timeSeconds: number;
  externalId: number;
  playerId: Types.ObjectId;
  goalkeeperPlayerId?: Types.ObjectId;
  matchId: Types.ObjectId;
}

const ShotSchema = new Schema<IShotDocument>(
  {
    xg: { type: Number, required: true },
    xgot: { type: Number, required: true },
    isHome: { type: Boolean, required: true },
    shotType: { type: String, required: true },
    situation: { type: String, required: true },
    bodyPart: { type: String, required: true },
    timeSeconds: { type: Number, required: true },
    externalId: { type: Number, required: true, unique: true },
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    goalkeeperPlayerId: { type: Schema.Types.ObjectId, ref: "Player" },
    matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
  },
  { timestamps: true }
);

ShotSchema.index({ playerId: 1 });
ShotSchema.index({ matchId: 1 });

export const ShotModel =
  mongoose.models.Shot || mongoose.model<IShotDocument>("Shot", ShotSchema);
