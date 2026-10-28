import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Film,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  AlertCircle,
  Eye,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { Booking } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { TicketView } from '../components/booking/TicketView.tsx';

export const MyBookingsPage: React.FC = () => {
  const { user, isAuthenticated, quickDemoLogin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTicketModal, setActiveTicketModal] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await api.getMyBookings();
        setBookings(data.bookings);
      } catch (err) {
        console.error('Failed to load my bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [isAuthenticated]);

  const handleCancelBooking = async (id: string) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this booking? Reserved seats will be released.'
    );
    if (!confirmCancel) return;

    try {
      setCancellingId(id);
      await api.cancelBooking(id);
      setActionMessage('Booking cancelled successfully. Reserved seats have been freed.');
      // Refresh list
      const data = await api.getMyBookings();
      setBookings(data.bookings);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-white/10 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <Ticket className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Sign In to View Bookings</h2>
            <p className="text-xs text-slate-400 mt-2">
              Log in to see your confirmed movie passes, QR codes, and previous cinema tickets.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => quickDemoLogin('customer')}
              className="w-full py-3 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>One-Click Demo Customer Sign In</span>
            </button>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                className="py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold text-center border border-white/10"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-500 text-xs font-bold text-center shadow-md shadow-rose-900/30"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
              <Ticket className="w-4 h-4" />
              <span>Cinema Pass History</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              My Movie Bookings
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Showing tickets and digital boarding passes for <strong>{user?.name}</strong> ({user?.email})
            </p>
          </div>

          <Link
            to="/movies"
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-900/40 transition-colors w-fit"
          >
            <Film className="w-4 h-4" />
            <span>Book New Tickets</span>
          </Link>
        </div>

        {actionMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-2">
            <span>{actionMessage}</span>
            <button
              type="button"
              onClick={() => setActionMessage(null)}
              className="text-emerald-400 font-bold hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 bg-slate-900/60 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-white/5 p-8 max-w-md mx-auto space-y-4">
            <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Bookings Yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You haven't booked any movie tickets yet. Browse currently showing blockbusters and reserve your cinema seats today!
            </p>
            <Link
              to="/movies"
              className="inline-flex px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
            >
              Browse Movies Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => {
              const isCancelled = b.bookingStatus === 'cancelled';
              return (
                <div
                  key={b._id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between ${
                    isCancelled
                      ? 'bg-slate-900/50 border-white/5 opacity-70'
                      : 'bg-slate-900/90 border-white/10 hover:border-rose-500/40 shadow-xl'
                  }`}
                >
                  {/* Left: Poster + Movie Details */}
                  <div className="flex gap-4 items-center">
                    {b.movie?.posterUrl && (
                      <img
                        src={b.movie.posterUrl}
                        alt={b.movie.title}
                        className="w-16 h-24 object-cover rounded-xl shadow-md border border-white/10 shrink-0"
                      />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            isCancelled
                              ? 'bg-red-950 text-red-400 border border-red-500/30'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-400">
                          {b.bookingReference}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-white">{b.movie?.title || 'Movie'}</h3>

                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{b.theatre?.name} • {b.showtime?.screen || 'Screen 1'}</span>
                      </p>

                      <p className="text-xs text-slate-300 flex items-center gap-3 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-rose-500" />
                          <span>{b.showtime?.date || new Date(b.createdAt).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-rose-500" />
                          <span>{b.showtime?.time || 'Evening'}</span>
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Middle: Seats & Price */}
                  <div className="flex flex-col md:items-center space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Seats ({b.ticketCount})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {b.selectedSeats.map((seat) => (
                        <span
                          key={seat}
                          className="px-2 py-0.5 bg-rose-600/20 text-rose-300 border border-rose-500/30 rounded text-xs font-bold"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 pt-1">
                      Total: <strong className="text-white">${b.totalAmount.toFixed(2)}</strong>
                    </span>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() => setActiveTicketModal(b)}
                      className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-rose-400" />
                      <span>View Pass</span>
                    </button>

                    {!isCancelled && (
                      <button
                        type="button"
                        disabled={cancellingId === b._id}
                        onClick={() => handleCancelBooking(b._id)}
                        className="px-3 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold border border-red-500/20 transition-colors"
                        title="Cancel booking and release seats"
                      >
                        {cancellingId === b._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {activeTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl my-8">
            <TicketView booking={activeTicketModal} onClose={() => setActiveTicketModal(null)} />
          </div>
        </div>
      )}
    </div>
  );
};
