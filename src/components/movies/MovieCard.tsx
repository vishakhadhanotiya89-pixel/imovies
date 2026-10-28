import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';
import { Movie } from '../../types/index.ts';

interface MovieCardProps {
  movie: Movie;
}

export function formatDuration(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-white/10 hover:border-rose-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-950/40 flex flex-col h-full">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // High quality fallback
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Rating */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>

          {/* Certificate / Status */}
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border ${
              movie.status === 'now_showing'
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30'
            }`}
          >
            {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
          </span>
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <Link
            to={`/movies/${movie._id}`}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/50 transition-colors"
          >
            <Ticket className="w-4 h-4" />
            <span>{movie.status === 'now_showing' ? 'Book Tickets' : 'View Details'}</span>
          </Link>
        </div>
      </div>

      {/* Movie Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{formatDuration(movie.duration)}</span>
            </span>
            <span className="font-medium text-slate-300">{movie.language}</span>
          </div>

          <Link to={`/movies/${movie._id}`}>
            <h3 className="font-bold text-white text-base group-hover:text-rose-400 transition-colors line-clamp-1">
              {movie.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {movie.description}
          </p>
        </div>

        {/* Genres & Link */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {movie.genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium border border-white/5"
              >
                {g}
              </span>
            ))}
          </div>
          <Link
            to={`/movies/${movie._id}`}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};
