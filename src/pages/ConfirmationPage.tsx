import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Ticket, ArrowRight, Home, Sparkles } from 'lucide-react';
import { TicketView } from '../components/booking/TicketView.tsx';
import { Booking } from '../types/index.ts';
import { api } from '../services/api.ts';

export const ConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [booking, setBooking] = useState<Booking | null>(
    (location.state as any)?.booking || null
  );
  const [loading, setLoading] = useState<boolean>(!booking);

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f43f5e', '#fb7185', '#38bdf8', '#fbbf24'],
      });
    } catch {
      // safe fallback
    }

    async function loadBooking() {
      if (!booking && id) {
        try {
          setLoading(true);
          const data = await api.getBookingById(id);
          setBooking(data.booking);
        } catch (err) {
          console.error('Failed to fetch booking confirmation:', err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold">Booking Not Found</h2>
        <Link to="/movies" className="mt-4 px-4 py-2 bg-rose-600 rounded-lg text-sm font-semibold">
          Return to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Celebration Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/40 animate-in zoom-in-75">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <span className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Booking Successfully Confirmed
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            You're Going To The Movies!
          </h1>

          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Your booking reference is{' '}
            <strong className="text-rose-400 font-mono tracking-wider">{booking.bookingReference}</strong>.
            A copy of this digital pass has been added to your account bookings.
          </p>
        </div>

        {/* Digital Ticket Pass View */}
        <TicketView booking={booking} />

        {/* Post-booking Navigation CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/my-bookings"
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-white/10 transition-colors shadow-lg"
          >
            <Ticket className="w-4 h-4 text-rose-500" />
            <span>Go to My Bookings</span>
          </Link>

          <Link
            to="/movies"
            className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 transition-colors"
          >
            <span>Book Another Movie</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/"
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs flex items-center gap-1.5 border border-white/5 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
