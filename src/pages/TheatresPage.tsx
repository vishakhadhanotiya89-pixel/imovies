import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Film, Calendar, Ticket, ChevronRight, Sparkles } from 'lucide-react';
import { Theatre, Showtime, Movie } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useBooking } from '../context/BookingContext.tsx';

const CITIES = ['All', 'New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Austin'];

export const TheatresPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedCity, setSelectedCity, setSelectedShowtime, setSelectedMovie, setSelectedTheatre } =
    useBooking();

  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cityFilter, setCityFilter] = useState<string>(selectedCity || 'All');
  const [loading, setLoading] = useState<boolean>(true);

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
    async function loadData() {
      try {
        setLoading(true);
        const [theatresRes, showtimesRes, moviesRes] = await Promise.all([
          api.getTheatres(cityFilter === 'All' ? undefined : cityFilter),
          api.getShowtimes({
            city: cityFilter === 'All' ? undefined : cityFilter,
            date: selectedDate,
          }),
          api.getMovies(),
        ]);
        setTheatres(theatresRes.theatres);
        setShowtimes(showtimesRes.showtimes);
        setMovies(moviesRes.movies);
      } catch (err) {
        console.error('Failed to load theatres:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [cityFilter, selectedDate]);

  const handleBookShowtime = (st: Showtime, th: Theatre) => {
    const matchedMovie = movies.find((m) => m._id === st.movieId);
    if (matchedMovie) setSelectedMovie(matchedMovie);
    setSelectedTheatre(th);
    setSelectedShowtime(st);
    navigate(`/seat-selection/${st._id}`);
  };

  // Group showtimes by theatre, then by movie
  const showtimesByTheatre = new Map<string, Showtime[]>();
  showtimes.forEach((st) => {
    if (!showtimesByTheatre.has(st.theatreId)) {
      showtimesByTheatre.set(st.theatreId, []);
    }
    showtimesByTheatre.get(st.theatreId)!.push(st);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-widest">
            <Film className="w-4 h-4" />
            <span>Cinemas & Auditoriums</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Theatres & Showtime Schedules
          </h1>
          <p className="text-sm text-slate-400">
            Find premium IMAX, Dolby Cinema, and Standard auditoriums near you.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
          {/* City selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="text-xs text-slate-400 font-semibold">City:</span>
            <div className="flex flex-wrap gap-1.5">
              {CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setCityFilter(city);
                    if (city !== 'All') setSelectedCity(city);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    cityFilter === city
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {dateOptions.map(({ dateStr, dayLabel, formatted }) => (
              <button
                key={dateStr}
                type="button"
                onClick={() => setSelectedDate(dateStr)}
                className={`px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  selectedDate === dateStr
                    ? 'bg-rose-600 text-white font-bold shadow-md'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <span className="opacity-80">{dayLabel}:</span>
                <span className="font-extrabold">{formatted}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theatres List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-slate-900/60 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : theatres.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-white/5 p-8">
            <p className="text-slate-400 text-sm">No theatres found for this city.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {theatres.map((theatre) => {
              const thShows = showtimesByTheatre.get(theatre._id) || [];

              // Group this theatre's showtimes by movie
              const movieGroups = new Map<string, Showtime[]>();
              thShows.forEach((st) => {
                if (!movieGroups.has(st.movieId)) {
                  movieGroups.set(st.movieId, []);
                }
                movieGroups.get(st.movieId)!.push(st);
              });

              return (
                <div
                  key={theatre._id}
                  className="bg-slate-900/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
                >
                  {/* Theatre Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-white">{theatre.name}</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-rose-400 text-xs font-semibold border border-white/5">
                          {theatre.city}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{theatre.address}</span>
                      </p>
                    </div>

                    {/* Screens summary */}
                    <div className="flex flex-wrap gap-1.5">
                      {theatre.screens.map((sc) => (
                        <span
                          key={sc.name}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] text-slate-300 font-medium border border-white/5"
                        >
                          {sc.type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Movies playing at this theatre */}
                  {movieGroups.size === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No screenings scheduled for {new Date(selectedDate).toLocaleDateString()}.
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {Array.from(movieGroups.entries()).map(([movieId, movieShows]) => {
                        const movie = movies.find((m) => m._id === movieId);
                        if (!movie) return null;

                        return (
                          <div
                            key={movieId}
                            className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                          >
                            {/* Movie snippet */}
                            <div className="flex items-center gap-3">
                              <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-12 h-16 object-cover rounded-lg shadow shrink-0"
                              />
                              <div>
                                <h3 className="font-bold text-white text-base hover:text-rose-400 transition-colors">
                                  {movie.title}
                                </h3>
                                <p className="text-xs text-slate-400">
                                  {movie.language} • {movie.duration}m • {movie.genre.join(', ')}
                                </p>
                              </div>
                            </div>

                            {/* Showtimes */}
                            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                              {movieShows.map((st) => (
                                <button
                                  key={st._id}
                                  type="button"
                                  onClick={() => handleBookShowtime(st, theatre)}
                                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-600 hover:text-white text-slate-200 border border-white/10 hover:border-rose-500 text-xs font-semibold transition-all flex flex-col items-center group"
                                >
                                  <span className="font-bold text-sm">{st.time}</span>
                                  <span className="text-[10px] text-slate-400 group-hover:text-rose-200">
                                    {st.screenType} • ${st.ticketPrice}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
