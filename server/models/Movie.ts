import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  genre: string[];
  language: string;
  duration: number;
  rating: number;
  releaseDate: string;
  cast: string[];
  director: string;
  status: 'now_showing' | 'coming_soon';
  certificate?: string;
  trailerUrl?: string;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    posterUrl: { type: String, required: true },
    backdropUrl: { type: String, required: true },
    genre: [{ type: String, required: true, index: true }],
    language: { type: String, required: true, index: true },
    duration: { type: Number, required: true },
    rating: { type: Number, required: true, min: 0, max: 10 },
    releaseDate: { type: String, required: true },
    cast: [{ type: String }],
    director: { type: String, required: true },
    status: { type: String, enum: ['now_showing', 'coming_soon'], required: true, index: true },
    certificate: { type: String, default: 'PG-13' },
    trailerUrl: { type: String },
  },
  { timestamps: true }
);

export const MovieModel = mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);
