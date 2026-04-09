/**
 * Ember — useStreak.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L6
 * Status: 🟡 STUB
 * 
 * Notes: 
 *  - Returns streak data — both the current steak and the longest streak
 * 
 * Dependencies: 
 *  - D9: History and Streak Tracking — Aaron — PENDING
 */

type StreakData = {
current: number
longest: number
}

export function useStreak(): StreakData {
  // ^ STUB VALUES: Must be changed once data layer exists
  return {
    current: 7, longest: 25
  }
}