import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Ticket, AlertCircle, ArrowRight, Clock, MapPin, Calendar, Film } from 'lucide-react';
import { SeatLayout } from '../components/booking/SeatLayout.tsx';
import { Showtime, SeatInfo } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useBooking } from '../context/BookingContext.tsx';
import { calculateBookingPrice, validateSeatLimit } from '../utils/pricing.ts';

export const SeatSelectionPage: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  const {
    selectedSeats,
    toggleSeat,
    clearSeats,
    setSelectedShowtime,
    setSelectedMovie,
    setSelectedTheatre,
  } = useBooking();

  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [seats, setSeats] = useState<SeatInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Clear previously selected seats when entering seat selection
    clearSeats();

    async function loadSeats() {
      if (!showtimeId) return;
      try {
        setLoading(true);
        const data = await api.getShowtimeSeats(showtimeId);
        setShowtime(data.showtime);
        setSeats(data.seats);

        setSelectedShowtime(data.showtime);
        if (data.showtime.movie) setSelectedMovie(data.showtime.movie);
        if (data.showtime.theatre) setSelectedTheatre(data.showtime.theatre);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load cinema seats.');
      } finally {
        setLoading(false);
      }
    }
    loadSeats();
  }, [showtimeId]);

  const handleSeatClick = (seatNumber: string) => {
    setErrorMessage(null);
    const result = toggleSeat(seatNumber);
    if (!result.added && result.error) {
      setErrorMessage(result.error);
    }
  };

  // Compute selected seats prices
  const selectedSeatPrices = selectedSeats.map((seatNum) => {
    const s = seats.find((item) => item.seatNumber === seatNum);
    return s?.price || showtime?.ticketPrice || 15;
  });

  const priceBreakdown = calculateBookingPrice(selectedSeatPrices);

  const handleProceedToCheckout = () => {
    const validation = validateSeatLimit(selectedSeats.length, 8);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Please select at least 1 seat.');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold">Showtime not found</h2>
        <Link to="/movies" className="mt-4 px-4 py-2 bg-rose-600 rounded-lg text-sm font-semibold">
          Return to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <div className="bg-slate-900 border-b border-white/10 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-white leading-tight">
                {showtime.movie?.title || 'Selected Movie'}
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="text-rose-400 font-semibold">{showtime.theatre?.name}</span>
                <span>•</span>
                <span>{showtime.screen} ({showtime.screenType})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span>{showtime.date}</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-bold text-white">{showtime.time}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Seat Layout Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col items-center">
        {/* Step indicator */}
        <div className="w-full max-w-md mx-auto mb-6 flex items-center justify-between text-xs font-semibold text-slate-400">
          <span className="text-rose-500 font-bold flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">
              1
            </span>
            Choose Seats
          </span>
          <div className="flex-1 h-0.5 bg-white/10 mx-3" />
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px]">
              2
            </span>
            Checkout
          </span>
          <div className="flex-1 h-0.5 bg-white/10 mx-3" />
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px]">
              3
            </span>
            Ticket Pass
          </span>
        </div>

        {/* Seat Layout */}
        <SeatLayout
          showtime={showtime}
          seats={seats}
          selectedSeats={selectedSeats}
          onToggleSeat={handleSeatClick}
          error={errorMessage}
        />
      </main>

      {/* Sticky Bottom Booking Summary Bar */}
      <div className="sticky bottom-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-white/10 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Selected Seats summary */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Selected Seats:
                </span>
                <span className="text-sm font-extrabold text-white">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
                </span>
                <span className="text-[11px] text-slate-500">
                  ({selectedSeats.length} / 8 max)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Subtotal: <strong className="text-white">${priceBreakdown.subtotal.toFixed(2)}</strong> + taxes & fees
              </p>
            </div>
          </div>

          {/* Price & Checkout CTA */}
          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                Est. Total (incl. tax & fees)
              </span>
              <span className="text-2xl font-black text-rose-500">
                ${priceBreakdown.total.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              disabled={selectedSeats.length === 0}
              onClick={handleProceedToCheckout}
              className={`px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
                selectedSeats.length > 0
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 hover:scale-[1.02] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
              }`}
            >
              <span>Continue to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
