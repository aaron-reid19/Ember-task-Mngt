/**
 * Ember — useTasks.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L3, L4
 * Status: 🟤 IN PROGRESS
 * 
 * Notes: 
 *  - Returns the full list of tasks to any screen that needs them
 * 
 * Dependencies: 
 *  - D7: Task CRUD — Aaron — PENDING
 */

type Task = {
  id: string
  name: string
  priority: "High" | "Medium" | "Low"
  tags: string[]
  completed: boolean
  isDailySpark: boolean
  dueDate?: string
  notes?: string
}

/** Returns the full list of tasks */
export function useTasks(): Task[] {
  // ^ STUB VALUES: Must be changed once data layer exists
  return [
    { 
      id: "1234", name: "Workout", priority: "High", tags: ["Fitness", "Health"],
      completed: false, isDailySpark: true, notes: "Leg Day" }
  ]
}