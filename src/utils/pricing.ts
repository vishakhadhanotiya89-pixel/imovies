export interface PriceBreakdown {
  subtotal: number;
  convenienceFee: number;
  tax: number;
  total: number;
  seatsCount: number;
}

export const CONVENIENCE_FEE_PER_TICKET = 1.75;
export const TAX_RATE = 0.08; // 8% sales tax

/**
 * Calculates complete pricing breakdown on server and client.
 * Server is authoritative.
 */
export function calculateBookingPrice(
  seatPrices: number[]
): PriceBreakdown {
  if (!seatPrices || seatPrices.length === 0) {
    return {
      subtotal: 0,
      convenienceFee: 0,
      tax: 0,
      total: 0,
      seatsCount: 0,
    };
  }

  const subtotal = seatPrices.reduce((acc, p) => acc + Number(p), 0);
  const convenienceFee = Number((seatPrices.length * CONVENIENCE_FEE_PER_TICKET).toFixed(2));
  const tax = Number(((subtotal + convenienceFee) * TAX_RATE).toFixed(2));
  const total = Number((subtotal + convenienceFee + tax).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    convenienceFee,
    tax,
    total,
    seatsCount: seatPrices.length,
  };
}

/**
 * Validates seat selection limit (max 8 seats per booking).
 */
export function validateSeatLimit(selectedCount: number, maxAllowed = 8): { valid: boolean; error?: string } {
  if (selectedCount <= 0) {
    return { valid: false, error: 'Please select at least 1 seat.' };
  }
  if (selectedCount > maxAllowed) {
    return { valid: false, error: `You can select a maximum of ${maxAllowed} seats per booking.` };
  }
  return { valid: true };
}

/**
 * Generates a human-friendly unique booking reference: IMOV-XXXX-XXXX
 */
export function generateBookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const segment2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `IMOV-${segment1}-${segment2}`;
}

/**
 * Checks if any requested seat is already booked.
 */
export function findConflictingSeats(requestedSeats: string[], alreadyBookedSeats: string[]): string[] {
  const bookedSet = new Set(alreadyBookedSeats.map((s) => s.toUpperCase()));
  return requestedSeats.filter((s) => bookedSet.has(s.toUpperCase()));
}
