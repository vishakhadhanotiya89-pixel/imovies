import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Film } from 'lucide-react';
import { MovieCard } from '../components/movies/MovieCard.tsx';
import { Movie } from '../types/index.ts';
import { api } from '../services/api.ts';

export const MoviesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state initialized from URL params if present
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [status, setStatus] = useState<string>(searchParams.get('status') || 'all');
  const [genre, setGenre] = useState<string>(searchParams.get('genre') || 'All');
  const [language, setLanguage] = useState<string>(searchParams.get('language') || 'All');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'rating_desc');

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        const data = await api.getMovies({
          status: status === 'all' ? undefined : status,
          genre,
          language,
          search,
          sortBy,
        });
        setMovies(data.movies);
        if (data.filters) {
          setAvailableGenres(['All', ...data.filters.genres]);
          setAvailableLanguages(['All', ...data.filters.languages]);
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, [status, genre, language, search, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setStatus('all');
    setGenre('All');
    setLanguage('All');
    setSortBy('rating_desc');
    setSearchParams({});
  };

  const hasActiveFilters =
    search !== '' || status !== 'all' || genre !== 'All' || language !== 'All' || sortBy !== 'rating_desc';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-widest">
            <Film className="w-4 h-4" />
            <span>Discover The Magic of Cinema</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Browse All Movies
          </h1>
          <p className="text-sm text-slate-400">
            Explore {movies.length} movies currently showing and upcoming in premier theatres.
          </p>
        </div>

        {/* Filter & Search Bar Card */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, director, cast..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 text-sm text-slate-200 placeholder:text-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:border-rose-500 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                aria-label="Filter by Availability"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-950 text-sm text-slate-200 px-3 py-2.5 rounded-xl border border-white/10 focus:border-rose-500 focus:outline-none"
              >
                <option value="all">All Availability</option>
                <option value="now_showing">Now Showing</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                <select
                  aria-label="Sort Movies"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-950 text-sm text-slate-200 px-3 py-2.5 rounded-xl border border-white/10 focus:border-rose-500 focus:outline-none"
                >
                  <option value="rating_desc">Highest Rated</option>
                  <option value="release_desc">Release Date (Newest)</option>
                  <option value="title_asc">Title (A-Z)</option>
                  <option value="duration_desc">Longest Duration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Secondary Filters: Genre & Language */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-rose-500" /> Genre:
              </span>
              {availableGenres.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenre(g)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    genre === g
                      ? 'bg-rose-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Language filter & Reset */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Language:</span>
                <select
                  aria-label="Filter by Language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-950 text-xs text-slate-200 px-3 py-1.5 rounded-lg border border-white/10 focus:outline-none"
                >
                  {availableLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Movies Grid / Empty State */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-slate-900/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-white/5 p-8 max-w-xl mx-auto space-y-4">
            <Film className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Movies Found</h3>
            <p className="text-xs text-slate-400">
              No movies matched your current search filters. Try adjusting your search query, genre, or status.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
