// 🔵 DECISION — replaced Aaron's quest.ts with Kaley's version [Apr 2026]
// ? Aaron: key differences from your version:
//   - QuestCadence values are now Capitalized ("Once"|"Daily"|...) not lowercase ("today"|"daily"|...)
//   - Renamed hpReward → hpCost (Kaley's screens and components reference hpCost)
//   - Quest changed from type to interface
//   - Added isDailySpark, status, activeDays, startDate fields
//   - Added WeekDay type for day selector in Add Quest form
//   - Removed completedAt field (can be re-added if Firestore schema needs it)
//   ! QuestCadence capitalization change affects Josh's useQuests(cadence) filter logic
//   Resolve with team before Wave 3 integration.

/**
 * Ember — quest.ts types
 * Layer: UI
 * Owner: Kaley
 * Task IDs: Wave 1 foundation
 * Status: 🟢 READY
 *
 * Notes:
 *   QuestCadence values match the filter tabs shown in Figma Quest Board:
 *   Once / Daily / Weekly / Monthly / Custom
 *   Aaron's Firestore schema (D8) must match this shape.
 *   Josh's useQuests(cadence) hook filters by QuestCadence.
 */

export type QuestCadence = "Once" | "Daily" | "Weekly" | "Biweekly" | "Monthly" | "Custom";

// * Days of the week for weekly recurrence — matches M T W T F S S day selector in Figma
export type WeekDay = "M" | "T" | "W" | "Th" | "F" | "S" | "Su";

export interface Quest {
  id: string;
  name: string;
  description?: string;    // optional — shown in Figma Add Quest form
  hpCost: number;          // displayed as "+20 pts" on QuestCard
  cadence: QuestCadence;
  activeDays?: WeekDay[];  // only relevant when cadence is "Weekly"
  startDate?: string;      // ISO date string — set in Add Quest form
  completed: boolean;
  isDailySpark: boolean;   // true if this quest was selected as today's Spark
  status: "in progress" | "complete";
}
