import React from 'react';
import { Film, QrCode, Printer, CheckCircle2, MapPin, Calendar, Clock, Armchair } from 'lucide-react';
import { Booking } from '../../types/index.ts';

interface TicketViewProps {
  booking: Booking;
  onClose?: () => void;
}

export const TicketView: React.FC<TicketViewProps> = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl text-slate-100 print:bg-white print:text-black print:border-black">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5" />
          <span className="font-extrabold tracking-wider font-serif text-lg">IMOVIES PASS</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/25 rounded-full text-xs font-semibold backdrop-blur-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
          <span className="tracking-wide uppercase">{booking.bookingStatus}</span>
        </div>
      </div>

      {/* Ticket Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Movie Info */}
        <div className="flex gap-4 items-start">
          {booking.movie?.posterUrl && (
            <img
              src={booking.movie.posterUrl}
              alt={booking.movie.title}
              className="w-20 h-28 object-cover rounded-xl shadow-md border border-white/10 shrink-0"
            />
          )}
          <div className="space-y-1.5 flex-1">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest">
              Digital Cinema Ticket
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white print:text-black leading-tight">
              {booking.movie?.title || 'Selected Feature Film'}
            </h2>
            <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-300 print:text-slate-700">
              <span className="px-2 py-0.5 rounded bg-white/10">{booking.movie?.language || 'English'}</span>
              <span className="px-2 py-0.5 rounded bg-white/10">{booking.showtime?.screenType || 'Standard Screen'}</span>
              {booking.movie?.certificate && (
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                  {booking.movie.certificate}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Showtime & Venue Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-white/5 print:bg-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1 font-medium">
              <Calendar className="w-3 h-3 text-rose-500" /> Date
            </span>
            <p className="text-sm font-bold text-white print:text-black mt-0.5">
              {booking.showtime?.date || new Date(booking.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-rose-500" /> Showtime
            </span>
            <p className="text-sm font-bold text-white print:text-black mt-0.5">
              {booking.showtime?.time || 'Evening Show'}
            </p>
          </div>

          <div className="col-span-2 pt-2 border-t border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-rose-500" /> Theatre & Screen
            </span>
            <p className="text-sm font-bold text-white print:text-black mt-0.5">
              {booking.theatre?.name || 'Grand Cinema'} • {booking.showtime?.screen || 'Screen 1'}
            </p>
            <p className="text-xs text-slate-400 print:text-slate-600">
              {booking.theatre?.address || 'Downtown Cinema Complex'}
            </p>
          </div>
        </div>

        {/* Seats & Booking Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20">
            <span className="text-[10px] uppercase tracking-wider text-rose-400 flex items-center gap-1 font-medium">
              <Armchair className="w-3 h-3" /> Reserved Seats ({booking.ticketCount})
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {booking.selectedSeats.map((seat) => (
                <span
                  key={seat}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 text-right sm:text-left print:bg-slate-100">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Total Amount Paid
            </span>
            <p className="text-2xl font-black text-emerald-400 print:text-emerald-700 mt-0.5">
              ${booking.totalAmount.toFixed(2)}
            </p>
            <span className="text-[10px] text-slate-400">Paid via {booking.paymentMethod}</span>
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="relative flex items-center py-2">
          <div className="absolute -left-10 w-6 h-6 rounded-full bg-slate-950 border-r border-white/10" />
          <div className="w-full border-t-2 border-dashed border-white/15" />
          <div className="absolute -right-10 w-6 h-6 rounded-full bg-slate-950 border-l border-white/10" />
        </div>

        {/* Barcode & Verification */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Booking Reference
            </span>
            <p className="font-mono text-base font-extrabold text-white tracking-widest print:text-black">
              {booking.bookingReference}
            </p>
            <p className="text-[10px] text-slate-400">Show this QR code at cinema entry turnstiles</p>
          </div>

          {/* Simulated QR Code */}
          <div className="p-3 bg-white rounded-2xl shadow-md flex items-center justify-center shrink-0">
            <QrCode className="w-16 h-16 text-slate-900" />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-slate-950/80 px-6 py-4 border-t border-white/10 flex items-center justify-between gap-4 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors"
        >
          <Printer className="w-4 h-4 text-rose-400" />
          <span>Print / Save Ticket</span>
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
