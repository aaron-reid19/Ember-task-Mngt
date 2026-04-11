/**
 * Ember — useDailySpark.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L4
 * Status: 🟡 STUB
 * 
 * Notes: 
 *  - Returns an single task that has been randomly selected as the Daily Spark
 * 
 * Dependencies: 
 *  - Kaley's branch: Task from @/types/task — Kaley — PENDING MERGE
 *  - D7: Task CRUD — Aaron — PENDING
 */

import { Task } from "@/types/task";
import { selectDailySpark } from "../utils/sparkEngine";

export function useDailySpark (): Task | null {
  // ^ STUB VALUES: Must be changed once data layer exists
  const tasks: Task[] = [
    { id: "1", name: "Workout", hpCost: 10, completed: false, isDailySpark: false, priority: "high", tags: ["Fitness"], createdAt: "2026-04-11T09:00:00Z" },
    { id: "2", name: "Read for 20 Minutes", hpCost: 5, completed: false, isDailySpark: false, priority: "low", tags: ["Learning"], createdAt: "2026-04-11T09:00:00Z" },
    { id: "3", name: "Drink Water", hpCost: 3, completed: true, isDailySpark: false, priority: "medium", tags: ["Health"], createdAt: "2026-04-11T09:00:00Z" }
  ];

  const dailySpark = selectDailySpark(tasks);
  return dailySpark;
}