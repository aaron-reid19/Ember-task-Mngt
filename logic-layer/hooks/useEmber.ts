/**
 * Ember — useEmber.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L1, L2, L5
 * Status: 🟤 STUB
 * 
 * Notes: 
 *  - Takes values returned from calculateHP(), classifyHP(), and checkBonfire()
 *  - Returns an HPData interface with said values
 *  - CURRENTLY USES STUB VALUES TO TEST FUNCTIONALITY. WILL BE CHANGED LATER
 * 
 * Dependencies: 
 *  - Kaley's branch: HPData type from @/types/ember — Kaley — PENDING MERGE
 *  - D3: AsyncStorage read for dailyGoal and hp on mount — Aaron —  PENDING
 *  - D6: HP sync contract (AsyncStorage + Firestore) — Aaron — PENDING
 *  - D7: Task CRUD (completedTasks count) — Aaron — PENDING
 */

import { HPData, EmberState } from "@/types/ember";
import { calculateHP, classifyHP, checkBonfire } from "../utils/hpEngine";

/** Returns an HPData interface using the values returned from helper functions */
export function useEmber(): HPData {
  // ^ STUB VALUES: Must be changed once data layer exists
  const hp = 72;
  const state: EmberState = "Steady";
  const isBonfire = false;

  return { hp, state, isBonfire }
}