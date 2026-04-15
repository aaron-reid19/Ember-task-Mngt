/**
 * Ember — streakEngine.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L6
 * Status: 🟤 In Progress
 * 
 * Notes: 
 *  - Calculates streak by sorting all HPSnapshots into an array, taking the date,
 *  then checking if there was any activity on that date. A day is considered to
 *  have activity if at least one task has been completed (HP != 0)
 * 
 * Dependencies: 
 *  - Kaley's branch: HPSnapshot type from @/types/ember — Kaley — PENDING MERGE
 */

import { HPSnapshot } from "@/types";

export function calculateStreak( snapshots: HPSnapshot[] ): number {
  let streakCounter = 0;

  // ^ EDGE CASE: If the array is empty, automatically return 0
  if (snapshots.length === 0) {
      return 0;
  }
  snapshots.sort((current, next) => next.date.localeCompare(current.date));

  for (let i = 0; i < snapshots.length; i++) {
    // ^ EDGE CASE: If any dates had 0 activity, automatically breaks the loop
    if (snapshots[i].hp === 0) {
      break;
    }
    streakCounter++;
  }
  return streakCounter;
}