import mongoose, { Schema, Document } from 'mongoose';

export interface IScreen {
  name: string;
  type: 'IMAX Laser' | 'Dolby Cinema' | '4DX' | 'Standard';
  totalSeats: number;
}

export interface ITheatre extends Document {
  name: string;
  city: string;
  address: string;
  screens: IScreen[];
}

const ScreenSchema = new Schema<IScreen>({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['IMAX Laser', 'Dolby Cinema', '4DX', 'Standard'],
    default: 'Standard',
  },
  totalSeats: { type: Number, default: 80 },
});

const TheatreSchema = new Schema<ITheatre>(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, index: true },
    address: { type: String, required: true },
    screens: [ScreenSchema],
  },
  { timestamps: true }
);

export const TheatreModel = mongoose.models.Theatre || mongoose.model<ITheatre>('Theatre', TheatreSchema);
