import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ShieldCheck, Heart, Sparkles, MapPin, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-400 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group inline-flex">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-700 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/30">
                <Film className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-wider text-white font-serif uppercase">
                I<span className="text-rose-500">Movies</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Movie Ticket Booking Made Simple. Experience real-time cinema seating, premium auditorium formats, instant verified digital tickets, and seamless movie discovery.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Operating across NY, LA, Chicago, SF, and Austin</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>support@imovies-cinema.example</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>1-800-IMOVIES (Toll Free Demo)</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/movies?status=now_showing" className="hover:text-rose-400 transition-colors">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies?status=coming_soon" className="hover:text-rose-400 transition-colors">
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link to="/theatres" className="hover:text-rose-400 transition-colors">
                  Theatres & Venues
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-rose-400 transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Experience formats */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Cinema Formats</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>IMAX with Laser</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Dolby Cinema & Atmos</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>4DX Dynamic Motion</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>VIP Recliner Lounges</span>
              </li>
            </ul>
          </div>

          {/* College Project Badge & Stack */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Project Info</h3>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>College Project Demo</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Built with React, Node.js, Express, and MongoDB/Mongoose. Payments are simulated; no real bank cards are billed.
              </p>
              <div className="pt-1 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">MERN Architecture</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">JWT Auth</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Atomic Booking</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} IMovies Cinema Network. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for movie lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};
