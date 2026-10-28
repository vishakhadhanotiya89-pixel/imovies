import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBookingPrice,
  validateSeatLimit,
  generateBookingReference,
  findConflictingSeats,
  CONVENIENCE_FEE_PER_TICKET,
} from '../src/utils/pricing.ts';

test('calculateBookingPrice returns zero for empty seat list', () => {
  const result = calculateBookingPrice([]);
  assert.equal(result.subtotal, 0);
  assert.equal(result.convenienceFee, 0);
  assert.equal(result.total, 0);
  assert.equal(result.seatsCount, 0);
});

test('calculateBookingPrice computes subtotal, convenience fee, tax and total accurately', () => {
  const seats = [15, 20];
  const result = calculateBookingPrice(seats);

  assert.equal(result.subtotal, 35);
  assert.equal(result.convenienceFee, 2 * CONVENIENCE_FEE_PER_TICKET);
  assert.equal(result.tax, 3.08);
  assert.equal(result.total, 41.58);
  assert.equal(result.seatsCount, 2);
});

test('validateSeatLimit enforces bounds between 1 and 8 seats', () => {
  assert.equal(validateSeatLimit(0).valid, false);
  assert.equal(validateSeatLimit(1).valid, true);
  assert.equal(validateSeatLimit(5).valid, true);
  assert.equal(validateSeatLimit(8).valid, true);
  assert.equal(validateSeatLimit(9).valid, false);
});

test('generateBookingReference produces valid format IMOV-XXXX-XXXX', () => {
  const ref1 = generateBookingReference();
  const ref2 = generateBookingReference();

  assert.match(ref1, /^IMOV-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  assert.notEqual(ref1, ref2);
});

test('findConflictingSeats detects duplicate seat selections accurately', () => {
  const booked = ['A1', 'A2', 'B5', 'C10'];
  
  const conflicts1 = findConflictingSeats(['A3', 'B6'], booked);
  assert.deepEqual(conflicts1, []);

  const conflicts2 = findConflictingSeats(['A1', 'D4', 'B5'], booked);
  assert.deepEqual(conflicts2, ['A1', 'B5']);
});
