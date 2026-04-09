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

export function useDailySpark (): Task {
  // ^ STUB VALUES: Must be changed once data layer exists
  return { 
    id: "1234", name: "Workout", hpCost: 10, completed: false, isDailySpark: true,  
    priority: "high", tags: ["Fitness", "Health"], createdAt: "2026-04-08T09:00:00Z"
  }
}