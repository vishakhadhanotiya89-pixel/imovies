import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  ShieldCheck,
  Film,
  MapPin,
  Calendar,
  Clock,
  Armchair,
  AlertCircle,
  ChevronLeft,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { calculateBookingPrice } from '../utils/pricing.ts';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedMovie, selectedTheatre, selectedShowtime, selectedSeats } = useBooking();
  const { user, isAuthenticated, quickDemoLogin } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'demo_card' | 'demo_upi' | 'demo_applepay'>('demo_card');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If missing prerequisites, redirect to movies
  if (!selectedShowtime || !selectedMovie || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold">No active booking session found</h2>
        <p className="text-xs text-slate-400 mt-2">Please select a movie and seats first.</p>
        <Link to="/movies" className="mt-4 px-5 py-2.5 bg-rose-600 rounded-xl text-xs font-bold">
          Browse Movies
        </Link>
      </div>
    );
  }

  // Calculate pricing
  const seatPrices = selectedSeats.map((seatStr) => {
    const row = seatStr.charAt(0).toUpperCase();
    const tier = ['H', 'J'].includes(row) ? 'VIP' : ['E', 'F', 'G'].includes(row) ? 'Premium' : 'Standard';
    return selectedShowtime.tierPricing[tier] || selectedShowtime.ticketPrice;
  });

  const priceBreakdown = calculateBookingPrice(seatPrices);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // If not authenticated, prompt demo login
    if (!isAuthenticated) {
      setErrorMessage('Please sign in to confirm and save your booking.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createBooking({
        showtimeId: selectedShowtime._id,
        selectedSeats,
        paymentMethod:
          paymentMethod === 'demo_card'
            ? 'Demo Credit Card (Simulated)'
            : paymentMethod === 'demo_upi'
            ? 'Demo UPI / Instant Pay (Simulated)'
            : 'Demo Apple Pay (Simulated)',
      });

      // Navigate to confirmation page
      navigate(`/confirmation/${res.booking._id}`, { state: { booking: res.booking } });
    } catch (err: any) {
      setErrorMessage(err.message || 'Booking failed. Some seats may have already been reserved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Back Nav */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Modify Seat Selection</span>
          </button>
          <span className="text-xs text-rose-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted Simulated Checkout
          </span>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => quickDemoLogin('customer')}
                className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold hover:bg-amber-500/30 whitespace-nowrap"
              >
                1-Click Sign In
              </button>
            )}
          </div>
        )}

        {/* Checkout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Booking Review & Payment simulation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details Card */}
            <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <Film className="w-5 h-5 text-rose-500" />
                <span>Review Order Details</span>
              </h2>

              <div className="flex gap-4 items-start">
                <img
                  src={selectedMovie.posterUrl}
                  alt={selectedMovie.title}
                  className="w-20 h-28 object-cover rounded-xl shadow-md border border-white/10 shrink-0"
                />
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-xl font-black text-white">{selectedMovie.title}</h3>
                  <p className="text-xs text-slate-400">
                    {selectedMovie.language} • {selectedMovie.duration} mins • {selectedMovie.certificate}
                  </p>
                  <p className="text-xs text-rose-400 font-semibold mt-1">
                    {selectedShowtime.screen} ({selectedShowtime.screenType})
                  </p>
                </div>
              </div>

              {/* Venue and Time Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-white/5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                    Cinema Venue
                  </span>
                  <p className="font-bold text-white text-sm mt-0.5">{selectedTheatre?.name}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{selectedTheatre?.address}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                    Screening Date & Time
                  </span>
                  <p className="font-bold text-white text-sm mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>{selectedShowtime.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>{selectedShowtime.time}</span>
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Please arrive 15 minutes before showtime</p>
                </div>
              </div>

              {/* Reserved Seats List */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Armchair className="w-4 h-4 text-rose-500" />
                    <span>Reserved Seats ({selectedSeats.length} Tickets)</span>
                  </span>
                  <span className="text-slate-400 text-[11px]">Seat allocation confirmed</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-black shadow-sm"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated Payment Gateway Card */}
            <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span>Demo Payment Method</span>
                </h2>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Sandbox Mode
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <span>College Project Simulation Notice</span>
                </p>
                <p className="text-amber-300/80 leading-relaxed text-[11px]">
                  This is a demonstration system. No real card details are collected, and no actual financial transaction will take place.
                </p>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('demo_card')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'demo_card'
                      ? 'bg-rose-600/15 border-rose-500 text-white shadow-lg'
                      : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-rose-500 mb-2" />
                  <span className="font-bold text-xs block text-white">Simulated Card</span>
                  <span className="text-[10px] text-slate-400">Visa / Mastercard / Amex</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('demo_upi')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'demo_upi'
                      ? 'bg-rose-600/15 border-rose-500 text-white shadow-lg'
                      : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
                  <span className="font-bold text-xs block text-white">Demo UPI / NetBank</span>
                  <span className="text-[10px] text-slate-400">Instant Virtual Pin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('demo_applepay')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'demo_applepay'
                      ? 'bg-rose-600/15 border-rose-500 text-white shadow-lg'
                      : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-5 h-5 text-cyan-400 mb-2" />
                  <span className="font-bold text-xs block text-white">One-Click Wallet</span>
                  <span className="text-[10px] text-slate-400">Demo Apple/Google Pay</span>
                </button>
              </div>

              {/* Demo Card Fields Mock */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-white/5 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">
                    Demo Cardholder Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.name || 'Alex Rivera (Demo Customer)'}
                    className="w-full bg-slate-900 text-slate-300 px-3 py-2 rounded-xl border border-white/10 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">
                      Demo Card Number
                    </label>
                    <input
                      type="text"
                      disabled
                      value="•••• •••• •••• 4242"
                      className="w-full bg-slate-900 text-slate-400 px-3 py-2 rounded-xl border border-white/10 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">
                      Expiry & CVV
                    </label>
                    <input
                      type="text"
                      disabled
                      value="12/28 • 888"
                      className="w-full bg-slate-900 text-slate-400 px-3 py-2 rounded-xl border border-white/10 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Total */}
          <div className="space-y-6">
            <div className="bg-slate-900/95 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl sticky top-28">
              <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3">
                Order Summary
              </h2>

              {/* Pricing breakdown */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Tickets Subtotal ({selectedSeats.length} seats)</span>
                  <span className="font-bold text-white">${priceBreakdown.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1">
                    <span>Convenience Fee</span>
                    <span className="text-[10px] text-slate-500">($1.75 / ticket)</span>
                  </span>
                  <span className="font-medium text-slate-200">
                    ${priceBreakdown.convenienceFee.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1">
                    <span>Integrated Cinema Tax</span>
                    <span className="text-[10px] text-slate-500">(8%)</span>
                  </span>
                  <span className="font-medium text-slate-200">${priceBreakdown.tax.toFixed(2)}</span>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-base">
                  <span className="font-bold text-white">Grand Total</span>
                  <span className="font-black text-2xl text-emerald-400">
                    ${priceBreakdown.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* User Auth Status */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 text-xs space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Ticket Recipient
                </span>
                {isAuthenticated ? (
                  <p className="font-semibold text-slate-200 truncate">
                    {user?.name} ({user?.email})
                  </p>
                ) : (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-amber-400 text-[11px]">Not signed in</span>
                    <button
                      type="button"
                      onClick={() => quickDemoLogin('customer')}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold"
                    >
                      Quick Sign In
                    </button>
                  </div>
                )}
              </div>

              {/* Confirm & Book CTA */}
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmBooking}
                className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-xl shadow-rose-900/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Reserving Seats...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ${priceBreakdown.total.toFixed(2)} & Book</span>
                  </div>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Ticket Generation with Unique QR Code</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
