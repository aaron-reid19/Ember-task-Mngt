/**
 * Ember — sparkEngine.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L4
 * Status: 🟤 In Progress
 * 
 * Notes: 
 *  - Randomly selects a task to be designated as the Daily Spark
 * 
 * Dependencies: 
 *  - Kaley's branch: Task type from @/types/ember — Kaley — PENDING MERGE
 */

import { Task } from "@/types/task";

/** Randomly selects a task to be designated as the Daily Spark */
export function selectDailySpark(tasks: Task[]): Task | null {
  const incomplete = tasks.filter(task => task.completed === false);
  
  // ^ EDGE CASE: Checks if array is equal to or less than zero to avoid failure
  if (incomplete.length <= 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * incomplete.length);
  return incomplete[randomIndex];
}