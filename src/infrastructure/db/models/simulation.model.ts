import mongoose, { Schema, Document, Types } from "mongoose";
import {
  MomentumPointData,
  ScoreDistributionItemData,
  SimulationPlayerStat,
} from "@/domain/entities/simulation.types";

export interface ISimulationDocument extends Document {
  matchId: Types.ObjectId;
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  xPtsHome: number;
  xPtsAway: number;
  scoreDistribution: ScoreDistributionItemData[];
  playerStats: SimulationPlayerStat[];
  momentumTimeline: MomentumPointData[];
  createdAt: Date;
}

const ScoreDistributionSchema = new Schema<ScoreDistributionItemData>(
  {
    home: { type: Number, required: true },
    away: { type: Number, required: true },
    count: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  { _id: false }
);

const SimulationPlayerStatSchema = new Schema<SimulationPlayerStat>(
  {
    playerId: { type: String, required: true },
    playerName: { type: String, required: true },
    playerShortName: { type: String, required: true },
    isHome: { type: Boolean, required: true },
    goalProbability: { type: Number, required: true },
    sga: { type: Number, required: true },
  },
  { _id: false }
);

const MomentumPointSchema = new Schema<MomentumPointData>(
  {
    minute: { type: Number, required: true },
    homeWinProbability: { type: Number, required: true },
    drawProbability: { type: Number, required: true },
    awayWinProbability: { type: Number, required: true },
  },
  { _id: false }
);

const SimulationSchema = new Schema<ISimulationDocument>(
  {
    matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
    homeWinProbability: { type: Number, required: true },
    drawProbability: { type: Number, required: true },
    awayWinProbability: { type: Number, required: true },
    xPtsHome: { type: Number, required: true },
    xPtsAway: { type: Number, required: true },
    scoreDistribution: { type: [ScoreDistributionSchema], required: true },
    playerStats: { type: [SimulationPlayerStatSchema], required: true },
    momentumTimeline: { type: [MomentumPointSchema], required: true },
  },
  { timestamps: true }
);

SimulationSchema.index({ matchId: 1 }, { unique: true });

export const SimulationModel =
  (mongoose.models.Simulation as mongoose.Model<ISimulationDocument>) ||
  mongoose.model<ISimulationDocument>("Simulation", SimulationSchema);
