import { z } from "genkit";

const MomentumPointSchema = z.object({
  minute: z.number().int().min(0).max(130),
  homeWinProbability: z.number().min(0).max(1),
  drawProbability: z.number().min(0).max(1),
  awayWinProbability: z.number().min(0).max(1),
});

const PlayerStatSchema = z.object({
  playerId: z.string(),
  playerName: z.string(),
  playerShortName: z.string(),
  isHome: z.boolean(),
  goalProbability: z.number().min(0).max(100),
  sga: z.number(),
});

const ScoreDistributionSchema = z.object({
  home: z.number().int().min(0),
  away: z.number().int().min(0),
  count: z.number().int().min(0),
  percentage: z.number().min(0).max(100),
});

const QuoteSchema = z.object({
  text: z.string(),
  attribution: z.string(),
});

const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  paragraphs: z.array(z.string()),
  quote: QuoteSchema.optional(),
});

const HighlightSchema = z.object({
  label: z.string(),
  value: z.string(),
  accent: z.string(),
});

const KeyStatSchema = z.object({
  label: z.string(),
  value: z.string(),
  context: z.string(),
  accent: z.string(),
});

const TimelineEntrySchema = z.object({
  minute: z.string(),
  title: z.string(),
  description: z.string(),
  accent: z.string(),
});

export const ChronicleInputSchema = z.object({
  matchId: z.string(),
  relatedSimulation: z.object({
    awayWinProbability: z.number().min(0).max(1),
    drawProbability: z.number().min(0).max(1),
    homeWinProbability: z.number().min(0).max(1),
    homeScore: z.number().int().min(0),
    awayScore: z.number().int().min(0),
    momentumTimeline: z.array(MomentumPointSchema),
    playerStats: z.array(PlayerStatSchema),
    scoreDistribution: z.array(ScoreDistributionSchema),
    xPtsAway: z.number().min(0),
    xPtsHome: z.number().min(0),
    homeTeam: z.string(),
    awayTeam: z.string(),
  }),
});

export const GeneratedChronicleSchema = z.object({
  kicker: z.string(),
  title: z.string(),
  summary: z.string(),
  sections: z.array(SectionSchema),
  highlights: z.array(HighlightSchema),
  keyStats: z.array(KeyStatSchema),
  timeline: z.array(TimelineEntrySchema),
  author: z.string(),
  sourceLabel: z.string(),
  generatedAt: z.string(),
});
