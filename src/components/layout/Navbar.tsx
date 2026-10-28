import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Ticket, MapPin, Search, LogOut, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useBooking } from '../../context/BookingContext.tsx';

const CITIES = ['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Austin'];

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, quickDemoLogin } = useAuth();
  const { selectedCity, setSelectedCity } = useBooking();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'Theatres', path: '/theatres' },
    ...(isAuthenticated ? [{ label: 'My Bookings', path: '/my-bookings' }] : []),
    ...(isAdmin ? [{ label: 'Admin Dashboard', path: '/admin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-700 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/30 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-wider text-white font-serif uppercase flex items-center gap-1">
                  I<span className="text-rose-500">Movies</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium -mt-1">
                  Ticket Booking Made Simple
                </span>
              </div>
            </Link>

            {/* City Selector */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-white/10 rounded-full text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <select
                aria-label="Select City"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city} className="bg-slate-900 text-slate-200">
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search movies, genres, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder:text-slate-500 pl-9 pr-4 py-2 rounded-full border border-white/10 focus:border-rose-500 focus:outline-none transition-colors"
              />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'text-white bg-rose-600/20 text-rose-400 border border-rose-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth & CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => quickDemoLogin('customer')}
                  className="px-2.5 py-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
                  title="Quick 1-Click Demo Login"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Demo Login</span>
                </button>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md shadow-rose-900/30 transition-all hover:scale-[1.02]"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white line-clamp-1">{user?.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                      {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-white"
                    >
                      <Ticket className="w-4 h-4 text-rose-500" />
                      <span>My Bookings</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-400 hover:bg-white/5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Console</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-white/10 px-4 pt-2 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 text-sm text-slate-200 placeholder:text-slate-500 pl-9 pr-4 py-2.5 rounded-lg border border-white/10"
              />
            </div>
          </form>

          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 rounded-lg border border-white/10">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span className="text-xs text-slate-400">City:</span>
            <select
              aria-label="Select City Mobile"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent border-none text-slate-200 text-xs font-semibold focus:outline-none flex-1"
            >
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 space-y-2">
            {!isAuthenticated ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      quickDemoLogin('customer');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center"
                  >
                    Demo User
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      quickDemoLogin('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-xs font-medium text-purple-400 bg-purple-500/10 border border-purple-500/30 rounded-lg text-center"
                  >
                    Demo Admin
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-sm font-medium bg-slate-900 rounded-lg text-slate-200 border border-white/10"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-sm font-semibold bg-rose-600 rounded-lg text-white"
                  >
                    Register
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center font-bold text-white">
                    {user?.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{user?.name}</div>
                    <div className="text-xs text-slate-400">{user?.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-sm text-red-400 bg-red-500/10 rounded-lg font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
