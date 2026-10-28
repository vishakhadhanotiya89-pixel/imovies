import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  Calendar,
  MapPin,
  Ticket,
  Play,
  Film,
  Sparkles,
  ChevronLeft,
  Tv,
} from 'lucide-react';
import { Movie, Theatre, Showtime } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useBooking } from '../context/BookingContext.tsx';
import { formatDuration } from '../components/movies/MovieCard.tsx';

const CITIES = ['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Austin'];

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedCity, setSelectedCity, setSelectedMovie, setSelectedShowtime, setSelectedTheatre } =
    useBooking();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showTrailer, setShowTrailer] = useState<boolean>(false);

  // Generate 4 consecutive days
  const dateOptions = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, dayLabel, formatted };
  });

  useEffect(() => {
    async function fetchMovieDetails() {
      if (!id) return;
      try {
        setLoading(true);
        const [movieData, showtimeData, theatreData] = await Promise.all([
          api.getMovieById(id),
          api.getShowtimes({ movieId: id, city: selectedCity, date: selectedDate }),
          api.getTheatres(selectedCity),
        ]);
        setMovie(movieData.movie);
        setShowtimes(showtimeData.showtimes);
        setTheatres(theatreData.theatres);
      } catch (err) {
        console.error('Failed to load movie details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovieDetails();
  }, [id, selectedCity, selectedDate]);

  const handleSelectShowtime = (st: Showtime, th?: Theatre) => {
    if (movie) setSelectedMovie(movie);
    setSelectedShowtime(st);
    if (th) setSelectedTheatre(th);
    navigate(`/seat-selection/${st._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold">Movie not found</h2>
        <Link to="/movies" className="mt-4 px-4 py-2 bg-rose-600 rounded-lg text-sm font-semibold">
          Back to Movies
        </Link>
      </div>
    );
  }

  // Group showtimes by theatre
  const showtimesByTheatre = new Map<string, Showtime[]>();
  showtimes.forEach((st) => {
    if (!showtimesByTheatre.has(st.theatreId)) {
      showtimesByTheatre.set(st.theatreId, []);
    }
    showtimesByTheatre.get(st.theatreId)!.push(st);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Backdrop Hero Header */}
      <div className="relative w-full h-[55vh] min-h-[400px] max-h-[600px] overflow-hidden">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <Link
            to="/movies"
            className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 backdrop-blur-md transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Movies</span>
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 relative z-20 space-y-12 pb-20">
        {/* Movie Header Card */}
        <div className="bg-slate-900/95 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row gap-8 items-start">
          {/* Poster */}
          <div className="w-48 sm:w-60 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl shrink-0 bg-slate-950">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${
                  movie.status === 'now_showing'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                    : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30'
                }`}
              >
                {movie.status === 'now_showing' ? 'Now In Cinemas' : 'Coming Soon'}
              </span>

              {movie.certificate && (
                <span className="px-2.5 py-1 rounded-md bg-white/10 text-white text-xs font-bold border border-white/10">
                  {movie.certificate}
                </span>
              )}

              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{movie.rating.toFixed(1)} / 10 Rating</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-500" />
                <span>{formatDuration(movie.duration)}</span>
              </span>
              <span>•</span>
              <span>{movie.language}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-500" />
                <span>Released: {new Date(movie.releaseDate).toLocaleDateString()}</span>
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 pt-1">
              {movie.genre.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-white/5"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Synopsis</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{movie.description}</p>
            </div>

            {/* Director & Cast */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Director</span>
                <span className="text-white font-bold text-sm mt-0.5 block">{movie.director}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Starring</span>
                <span className="text-white font-bold text-sm mt-0.5 block">
                  {movie.cast.join(', ')}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            {movie.trailerUrl && (
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowTrailer(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors"
                >
                  <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Watch Official Trailer</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Showtime Selection Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-500 flex items-center gap-1.5">
                <Ticket className="w-4 h-4" />
                <span>Book Tickets</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Theatres & Showtimes in {selectedCity}
              </h2>
            </div>

            {/* City selector */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span className="text-xs text-slate-400 font-semibold">City:</span>
              <select
                aria-label="Filter city for showtimes"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-900 text-xs text-white px-3 py-2 rounded-xl border border-white/15 focus:outline-none cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Picker Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {dateOptions.map(({ dateStr, dayLabel, formatted }) => (
              <button
                key={dateStr}
                type="button"
                onClick={() => setSelectedDate(dateStr)}
                className={`px-5 py-3 rounded-2xl flex flex-col items-center min-w-[100px] transition-all border ${
                  selectedDate === dateStr
                    ? 'bg-rose-600 text-white font-bold border-rose-500 shadow-lg shadow-rose-900/40 scale-105'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border-white/10'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-80">{dayLabel}</span>
                <span className="text-sm font-extrabold mt-0.5">{formatted}</span>
              </button>
            ))}
          </div>

          {/* Theatre Showtimes Cards */}
          {movie.status === 'coming_soon' ? (
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Advanced Ticket Sales Opening Soon</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {movie.title} arrives in cinemas on {new Date(movie.releaseDate).toLocaleDateString()}. Tickets will go live as soon as final showtimes are scheduled.
              </p>
            </div>
          ) : showtimes.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 text-center space-y-3">
              <Film className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Showtimes Scheduled for this Date</h3>
              <p className="text-xs text-slate-400">
                Please select another date or explore neighbouring cities above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {theatres
                .filter((th) => showtimesByTheatre.has(th._id))
                .map((theatre) => {
                  const theatreShows = showtimesByTheatre.get(theatre._id) || [];
                  return (
                    <div
                      key={theatre._id}
                      className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-lg space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div>
                          <h3 className="font-bold text-white text-lg">{theatre.name}</h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span>{theatre.address}</span>
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {theatreShows.length} showtimes available
                        </span>
                      </div>

                      {/* Showtime Buttons */}
                      <div className="flex flex-wrap items-center gap-3">
                        {theatreShows.map((st) => (
                          <button
                            key={st._id}
                            type="button"
                            onClick={() => handleSelectShowtime(st, theatre)}
                            className="group px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 hover:border-rose-500 text-left transition-all hover:scale-105 hover:shadow-lg hover:shadow-rose-950/40"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-white text-base group-hover:text-rose-400 transition-colors">
                                {st.time}
                              </span>
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  st.screenType === 'IMAX Laser'
                                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                                    : st.screenType === 'Dolby Cinema'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {st.screenType}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between gap-4">
                              <span>{st.screen}</span>
                              <span className="font-bold text-slate-200">From ${st.ticketPrice}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </section>
      </div>

      {/* Trailer Modal */}
      {showTrailer && movie.trailerUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <h3 className="font-bold text-white text-sm">{movie.title} – Official Trailer</h3>
              <button
                type="button"
                onClick={() => setShowTrailer(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                Close ✕
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={movie.trailerUrl.replace('watch?v=', 'embed/')}
                title="Trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
