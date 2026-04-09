/**
 * Ember — useQuests.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L7
 * Status: 🟡 STUB
 * 
 * Notes: 
 *  - Returns a full list of Quests to any screen that requires them
 * 
 * Dependencies: 
 *  - Kaley's branch: Task from @/types/quest — Kaley — PENDING MERGE
 *  - D8: Quest CRUD — Aaron — PENDING
 */

import { Quest, QuestCadence } from "@/types/quest";

export function useQuests(cadence?: QuestCadence): Quest[] {
  // ^ STUB VALUES: Must be changed once data layer exists
  return [
    {
      id: "4321", name: "Wash Dishes",
      // description?: string;    
      hpCost: 10,          // displayed as "+20 pts" on QuestCard
      cadence: "Daily",
      // activeDays?: WeekDay[];  // only relevant when cadence is "Weekly"
      // startDate?: string;      // ISO date string — set in Add Quest form
      completed: true,
      isDailySpark: false,   // true if this quest was selected as today's Spark
      status: "complete"
    }
  ]
}