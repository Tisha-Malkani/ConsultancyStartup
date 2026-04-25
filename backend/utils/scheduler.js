import Booking from '../models/Booking.js';

/**
 * Finds the next available 1-hour consultation slot.
 * Rules:
 *  - Minimum 1 full day ahead (tomorrow onwards)
 *  - Business hours: 9:00 AM – 5:00 PM (slots start at 9,10,11,12,13,14,15,16)
 *  - No two bookings share the same slot
 *  - Skips weekends (Sat/Sun)
 */
export const findNextAvailableSlot = async () => {
  // Fetch all existing scheduled bookings
  const existingBookings = await Booking.find(
    { scheduledAt: { $exists: true, $ne: null } },
    { scheduledAt: 1 }
  );

  const bookedTimes = new Set(
    existingBookings.map((b) => new Date(b.scheduledAt).getTime())
  );

  const SLOT_HOURS = [9, 10, 11, 12, 13, 14, 15, 16]; // 9 AM – 4 PM (last slot ends 5 PM)
  const MAX_DAYS_AHEAD = 30; // search up to 30 days

  // Start from tomorrow
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);

  for (let d = 0; d < MAX_DAYS_AHEAD; d++) {
    const day = new Date(start);
    day.setDate(start.getDate() + d);

    // Skip weekends
    const dow = day.getDay();
    if (dow === 0 || dow === 6) continue;

    for (const hour of SLOT_HOURS) {
      const slot = new Date(day);
      slot.setHours(hour, 0, 0, 0);

      if (!bookedTimes.has(slot.getTime())) {
        return slot; // first free slot found
      }
    }
  }

  return null; // no slot found in 30 days (shouldn't happen)
};

/**
 * Formats a Date into a readable string.
 * e.g. "Tuesday, 29 April 2026 at 10:00 AM"
 */
export const formatSlot = (date) => {
  const dayName = date.toLocaleDateString('en-IN', { weekday: 'long' });
  const datePart = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const timePart = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${dayName}, ${datePart} at ${timePart}`;
};
