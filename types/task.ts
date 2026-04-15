export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  hpCost: number;
  completed: boolean;
  priority: TaskPriority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}


export type NewTask = Omit<Task, "id" | "createdAt" | "updatedAt">;
// 🔵 DECISION — replaced Aaron's task.ts with Kaley's version [Apr 2026]
// ? Aaron: key differences from your version:
//   - TaskTag changed from union ("work"|"personal"|...) to string (free-form)
//   - Task changed from type to interface
//   - Added isDailySpark field (needed by Kaley's screens for spark indicators)
//   - Removed completedAt field (can be re-added if Aaron's Firestore schema needs it)
//   Resolve with team before Wave 3 integration.

/**
 * Ember — task.ts types
 * Layer: UI
 * Owner: Kaley
 * Task IDs: Wave 1 foundation
 * Status: 🟢 READY
 *
 * Notes:
 *   Aaron's Firestore schema must match this shape.
 *   Josh's hooks return arrays of Task.
 *   ? confirm hpCost range with Josh — Figma shows values like +10, +20
 */

export type TaskPriority = "low" | "medium" | "high";

export type TaskTag = string; // free-form string tags — e.g. "health", "work"

export interface Task {
  id: string;
  name: string;
  hpCost: number;        // HP restored on completion (also deducted on task creation)
  completed: boolean;
  isDailySpark: boolean; // true if this task was randomly selected as today's Spark
  priority: TaskPriority;
  tags: TaskTag[];
  createdAt: string;     // ISO timestamp
}
