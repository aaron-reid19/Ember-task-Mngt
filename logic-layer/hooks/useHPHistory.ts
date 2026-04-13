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
 *  - Kaley's branch: HPSnapshot type from @/types/ember — Kaley — PENDING MERGE
 *  - D9: History and Streak Tracking — Aaron — PENDING
 */

import { HPSnapshot } from "@/types/ember";

export function useHPHistory(): HPSnapshot[] {
  // ^ STUB VALUES: Must be changed once data layer exists
  return [
    { date: "2026-04-08T09:00:00Z", hp: 25, state: "Strained" },
    { date: "2026-04-07T09:00:00Z", hp: 75, state: "Steady" },
    { date: "2026-04-06T09:00:00Z", hp: 38, state: "Strained" },
    { date: "2026-04-05T09:00:00Z", hp: 100, state: "Thriving" }
  ]
}