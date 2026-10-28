import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Film,
  Building,
  Calendar,
  Ticket,
  DollarSign,
  Users,
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { DashboardStats, Movie, Theatre, Showtime, Booking } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, quickDemoLogin } = useAuth();

  const [activeTab, setActiveTab] = useState<'stats' | 'movies' | 'theatres' | 'showtimes' | 'bookings'>('stats');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal forms states
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [showAddTheatreModal, setShowAddTheatreModal] = useState(false);
  const [showAddShowtimeModal, setShowAddShowtimeModal] = useState(false);

  // New movie form state
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 140,
    rating: 8.2,
    releaseDate: new Date().toISOString().split('T')[0],
    cast: 'Lead Actor, Co-Star',
    director: 'Director Name',
    status: 'now_showing' as const,
    certificate: 'PG-13',
  });

  // New theatre form state
  const [newTheatre, setNewTheatre] = useState({
    name: '',
    city: 'New York',
    address: '',
  });

  // New showtime form state
  const [newShowtime, setNewShowtime] = useState({
    movieId: '',
    theatreId: '',
    screen: 'Auditorium 1 (IMAX)',
    screenType: 'IMAX Laser' as const,
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    ticketPrice: 18,
  });

  useEffect(() => {
    async function fetchAllData() {
      if (!isAdmin) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [statsRes, moviesRes, theatresRes, showtimesRes, bookingsRes] = await Promise.all([
          api.getAdminDashboard(),
          api.getMovies(),
          api.getTheatres(),
          api.getShowtimes({}),
          api.getAdminBookings(),
        ]);
        setStats(statsRes.stats);
        setMovies(moviesRes.movies);
        setTheatres(theatresRes.theatres);
        setShowtimes(showtimesRes.showtimes);
        setBookings(bookingsRes.bookings);

        // Pre-select first movie & theatre for showtime modal
        if (moviesRes.movies.length > 0) {
          setNewShowtime((prev) => ({ ...prev, movieId: moviesRes.movies[0]._id }));
        }
        if (theatresRes.theatres.length > 0) {
          setNewShowtime((prev) => ({ ...prev, theatreId: theatresRes.theatres[0]._id }));
        }
      } catch (err: any) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, [isAdmin]);

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createMovie({
        ...newMovie,
        genre: newMovie.genre.split(',').map((s) => s.trim()),
        cast: newMovie.cast.split(',').map((s) => s.trim()),
      });
      setShowAddMovieModal(false);
      setFeedbackMessage({ type: 'success', text: `Movie "${newMovie.title}" created successfully.` });
      // Refresh
      const mRes = await api.getMovies();
      setMovies(mRes.movies);
      const sRes = await api.getAdminDashboard();
      setStats(sRes.stats);
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to add movie.' });
    }
  };

  const handleDeleteMovie = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This will also remove its showtimes.`)) return;
    try {
      await api.deleteMovie(id);
      setFeedbackMessage({ type: 'success', text: `Movie deleted.` });
      setMovies((prev) => prev.filter((m) => m._id !== id));
      const sRes = await api.getAdminDashboard();
      setStats(sRes.stats);
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message });
    }
  };

  const handleCreateTheatre = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTheatre({
        ...newTheatre,
        screens: [
          { name: 'Screen 1 IMAX Experience', type: 'IMAX Laser', totalSeats: 80 },
          { name: 'Screen 2 Dolby Atmos', type: 'Dolby Cinema', totalSeats: 80 },
          { name: 'Screen 3 Standard', type: 'Standard', totalSeats: 70 },
        ],
      });
      setShowAddTheatreModal(false);
      setFeedbackMessage({ type: 'success', text: `Theatre "${newTheatre.name}" created.` });
      const tRes = await api.getTheatres();
      setTheatres(tRes.theatres);
      const sRes = await api.getAdminDashboard();
      setStats(sRes.stats);
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message });
    }
  };

  const handleDeleteTheatre = async (id: string, name: string) => {
    if (!window.confirm(`Delete theatre "${name}"?`)) return;
    try {
      await api.deleteTheatre(id);
      setFeedbackMessage({ type: 'success', text: `Theatre deleted.` });
      setTheatres((prev) => prev.filter((t) => t._id !== id));
      const sRes = await api.getAdminDashboard();
      setStats(sRes.stats);
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message });
    }
  };

  const handleCreateShowtime = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createShowtime({
        ...newShowtime,
        ticketPrice: Number(newShowtime.ticketPrice),
        tierPricing: {
          Standard: Number(newShowtime.ticketPrice),
          Premium: Number(newShowtime.ticketPrice) + 4,
          VIP: Number(newShowtime.ticketPrice) + 10,
        },
      });
      setShowAddShowtimeModal(false);
      setFeedbackMessage({ type: 'success', text: 'New showtime scheduled successfully!' });
      const stRes = await api.getShowtimes({});
      setShowtimes(stRes.showtimes);
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message });
    }
  };

  const handleDeleteShowtime = async (id: string) => {
    if (!window.confirm('Delete this showtime?')) return;
    try {
      await api.deleteShowtime(id);
      setFeedbackMessage({ type: 'success', text: 'Showtime deleted.' });
      setShowtimes((prev) => prev.filter((st) => st._id !== id));
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message });
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-white/10 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Administrator Access Required</h2>
            <p className="text-xs text-slate-400 mt-2">
              This dashboard is protected by role-based authorization. Only administrators may view stats and manage movies, theatres, and bookings.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => quickDemoLogin('admin')}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>One-Click Sign In as Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Management Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Cinema Admin Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Logged in as <strong>{user?.name}</strong> • Real-time booking telemetry and catalogue controls
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddMovieModal(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-900/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Movie</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddShowtimeModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Showtime</span>
            </button>
          </div>
        </div>

        {/* Feedback alert */}
        {feedbackMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/80 border-red-500/40 text-red-300'
            }`}
          >
            <span>{feedbackMessage.text}</span>
            <button
              type="button"
              onClick={() => setFeedbackMessage(null)}
              className="font-bold hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Statistics Tiles Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Total Bookings
              </span>
              <p className="text-2xl font-black text-white">{stats.totalBookings}</p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Confirmed
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Demo Revenue
              </span>
              <p className="text-2xl font-black text-emerald-400">${stats.totalRevenue.toFixed(2)}</p>
              <span className="text-[10px] text-slate-400">Simulated sales</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Tickets Issued
              </span>
              <p className="text-2xl font-black text-rose-500">{stats.totalTicketsSold}</p>
              <span className="text-[10px] text-slate-400">Total seats booked</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Active Movies
              </span>
              <p className="text-2xl font-black text-white">{stats.totalMovies}</p>
              <span className="text-[10px] text-slate-400">In catalogue</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Theatres
              </span>
              <p className="text-2xl font-black text-white">{stats.totalTheatres}</p>
              <span className="text-[10px] text-slate-400">Across 5 cities</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Avg Occupancy
              </span>
              <p className="text-2xl font-black text-amber-400">{stats.occupancyRate}%</p>
              <span className="text-[10px] text-slate-400">Auditorium load</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
          {[
            { id: 'stats', label: 'Recent Activity' },
            { id: 'movies', label: `Movies (${movies.length})` },
            { id: 'theatres', label: `Theatres (${theatres.length})` },
            { id: 'showtimes', label: `Showtimes (${showtimes.length})` },
            { id: 'bookings', label: `All Bookings (${bookings.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Recent Activity */}
        {activeTab === 'stats' && (
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base">Recent Transactions & Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Movie</th>
                    <th className="p-3">Seats</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats?.recentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-white/5">
                      <td className="p-3 font-mono font-bold text-rose-400">{b.bookingReference}</td>
                      <td className="p-3">
                        <span className="font-semibold text-white block">{b.user?.name || 'Customer'}</span>
                        <span className="text-[10px] text-slate-500">{b.user?.email}</span>
                      </td>
                      <td className="p-3 font-medium text-white">{b.movie?.title}</td>
                      <td className="p-3">{b.selectedSeats.join(', ')}</td>
                      <td className="p-3 font-bold text-emerald-400">${b.totalAmount.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Movies Management */}
        {activeTab === 'movies' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddMovieModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add New Movie
              </button>
            </div>

            <div className="bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-3">Movie</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Language</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {movies.map((m) => (
                      <tr key={m._id} className="hover:bg-white/5">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={m.posterUrl}
                            alt={m.title}
                            className="w-10 h-14 object-cover rounded-lg shrink-0 border border-white/10"
                          />
                          <div>
                            <span className="font-bold text-white text-sm block">{m.title}</span>
                            <span className="text-[10px] text-slate-400">{m.genre.join(', ')}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                              m.status === 'now_showing'
                                ? 'bg-rose-950 text-rose-300 border-rose-500/30'
                                : 'bg-indigo-950 text-indigo-300 border-indigo-500/30'
                            }`}
                          >
                            {m.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                          </span>
                        </td>
                        <td className="p-3">{m.language}</td>
                        <td className="p-3">{m.duration} mins</td>
                        <td className="p-3 font-bold text-amber-400">★ {m.rating.toFixed(1)}</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteMovie(m._id, m.title)}
                            className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                            title="Delete Movie"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Theatres Management */}
        {activeTab === 'theatres' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddTheatreModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Theatre Venue
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {theatres.map((th) => (
                <div key={th._id} className="p-5 rounded-3xl bg-slate-900 border border-white/10 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-base">{th.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{th.address}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteTheatre(th._id, th.name)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/50"
                      title="Delete theatre"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">City & Screens:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] font-bold">
                        {th.city}
                      </span>
                      {th.screens.map((sc) => (
                        <span key={sc.name} className="px-2 py-0.5 bg-slate-800/60 text-slate-400 rounded text-[10px]">
                          {sc.type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Showtimes */}
        {activeTab === 'showtimes' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddShowtimeModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Schedule Showtime
              </button>
            </div>

            <div className="bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-3">Movie</th>
                      <th className="p-3">Theatre Venue</th>
                      <th className="p-3">Screen Format</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Booked Seats</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {showtimes.map((st) => (
                      <tr key={st._id} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-white">{st.movie?.title || st.movieId}</td>
                        <td className="p-3 text-slate-300">{st.theatre?.name || st.theatreId}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-rose-300">
                            {st.screenType}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-white">
                          {st.date} • {st.time}
                        </td>
                        <td className="p-3">
                          {st.bookedSeats?.length || 0} / 80 seats ({st.bookedSeats?.join(', ') || 'None'})
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteShowtime(st._id)}
                            className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60"
                            title="Delete Showtime"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: All Customer Bookings */}
        {activeTab === 'bookings' && (
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="p-3">Ref Code</th>
                    <th className="p-3">User Email</th>
                    <th className="p-3">Movie</th>
                    <th className="p-3">Theatre</th>
                    <th className="p-3">Seats</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-white/5">
                      <td className="p-3 font-mono font-bold text-rose-400">{b.bookingReference}</td>
                      <td className="p-3 text-slate-300">{b.user?.email || b.userId}</td>
                      <td className="p-3 font-semibold text-white">{b.movie?.title}</td>
                      <td className="p-3">{b.theatre?.name}</td>
                      <td className="p-3 font-bold text-white">{b.selectedSeats.join(', ')}</td>
                      <td className="p-3 font-bold text-emerald-400">${b.totalAmount.toFixed(2)}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.bookingStatus === 'confirmed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : 'bg-red-950 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Add Movie */}
      {showAddMovieModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 my-8">
            <h3 className="text-xl font-bold text-white">Add New Movie to Catalogue</h3>
            <form onSubmit={handleCreateMovie} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  placeholder="e.g. Mission: Impossible 8"
                  className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description / Synopsis</label>
                <textarea
                  required
                  rows={3}
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                  placeholder="Movie plot overview..."
                  className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Poster Image URL</label>
                  <input
                    type="url"
                    required
                    value={newMovie.posterUrl}
                    onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Backdrop Image URL</label>
                  <input
                    type="url"
                    value={newMovie.backdropUrl}
                    onChange={(e) => setNewMovie({ ...newMovie, backdropUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    value={newMovie.duration}
                    onChange={(e) => setNewMovie({ ...newMovie, duration: Number(e.target.value) })}
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rating (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMovie.rating}
                    onChange={(e) => setNewMovie({ ...newMovie, rating: Number(e.target.value) })}
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={newMovie.status}
                    onChange={(e) => setNewMovie({ ...newMovie, status: e.target.value as any })}
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                  >
                    <option value="now_showing">Now Showing</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Director</label>
                  <input
                    type="text"
                    value={newMovie.director}
                    onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Genres (comma separated)</label>
                  <input
                    type="text"
                    value={newMovie.genre}
                    onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddMovieModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Theatre */}
      {showAddTheatreModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-white">Add Theatre Venue</h3>
            <form onSubmit={handleCreateTheatre} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Theatre Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cineplex Paramount Square"
                  value={newTheatre.name}
                  onChange={(e) => setNewTheatre({ ...newTheatre, name: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">City</label>
                <select
                  value={newTheatre.city}
                  onChange={(e) => setNewTheatre({ ...newTheatre, city: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                >
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="Austin">Austin</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Full Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="123 Cinema Blvd..."
                  value={newTheatre.address}
                  onChange={(e) => setNewTheatre({ ...newTheatre, address: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddTheatreModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Create Theatre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Showtime */}
      {showAddShowtimeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-white">Schedule New Showtime</h3>
            <form onSubmit={handleCreateShowtime} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Movie</label>
                <select
                  required
                  value={newShowtime.movieId}
                  onChange={(e) => setNewShowtime({ ...newShowtime, movieId: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Select Theatre</label>
                <select
                  required
                  value={newShowtime.theatreId}
                  onChange={(e) => setNewShowtime({ ...newShowtime, theatreId: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                >
                  {theatres.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Screen Name</label>
                  <input
                    type="text"
                    required
                    value={newShowtime.screen}
                    onChange={(e) => setNewShowtime({ ...newShowtime, screen: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Screen Type</label>
                  <select
                    value={newShowtime.screenType}
                    onChange={(e) => setNewShowtime({ ...newShowtime, screenType: e.target.value as any })}
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                  >
                    <option value="IMAX Laser">IMAX Laser</option>
                    <option value="Dolby Cinema">Dolby Cinema</option>
                    <option value="4DX">4DX</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newShowtime.date}
                    onChange={(e) => setNewShowtime({ ...newShowtime, date: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Time (HH:MM)</label>
                  <input
                    type="text"
                    required
                    placeholder="19:30"
                    value={newShowtime.time}
                    onChange={(e) => setNewShowtime({ ...newShowtime, time: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Base Ticket Price ($)</label>
                <input
                  type="number"
                  required
                  value={newShowtime.ticketPrice}
                  onChange={(e) => setNewShowtime({ ...newShowtime, ticketPrice: Number(e.target.value) })}
                  className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-white/10"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddShowtimeModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Add Showtime
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
