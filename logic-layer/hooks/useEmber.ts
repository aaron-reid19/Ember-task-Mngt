/**
 * Ember — useEmber.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L1, L2, L5
 * Status: 🟡 STUB
 * 
 * Notes: 
 *  - Takes values returned from calculateHP(), classifyHP(), and checkBonfire()
 *  - Returns an HPData interface with said values
 *
 * Dependencies: 
 *  - Kaley's branch: HPData type from @/types/ember — Kaley — PENDING MERGE
 *  - D3: AsyncStorage read for dailyGoal and hp on mount — Aaron —  PENDING
 *  - D6: HP sync contract (AsyncStorage + Firestore) — Aaron — PENDING
 *  - D7: Task CRUD (completedTasks count) — Aaron — PENDING
 */

import { HPData } from "@/types/ember";
import { calculateHP, classifyHP, checkBonfire } from "../utils/hpEngine";

export function useEmber(): HPData {
  // TODO: Replace with AsyncStorage reads from D3 and D7
  const completedTasks = 3;
  const dailyGoal = 5;
  const isDailySparkCompleted = false;

  const hp = calculateHP(completedTasks, dailyGoal);
  const state = classifyHP(hp);
  const isBonfire = checkBonfire(hp, isDailySparkCompleted);

  return { hp, state, isBonfire }
}