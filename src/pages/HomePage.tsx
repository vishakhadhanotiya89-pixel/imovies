import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Ticket, Star, Sparkles, MapPin, ChevronRight, ShieldCheck, Zap, Film } from 'lucide-react';
import { MovieCard } from '../components/movies/MovieCard.tsx';
import { Movie, Theatre } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useBooking } from '../context/BookingContext.tsx';

export const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [trailerModalUrl, setTrailerModalUrl] = useState<string | null>(null);

  const { selectedCity, setSelectedCity } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [movieRes, theatreRes] = await Promise.all([
          api.getMovies(),
          api.getTheatres(selectedCity),
        ]);
        setMovies(movieRes.movies);
        setTheatres(theatreRes.theatres);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCity]);

  // Featured Movie for Hero Banner
  const heroMovie = movies.find((m) => m._id === 'mov_1') || movies[0];

  const nowShowing = movies.filter((m) => m.status === 'now_showing');
  const comingSoon = movies.filter((m) => m.status === 'coming_soon');

  // Filtered now showing by genre
  const filteredNowShowing =
    activeGenre === 'All'
      ? nowShowing
      : nowShowing.filter((m) => m.genre.some((g) => g.toLowerCase() === activeGenre.toLowerCase()));

  const genresList = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Romance'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      {heroMovie && (
        <section className="relative w-full h-[75vh] min-h-[520px] max-h-[800px] overflow-hidden flex items-end">
          {/* Backdrop Image with Multi-gradient Vignette */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroMovie.backdropUrl || heroMovie.posterUrl}
              alt={heroMovie.title}
              className="w-full h-full object-cover object-center scale-105 animate-in fade-in duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 w-full">
            <div className="max-w-2xl space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-rose-900/50">
                  <Sparkles className="w-3.5 h-3.5" /> Featured Blockbuster
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-white/10 text-amber-400 text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {heroMovie.rating.toFixed(1)} / 10
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 text-xs font-medium backdrop-blur-sm">
                  {heroMovie.language} • {heroMovie.duration} mins
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
                {heroMovie.title}
              </h1>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed drop-shadow">
                {heroMovie.description}
              </p>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {heroMovie.genre.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 text-xs font-medium backdrop-blur-sm"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  to={`/movies/${heroMovie._id}`}
                  className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-rose-900/40 hover:scale-[1.02] transition-all"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Book Tickets Now</span>
                </Link>

                {heroMovie.trailerUrl && (
                  <button
                    type="button"
                    onClick={() => setTrailerModalUrl(heroMovie.trailerUrl || null)}
                    className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm flex items-center gap-2 border border-white/15 backdrop-blur-sm transition-all"
                  >
                    <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span>Watch Trailer</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick City & Search Strip */}
      <section className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-slate-900/95 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
                Current Location
              </span>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">{selectedCity}</span>
                <span className="text-xs text-slate-400">({theatres.length} venues nearby)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Austin'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCity === city
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <Link
            to="/movies"
            className="w-full md:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold border border-rose-500/20 text-center transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explore All Movies</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16 flex-1 w-full">
        {/* Now Showing Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-widest">
                <Film className="w-4 h-4" />
                <span>Now Playing in Theatres</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Movies In {selectedCity}
              </h2>
            </div>

            {/* Genre Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {genresList.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setActiveGenre(genre)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeGenre === genre
                      ? 'bg-rose-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Movies Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-slate-900/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredNowShowing.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5 p-8">
              <p className="text-slate-400 text-sm">No movies found matching genre "{activeGenre}".</p>
              <button
                type="button"
                onClick={() => setActiveGenre('All')}
                className="mt-3 px-4 py-2 bg-rose-600 rounded-lg text-white text-xs font-bold"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {filteredNowShowing.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}
        </section>

        {/* Coming Soon Section */}
        {comingSoon.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest block">
                  Anticipated Releases
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                  Coming Soon To Cinemas
                </h2>
              </div>
              <Link
                to="/movies?status=coming_soon"
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <span>View All Upcoming</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {comingSoon.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Popular Theatres Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-rose-500 text-xs font-bold uppercase tracking-widest block">
                World-Class Auditoriums
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Featured Theatres in {selectedCity}
              </h2>
            </div>
            <Link
              to="/theatres"
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>All Theatres</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {theatres.map((th) => (
              <div
                key={th._id}
                className="p-5 rounded-2xl bg-slate-900 border border-white/10 hover:border-rose-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white text-lg">{th.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-semibold border border-white/5">
                      {th.city}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{th.address}</span>
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                    Available Screens:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {th.screens.map((screen) => (
                      <span
                        key={screen.name}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 font-medium border border-white/5"
                      >
                        {screen.type}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/theatres?theatreId=${th._id}`}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold text-center border border-rose-500/20 transition-colors block"
                >
                  View Showtimes & Book
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Value Proposition Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Instant Seat Confirmation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time seat mapping with zero lockouts. Choose exact seats and get immediate QR passes directly on your device.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Guaranteed Pricing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent price breakdown with standard, premium, and VIP tiers. Server-verified pricing prevents surprise charges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Premium Cinema Formats</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct access to IMAX Laser, Dolby Atmos, and 4DX experiences across leading theatre chains in top metropolitan cities.
            </p>
          </div>
        </section>
      </main>

      {/* Trailer Modal */}
      {trailerModalUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <h3 className="font-bold text-white text-sm">Trailer Preview</h3>
              <button
                type="button"
                onClick={() => setTrailerModalUrl(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                Close ✕
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={trailerModalUrl.replace('watch?v=', 'embed/')}
                title="Movie Trailer"
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
