/**
 * Ember — hpEngine.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L1, L2, L5
 * Status: 🟡 STUB
 * 
 * Notes: 
 *  - Calculates the HP of the Ember Character 
 *  - Returns an EmberState
 *  - Checks if Bonfire Mode
 * 
 * Dependencies: 
 *  - Kaley's branch: EmberStates from @/constants/EmberStates — Kaley — PENDING MERGE
 *  - Kaley's branch: EmberState type from @/types/ember — Kaley — PENDING MERGE
 *  - Kaley's branch: BONFIRE_HP_THRESHOLD const from @/types/ember — Kaley — PENDING MERGE
 */

import { EmberStates } from "@/constants/EmberStates"; 
import { EmberState } from "@/types/ember";
import { BONFIRE_HP_THRESHOLD } from "@/constants/EmberStates";

/** Calculates Ember's HP as a percentage of completed tasks over daily goal. */
export function calculateHP( completedTasks: number, dailyGoal: number ): number {
  // ^ EDGE CASE: Checks if dailyGoal is equal to or less than zero to avoid failure
  if (dailyGoal <= 0) {
    return 0;
  }
  return (completedTasks / dailyGoal) * 100;
}

/** Maps a raw HP number to an EmberState using thresholds from EmberStates.ts. */
export function classifyHP( hp: number ): EmberState {
  if ( hp >= EmberStates.Thriving.hpMin && hp <= EmberStates.Thriving.hpMax ) {
    return "Thriving";
  }
  if ( hp >= EmberStates.Steady.hpMin && hp <= EmberStates.Steady.hpMax ) {
    return "Steady";
  }
  if ( hp >= EmberStates.Strained.hpMin && hp <= EmberStates.Strained.hpMax ) {
    return "Strained";
  }
  if ( hp >= EmberStates.Flickering.hpMin && hp <= EmberStates.Flickering.hpMax ) {
    return "Flickering";
  }
  // ^ EDGE CASE: If HP value is outside range defined in EmberStates, return "Flickering"
  return "Flickering";
}

/** Checks if HP === 100 and if Daily Spark has been completed, then returns a boolean */
export function checkBonfire( hp: number, isDailySparkComplete: boolean ): boolean {
  return hp === BONFIRE_HP_THRESHOLD && isDailySparkComplete;
}