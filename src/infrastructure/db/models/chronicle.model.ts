import mongoose, { Document, Schema, Types } from "mongoose";
import {
  ChronicleHighlight,
  ChronicleKeyStat,
  ChronicleSection,
  ChronicleSectionQuote,
  ChronicleSimulationSnapshot,
  ChronicleTimelineItem,
} from "@/domain/entities/chronicle.entity";
import {
  MomentumPointData,
  ScoreDistributionItemData,
  SimulationPlayerStat,
} from "@/domain/entities/simulation.types";

export interface IChronicleDocument extends Document {
  matchId: Types.ObjectId;
  kicker: string;
  title: string;
  summary: string;
  sections: ChronicleSection[];
  highlights: ChronicleHighlight[];
  keyStats: ChronicleKeyStat[];
  timeline: ChronicleTimelineItem[];
  author: string;
  sourceLabel: string;
  generatedAt: string;
  relatedSimulation: ChronicleSimulationSnapshot;
}

const ChronicleSectionQuoteSchema = new Schema<ChronicleSectionQuote>(
  {
    text: { type: String, required: true },
    attribution: { type: String, required: true },
  },
  { _id: false }
);

const ChronicleSectionSchema = new Schema<ChronicleSection>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    paragraphs: { type: [String], required: true },
    quote: { type: ChronicleSectionQuoteSchema, required: false },
  },
  { _id: false }
);

const ChronicleHighlightSchema = new Schema<ChronicleHighlight>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    accent: {
      type: String,
      enum: ["home", "away", "neutral"],
      required: true,
    },
  },
  { _id: false }
);

const ChronicleKeyStatSchema = new Schema<ChronicleKeyStat>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    context: { type: String, required: true },
    accent: {
      type: String,
      enum: ["home", "away", "neutral"],
      required: true,
    },
  },
  { _id: false }
);

const ChronicleTimelineItemSchema = new Schema<ChronicleTimelineItem>(
  {
    minute: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    accent: {
      type: String,
      enum: ["home", "away", "neutral"],
      required: true,
    },
  },
  { _id: false }
);

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

const ChronicleSimulationSnapshotSchema =
  new Schema<ChronicleSimulationSnapshot>(
    {
      homeWinProbability: { type: Number, required: true },
      drawProbability: { type: Number, required: true },
      awayWinProbability: { type: Number, required: true },
      momentumTimeline: { type: [MomentumPointSchema], required: true },
      playerStats: { type: [SimulationPlayerStatSchema], required: true },
      scoreDistribution: { type: [ScoreDistributionSchema], required: true },
      xPtsHome: { type: Number, required: true },
      xPtsAway: { type: Number, required: true },
      homeTeam: { type: String, required: true },
      awayTeam: { type: String, required: true },
    },
    { _id: false }
  );

const ChronicleSchema = new Schema<IChronicleDocument>(
  {
    matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
    kicker: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    sections: { type: [ChronicleSectionSchema], required: true },
    highlights: { type: [ChronicleHighlightSchema], required: true },
    keyStats: { type: [ChronicleKeyStatSchema], required: true },
    timeline: { type: [ChronicleTimelineItemSchema], required: true },
    author: { type: String, required: true },
    sourceLabel: { type: String, required: true },
    generatedAt: { type: String, required: true },
    relatedSimulation: {
      type: ChronicleSimulationSnapshotSchema,
      required: true,
    },
  },
  { timestamps: true }
);

ChronicleSchema.index({ matchId: 1 }, { unique: true });

export const ChronicleModel =
  (mongoose.models.Chronicle as mongoose.Model<IChronicleDocument>) ||
  mongoose.model<IChronicleDocument>("Chronicle", ChronicleSchema);
