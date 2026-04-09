/**
 * Ember — useHPHistory.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L6
 * Status: 🟡 STUB
 * 
 * Notes: 
 *  - Returns HP over time
 * 
 * Dependencies: 
 *  - D9: History and Streak Tracking — Aaron — PENDING
 */

type HPSnapshot = {
  date: string // ISO date string
  hp: number
}

export function useHPHistory(): HPSnapshot[] {
  // ^ STUB VALUES: Must be changed once data layer exists
  return [
    { date: "2026-04-08T09:00:00Z", hp: 25 },
    { date: "2026-04-07T09:00:00Z", hp: 75 },
    { date: "2026-04-06T09:00:00Z", hp: 38 },
    { date: "2026-04-05T09:00:00Z", hp: 100 }
  ]
}