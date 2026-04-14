/**
 * Ember — streakEngine.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L6
 * Status: 🟢 COMPLETE
 *
 * Notes:
 *  - Calculates streak by sorting all HPSnapshots into an array, taking the date,
 *    then checking if there was any activity on that date. A day is considered to
 *    have activity if at least one task has been completed (HP != 0)
 *  - calculateLongestStreak walks all history to find the peak consecutive run
 *
 * Dependencies:
 *  - Kaley's branch: HPSnapshot type from @/types/ember — Kaley — MERGED ✓
 */

import { HPSnapshot } from "@/types/ember";

/** Returns the number of days elapsed between two ISO date strings. */
function daysBetween(earlier: string, later: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round(
    (new Date(later).getTime() - new Date(earlier).getTime()) / msPerDay
  );
}

/**
 * Calculates the current streak: consecutive days ending at the most recent
 * snapshot where HP > 0 and no date gaps exist.
 */
export function calculateStreak(snapshots: HPSnapshot[]): number {
  // ^ EDGE CASE: If the array is empty, automatically return 0
  if (snapshots.length === 0) return 0;

  const sorted = [...snapshots].sort((a, b) => b.date.localeCompare(a.date));
  let streakCounter = 0;

  for (let i = 0; i < sorted.length; i++) {
    // ^ EDGE CASE: If any dates had 0 activity, automatically breaks the loop
    if (sorted[i].hp === 0) break;

    // ^ EDGE CASE: If there is a gap of more than 1 day between snapshots, break
    if (i > 0) {
      const gap = daysBetween(sorted[i].date, sorted[i - 1].date);
      if (gap > 1) break;
    }

    streakCounter++;
  }

  return streakCounter;
}

/**
 * Calculates the all-time longest streak across the full snapshot history.
 * Walks chronologically and resets whenever HP is 0 or a date gap appears.
 */
export function calculateLongestStreak(snapshots: HPSnapshot[]): number {
  if (snapshots.length === 0) return 0;

  const sorted = [...snapshots].sort((a, b) => a.date.localeCompare(b.date));
  let longest = 0;
  let current = 0;

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].hp === 0) {
      current = 0;
      continue;
    }

    if (i > 0) {
      const gap = daysBetween(sorted[i - 1].date, sorted[i].date);
      // ^ EDGE CASE: Reset current streak if there is a gap of more than 1 day
      current = gap === 1 ? current + 1 : 1;
    } else {
      current = 1;
    }

    if (current > longest) longest = current;
  }

  return longest;
}
