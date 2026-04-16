/**
 * Ember — sparkEngine.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L4
 * Status: 🟢 COMPLETE
 *
 * Notes:
 *  - Randomly selects a quest to be designated as the Daily Spark
 *
 * Dependencies:
 *  - Quest type from @/types
 */

import { Quest } from "@/types";

/** Randomly selects a quest to be designated as the Daily Spark */
export function selectDailySpark(quests: Quest[]): Quest | null {
  const incomplete = quests.filter(quest => quest.completed === false);

  // ^ EDGE CASE: Checks if array is equal to or less than zero to avoid failure
  if (incomplete.length <= 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * incomplete.length);
  return incomplete[randomIndex];
}
