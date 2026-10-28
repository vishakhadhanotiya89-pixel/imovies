import { Response } from 'express';
import { dbStore, ROW_CONFIG } from '../db/store.ts';
import { AuthRequest } from '../middleware/auth.ts';
import {
  calculateBookingPrice,
  validateSeatLimit,
  generateBookingReference,
} from '../../src/utils/pricing.ts';

export function createBooking(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to complete booking.' });
    }

    const { showtimeId, selectedSeats, paymentMethod } = req.body;

    if (!showtimeId) {
      return res.status(400).json({ error: 'Showtime ID is required.' });
    }

    if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({ error: 'Please select at least 1 seat.' });
    }

    // Validate seat limits (max 8 seats)
    const limitCheck = validateSeatLimit(selectedSeats.length, 8);
    if (!limitCheck.valid) {
      return res.status(400).json({ error: limitCheck.error });
    }

    const showtime = dbStore.getShowtimeById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ error: 'Selected showtime not found or no longer available.' });
    }

    // Securely calculate prices on the server based on seat tiers
    const seatPrices: number[] = [];
    for (const seatStr of selectedSeats) {
      const row = seatStr.charAt(0).toUpperCase();
      const rowCfg = ROW_CONFIG.find((r) => r.row === row);
      const tier = rowCfg ? rowCfg.tier : 'Standard';
      const price = showtime.tierPricing[tier] || showtime.ticketPrice;
      seatPrices.push(price);
    }

    const priceBreakdown = calculateBookingPrice(seatPrices);
    const bookingRef = generateBookingReference();

    // Atomic seat locking & booking creation
    const result = dbStore.bookSeatsAtomically(showtimeId, selectedSeats, {
      bookingReference: bookingRef,
      userId,
      showtimeId,
      movieId: showtime.movieId,
      theatreId: showtime.theatreId,
      selectedSeats,
      ticketCount: selectedSeats.length,
      subtotal: priceBreakdown.subtotal,
      convenienceFee: priceBreakdown.convenienceFee,
      tax: priceBreakdown.tax,
      totalAmount: priceBreakdown.total,
      paymentStatus: 'completed',
      paymentMethod: paymentMethod || 'Demo Pay / Simulated Card',
    });

    if (!result.success) {
      return res.status(409).json({ error: result.error });
    }

    return res.status(201).json({
      message: 'Booking confirmed successfully!',
      booking: result.booking,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create booking.' });
  }
}

export function getUserBookings(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const bookings = dbStore.getUserBookings(userId);
    return res.status(200).json({ bookings, total: bookings.length });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch your bookings.' });
  }
}

export function getBookingById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const booking = dbStore.getBookingById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (req.user?.role !== 'admin' && booking.userId !== req.user?._id) {
      return res.status(403).json({ error: 'Access denied: You do not have permission to view this ticket.' });
    }

    return res.status(200).json({ booking });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch booking.' });
  }
}

export function cancelBooking(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const cancelled = dbStore.cancelBooking(id, userId);
    if (!cancelled) {
      return res.status(404).json({ error: 'Booking not found or already cancelled.' });
    }

    return res.status(200).json({ message: 'Booking cancelled successfully. Refund processed to demo account.', booking: cancelled });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to cancel booking.' });
  }
}
