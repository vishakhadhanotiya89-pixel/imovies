import React from 'react';
import { Armchair, Check, AlertCircle } from 'lucide-react';
import { SeatInfo, SeatTier, Showtime } from '../../types/index.ts';

interface SeatLayoutProps {
  showtime: Showtime;
  seats: SeatInfo[];
  selectedSeats: string[];
  onToggleSeat: (seatNumber: string) => void;
  error?: string | null;
}

export const SeatLayout: React.FC<SeatLayoutProps> = ({
  showtime,
  seats,
  selectedSeats,
  onToggleSeat,
  error,
}) => {
  // Group seats by row
  const rowsMap = new Map<string, SeatInfo[]>();
  seats.forEach((seat) => {
    if (!rowsMap.has(seat.row)) {
      rowsMap.set(seat.row, []);
    }
    rowsMap.get(seat.row)!.push(seat);
  });

  const rowKeys = Array.from(rowsMap.keys());

  // Function to get visual color based on tier
  const getTierBadge = (tier: SeatTier) => {
    switch (tier) {
      case 'VIP':
        return { label: 'VIP Recliner', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' };
      case 'Premium':
        return { label: 'Premium', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' };
      default:
        return { label: 'Standard', color: 'border-slate-500/40 text-slate-300 bg-slate-500/10' };
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none py-6">
      {/* Screen Curved Header */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
        <div className="w-full h-3 bg-gradient-to-r from-rose-500/20 via-rose-500 to-rose-500/20 rounded-[50%] blur-[2px] shadow-[0_12px_30px_rgba(244,63,94,0.35)]" />
        <div className="w-4/5 h-1.5 bg-gradient-to-r from-transparent via-white/40 to-transparent mt-1" />
        <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-slate-400 mt-3 flex items-center gap-2">
          <span>CINEMA SCREEN</span>
          <span className="text-rose-500 font-extrabold">•</span>
          <span className="text-slate-300">{showtime.screen}</span>
        </span>
      </div>

      {error && (
        <div className="mb-6 px-4 py-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Seats Container */}
      <div className="w-full overflow-x-auto pb-6">
        <div className="min-w-[620px] max-w-3xl mx-auto space-y-3.5 px-4">
          {rowKeys.map((rowKey) => {
            const rowSeats = rowsMap.get(rowKey) || [];
            const tier = rowSeats[0]?.tier || 'Standard';
            const tierBadge = getTierBadge(tier);

            return (
              <div key={rowKey} className="flex items-center justify-between gap-3 group">
                {/* Row Label Left */}
                <div className="w-7 text-xs font-bold text-slate-500 text-center">{rowKey}</div>

                {/* Seat Buttons in Row */}
                <div className="flex-1 flex items-center justify-center gap-2 sm:gap-2.5">
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.seatNumber);
                    const isBooked = seat.isBooked;

                    let seatClasses =
                      'relative w-7 h-7 sm:w-8 sm:h-8 rounded-t-lg rounded-b-md text-[10px] font-bold flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none';

                    if (isBooked) {
                      seatClasses +=
                        ' bg-slate-800/60 text-slate-600 border border-white/5 cursor-not-allowed opacity-50';
                    } else if (isSelected) {
                      seatClasses +=
                        ' bg-rose-600 text-white shadow-lg shadow-rose-600/50 scale-105 border border-rose-400 ring-2 ring-rose-500/30';
                    } else {
                      // Available
                      if (seat.tier === 'VIP') {
                        seatClasses +=
                          ' bg-amber-950/40 text-amber-200 border border-amber-500/30 hover:bg-amber-600 hover:text-white hover:scale-110';
                      } else if (seat.tier === 'Premium') {
                        seatClasses +=
                          ' bg-purple-950/40 text-purple-200 border border-purple-500/30 hover:bg-purple-600 hover:text-white hover:scale-110';
                      } else {
                        seatClasses +=
                          ' bg-slate-900 text-slate-300 border border-slate-700/60 hover:bg-slate-700 hover:text-white hover:scale-110';
                      }
                    }

                    return (
                      <button
                        key={seat.seatNumber}
                        type="button"
                        disabled={isBooked}
                        onClick={() => onToggleSeat(seat.seatNumber)}
                        aria-label={`Seat ${seat.seatNumber}, ${seat.tier}, $${seat.price}${
                          isBooked ? ' (Sold)' : isSelected ? ' (Selected)' : ' (Available)'
                        }`}
                        title={`${seat.seatNumber} • ${seat.tier} • $${seat.price}`}
                        className={seatClasses}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <span>{seat.col}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tier Badge / Row Label Right */}
                <div className="w-20 text-right">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border ${tierBadge.color}`}
                  >
                    {tier}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Legend */}
      <div className="w-full max-w-2xl mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-slate-900 border border-slate-700/60 flex items-center justify-center text-[9px] text-slate-400">
            A
          </div>
          <span>
            Standard <strong className="text-white">${showtime.tierPricing.Standard}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-purple-950/40 border border-purple-500/40 flex items-center justify-center text-[9px] text-purple-300">
            P
          </div>
          <span>
            Premium <strong className="text-white">${showtime.tierPricing.Premium}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-[9px] text-amber-300">
            V
          </div>
          <span>
            VIP Recliner <strong className="text-white">${showtime.tierPricing.VIP}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-rose-600 text-white flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
          <span>Selected</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-slate-800/60 border border-white/5 opacity-50 flex items-center justify-center text-[9px] text-slate-600">
            ✕
          </div>
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
};
