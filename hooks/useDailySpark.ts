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
import { selectDailySpark } from "./utils/sparkEngine";

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
 * Status: 🟢 COMPLETE
 * 
 * Notes: 
 *  - Replaces hardcoded stub tasks with real data from useTasks()
 *  - selectDailySpark internally filters for completed === false
 *    so we don't need to pre-filter here
 *  - Returns null if all tasks are done or no tasks exist
 * 
 * Dependencies: 
 *  - Logic Layer - useTasks (local hook) 
 *  - Logic Layer - selectDailySpark from sparkEngine
 *  - Types: Task from @/types
 */

import { useState, useEffect } from "react";
import { useTasks } from "./useTasks";
import { selectDailySpark } from "../utils/sparkEngine";
import { Task } from "@/types/task";

export function useDailySpark(): Task | null {
  const [spark, setSpark] = useState<Task | null>(null);
  const tasks = useTasks();

  useEffect(() => {
    // selectDailySpark filters incomplete tasks and picks one randomly
    // Will return null if no incomplete tasks remain
    const selected = selectDailySpark(tasks);
    setSpark(selected);
  }, [tasks]); // Re-run whenever the task list updates

  return spark;
}
