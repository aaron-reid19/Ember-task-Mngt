/**
 * Ember — useTasks.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L3, L4
 * Status: 🟡 STUB
 * 
 * Notes: 
 *  - Returns the full list of tasks to any screen that needs them
 * 
 * Dependencies: 
 *  - Kaley's branch: Task from @/types/task — Kaley — PENDING MERGE
 *  - D7: Task CRUD — Aaron — PENDING
 */

import { Task } from "@/types/task";

export function useTasks(): Task[] {
  // ^ STUB VALUES: Must be changed once data layer exists
  return [
    { 
      id: "1234", name: "Workout", hpCost: 10, completed: false, isDailySpark: true,  
      priority: "high", tags: ["Fitness", "Health"], createdAt: "2026-04-08T09:00:00Z"
    }
  ]
}