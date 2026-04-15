/**
 * Ember — useDailySpark.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L4
 * Status: 🟢 READY
 *
 * Notes:
 *  - Returns a single task that has been randomly selected as the Daily Spark
 *  - Uses real task data from Firestore via useTasks
 *
 * Dependencies:
 *  - useTasks hook for real task list
 *  - sparkEngine.selectDailySpark for selection logic
 */

import { Task } from "@/types";
import { useTasks } from "./useTasks";
import { selectDailySpark } from "@/utils/sparkEngine";

export function useDailySpark(): { spark: Task | null; loading: boolean } {
  const { tasks, loading } = useTasks();

  if (loading) {
    return { spark: null, loading: true };
  }

  // Check if any task is already marked as daily spark
  const existingSpark = tasks.find((t) => t.isDailySpark);
  if (existingSpark) {
    return { spark: existingSpark, loading: false };
  }

  // Otherwise, randomly select one from incomplete tasks
  const spark = selectDailySpark(tasks);
  return { spark, loading: false };
}
