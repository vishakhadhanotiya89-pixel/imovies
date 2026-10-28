import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingReference: string;
  userId: mongoose.Types.ObjectId;
  showtimeId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  theatreId: mongoose.Types.ObjectId;
  selectedSeats: string[];
  ticketCount: number;
  subtotal: number;
  convenienceFee: number;
  tax: number;
  totalAmount: number;
  paymentStatus: 'completed' | 'pending' | 'refunded';
  bookingStatus: 'confirmed' | 'cancelled';
  paymentMethod: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingReference: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    showtimeId: { type: Schema.Types.ObjectId, ref: 'Showtime', required: true, index: true },
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
    theatreId: { type: Schema.Types.ObjectId, ref: 'Theatre', required: true, index: true },
    selectedSeats: [{ type: String, required: true }],
    ticketCount: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    convenienceFee: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['completed', 'pending', 'refunded'],
      default: 'completed',
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    paymentMethod: { type: String, default: 'Simulated Card / Demo Pay' },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
