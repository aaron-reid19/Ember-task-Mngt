/**
 * Ember — useDailySpark.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L4
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

export function useDailySpark (): Task | null {
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