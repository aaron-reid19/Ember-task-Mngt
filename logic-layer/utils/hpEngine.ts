/**
 * Ember — hpEngine.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L1, L2, L5
 * Status: 🟠 IN PROGRESS
 * 
 * Notes: Calculates the HP of the Ember Character and returns an EmberState 
 * 
 * Dependencies: 
 *  - Kaley's branch: EmberStates from @/constants/EmberStates — Kaley — PENDING MERGE
 *  - Kaley's branch: EmberState type from @/types/ember — Kaley — PENDING MERGE
 *  - Kaley's branch: BONFIRE_HP_THRESHOLD const from @/types/ember — Kaley — PENDING MERGE
 */

import { EmberStates } from "@/constants/EmberStates" 
import { EmberState } from "@/types/ember"
import { BONFIRE_HP_THRESHOLD } from "@/constants/EmberStates"

/** Calculates Ember's HP as a percentage of completed tasks over daily goal. */
export function calculateHP( completedTasks: number, dailyGoal: number ): number {
  // ^ Edge Case: Checks if dailyGoal is equal to or less than zero to avoid failure
  if (dailyGoal <= 0) {
    return 0;
  }
  return (completedTasks / dailyGoal) * 100;
}

/** Maps a raw HP number to an EmberState using thresholds from EmberStates.ts. */
export function classifyHP( HP: number ): EmberState {
  if ( HP >= EmberStates.Thriving.hpMin && HP <= EmberStates.Thriving.hpMax ) {
    return "Thriving";
  }
  if ( HP >= EmberStates.Steady.hpMin && HP <= EmberStates.Steady.hpMax ) {
    return "Steady";
  }
  if ( HP >= EmberStates.Strained.hpMin && HP <= EmberStates.Strained.hpMax ) {
    return "Strained";
  }
  if ( HP >= EmberStates.Flickering.hpMin && HP <= EmberStates.Flickering.hpMax ) {
    return "Flickering";
  }
  // ^ Edge Case: If HP value is outside range defined in EmberStates, return "Flickering"
  return "Flickering";
}

/** Checks if HP === 100 and if Daily Spark has been completed, then returns a boolean */
export function checkBonfire( HP: number, isDailySparkComplete: boolean ): boolean {
  return HP === BONFIRE_HP_THRESHOLD && isDailySparkComplete;
}