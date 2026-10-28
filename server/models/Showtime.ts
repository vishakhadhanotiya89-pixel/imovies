import mongoose, { Schema, Document } from 'mongoose';

export interface IShowtime extends Document {
  movieId: mongoose.Types.ObjectId;
  theatreId: mongoose.Types.ObjectId;
  screen: string;
  screenType: 'IMAX Laser' | 'Dolby Cinema' | '4DX' | 'Standard';
  date: string;
  time: string;
  ticketPrice: number;
  tierPricing: {
    Standard: number;
    Premium: number;
    VIP: number;
  };
  bookedSeats: string[];
}

const ShowtimeSchema = new Schema<IShowtime>(
  {
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
    theatreId: { type: Schema.Types.ObjectId, ref: 'Theatre', required: true, index: true },
    screen: { type: String, required: true },
    screenType: {
      type: String,
      enum: ['IMAX Laser', 'Dolby Cinema', '4DX', 'Standard'],
      default: 'Standard',
    },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // e.g. "19:00"
    ticketPrice: { type: Number, required: true },
    tierPricing: {
      Standard: { type: Number, default: 14 },
      Premium: { type: Number, default: 18 },
      VIP: { type: Number, default: 24 },
    },
    bookedSeats: [{ type: String }],
  },
  { timestamps: true }
);

// Compound index to quickly find showtimes by movie, theatre, and date
ShowtimeSchema.index({ movieId: 1, theatreId: 1, date: 1 });

export const ShowtimeModel = mongoose.models.Showtime || mongoose.model<IShowtime>('Showtime', ShowtimeSchema);
