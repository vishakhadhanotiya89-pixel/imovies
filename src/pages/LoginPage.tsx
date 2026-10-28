import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Mail, Lock, AlertCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, quickDemoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login({ email, password });
      const destination = (location.state as any)?.from || '/';
      navigate(destination);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: 'customer' | 'admin') => {
    setError(null);
    try {
      setSubmitting(true);
      await quickDemoLogin(role);
      navigate(role === 'admin' ? '/admin' : '/');
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-700 to-red-500 flex items-center justify-center text-white shadow-xl shadow-rose-900/30 group-hover:scale-105 transition-transform">
              <Film className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400">
            Sign in to access your booked movie passes and express cinema checkout.
          </p>
        </div>

        {/* Quick Demo Logins Section */}
        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 shadow-xl space-y-3">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast One-Click Evaluator Logins</span>
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleDemoLogin('customer')}
              className="px-3 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all text-left flex flex-col"
            >
              <span className="font-extrabold text-white">Demo Customer</span>
              <span className="text-[10px] text-amber-400/80">demo@imovies.com</span>
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleDemoLogin('admin')}
              className="px-3 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all text-left flex flex-col"
            >
              <span className="font-extrabold text-white flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-400" /> Admin Access
              </span>
              <span className="text-[10px] text-purple-400/80">admin@imovies.com</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 text-sm text-slate-100 placeholder:text-slate-600 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:border-rose-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 text-sm text-slate-100 placeholder:text-slate-600 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:border-rose-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-rose-400 hover:text-rose-300 font-bold">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
