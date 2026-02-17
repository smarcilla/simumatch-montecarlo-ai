// src/infrastructure/db/models/season.model.ts

import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISeasonDocument extends Document {
  name: string; // "LaLiga 25/26"
  seasonYear: string; // "25/26"
  leagueId: Types.ObjectId; // ← CLAVE: Pertenece a una liga específica
  externalId?: string; // ID de API externa (si existe)
}

const SeasonSchema = new Schema<ISeasonDocument>(
  {
    name: { type: String, required: true },
    seasonYear: { type: String, required: true },
    leagueId: { type: Schema.Types.ObjectId, ref: "League", required: true },
    externalId: { type: String },
  },
  { timestamps: true }
);

// Índice compuesto: Una temporada es única dentro de una liga
SeasonSchema.index({ leagueId: 1, name: 1 }, { unique: true });
SeasonSchema.index({ leagueId: 1, seasonYear: -1 });

export const SeasonModel =
  mongoose.models.Season ||
  mongoose.model<ISeasonDocument>("Season", SeasonSchema);
