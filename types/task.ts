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
 *
 * 🔵 DECISION — merged Aaron's and Kaley's Task definitions [Apr 2026]
 *   Aaron's version had: title, updatedAt, description
 *   Kaley's version had: name, isDailySpark
 *   Unified type keeps all fields. Hooks bridge title→name in mapping.
 */

export type TaskPriority = "low" | "medium" | "high";

export type TaskTag = string; // free-form string tags — e.g. "health", "work"

export interface Task {
  id: string;
  name: string;              // display name (hooks map Aaron's "title" → "name")
  title?: string;            // Aaron's Firestore field name — kept for compatibility
  description?: string;
  hpCost: number;            // HP restored on completion (also deducted on task creation)
  completed: boolean;
  isDailySpark: boolean;     // true if this task was randomly selected as today's Spark
  priority: TaskPriority;
  tags: TaskTag[];
  createdAt: string;         // ISO timestamp
  updatedAt?: string;        // ISO timestamp — optional, Aaron's schema includes this
}

export type NewTask = Omit<Task, "id" | "createdAt" | "updatedAt">;
