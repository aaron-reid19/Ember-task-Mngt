/**
 * Ember — useEmber.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L1, L2, L5
 * Status: 🟢 READY
 *
 * Notes:
 *  - Computes Ember's HP from real task data using hpCost values
 *  - HP = (sum of completed task hpCosts / sum of all task hpCosts) × 100
 *  - Returns HPData (hp, state, isBonfire) plus loading flag
 *
 * Dependencies:
 *  - useTasks for task list with hpCost values
 *  - useAppStore for loading state
 */

import { HPData } from "@/types";
import { calculateHP, classifyHP, checkBonfire } from "./utils/hpEngine";
import { useTasks } from "./useTasks";
import { useAppStore } from "@/store/useAppStore";

export function useEmber(): HPData & { loading: boolean } {
  const { tasks, loading: tasksLoading } = useTasks();
  const { loading: storeLoading } = useAppStore();

  const loading = tasksLoading || storeLoading;

  // Sum hpCost across all tasks and completed tasks
  const totalHP = tasks.reduce((sum, t) => sum + (t.hpCost ?? 0), 0);
  const completedHP = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (t.hpCost ?? 0), 0);

  const isDailySparkCompleted = tasks.some((t) => t.isDailySpark && t.completed);

  const hp = calculateHP(completedHP, totalHP);
  const state = classifyHP(hp);
  const isBonfire = checkBonfire(hp, isDailySparkCompleted);

  return { hp, state, isBonfire, loading };
}
