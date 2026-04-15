/**
 * Ember — quest.ts types
 * Layer: UI
 * Owner: Kaley
 * Task IDs: Wave 1 foundation
 * Status: 🟢 READY
 *
 * Notes:
 *   QuestCadence values are lowercase to match Firestore storage.
 *   UI display labels are provided by CADENCE_LABELS.
 *   Aaron's Firestore schema (D8) must match this shape.
 *   Josh's useQuests(cadence) hook filters by QuestCadence.
 */

export type QuestCadence = "all" | "today" | "daily" | "weekly" | "biweekly" | "monthly" | "custom";

// * Display labels for UI — maps Firestore values to human-readable text
export const CADENCE_LABELS: Record<QuestCadence, string> = {
  all: "All",
  today: "Once",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
  custom: "Custom",
};

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
