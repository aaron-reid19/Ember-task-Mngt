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

import { useEffect, useRef } from "react";
import { HPData, Task } from "@/types";
import { calculateHP, classifyHP, checkBonfire } from "@/utils/hpEngine";
import { useTasks } from "./useTasks";
import { useAppStore } from "@/store/useAppStore";
import { useAuth } from "@/store/authContext";
import { HPSyncService } from "@/services/HPSyncServices";

export function useEmber(externalTasks?: Task[]): HPData & { loading: boolean } {
  const { tasks: internalTasks, loading: tasksLoading } = useTasks();
  const { loading: storeLoading } = useAppStore();
  const { user } = useAuth();

  const tasks = externalTasks ?? internalTasks;
  const loading = (externalTasks ? false : tasksLoading) || storeLoading;

  // Sum hpCost across all tasks and completed tasks
  const totalHP = tasks.reduce((sum, t) => sum + (t.hpCost ?? 0), 0);
  const completedHP = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (t.hpCost ?? 0), 0);

  const isDailySparkCompleted = tasks.some((t) => t.isDailySpark && t.completed);

  const hp = Math.min(100, Math.ceil(calculateHP(completedHP, totalHP)));
  const state = classifyHP(hp);
  const isBonfire = checkBonfire(hp, isDailySparkCompleted);

  // Persist HP to AsyncStorage + Firestore whenever it changes
  const prevHP = useRef<number | null>(null);
  useEffect(() => {
    if (loading || prevHP.current === hp) return;
    prevHP.current = hp;

    if (user) {
      HPSyncService.saveHPState(user.uid, { hp, visualState: state });
    }
  }, [hp, state, loading, user]);

  return { hp, state, isBonfire, loading };
}
