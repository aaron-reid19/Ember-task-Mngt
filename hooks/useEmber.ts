/**
 * Ember — useEmber.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L1, L2, L5
 * Status: 🟡 STUB
 * 
 * Notes: 
 *  - On mount: loads cached HP from AsyncStorage immediately (instant display)
 *  - In background: loads real profile + tasks from Firestore and recomputes HP
 *  - On HP change: writes back to AsyncStorage so next launch is fast
 *  - AsyncStorage is the fast local cache; Firestore is the source of truth
 *
 * Dependencies: 
 *  - Logic Layer - useTasks (local hook) 
 *  - Data Layer - getUserProfile from FirestoreServices 
 *  - Data Layer - AsyncStorageService
 *  - Logic Layer - calculateHP, classifyHP, checkBonfire from hpEngine 
 *  - Types - HPData from @/types 
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { getUserProfile } from "@/services/FirestoreServices";
import { AsyncStorageService } from "@/services/AsyncStorageService";
import { useTasks } from "./useTasks";
import { calculateHP, classifyHP, checkBonfire } from "../utils/hpEngine";
import { HPData } from "@/types/ember";

export function useEmber(): HPData {
  const { user } = useAuth();
  const tasks = useTasks();

  // Start with a safe default - AsyncStorage will update immediately on mount
  const [emberData, setEmberData] = useState<HPData>({
    hp: 100,
    state: "Thriving",
    isBonfire: false,
  });

  // STEP 1: On mount, load the locally cached HP from AsyncStorage
  useEffect(() => {
    async function loadCachedHP() {
      try {
        const cached = await AsyncStorageService.getLocalEmberData();
        setEmberData({
          hp: cached.hp,
          state: cached.visualState,
          isBonfire: false,
        });
      } catch (error) {
        console.error("useEmber: failed to load cached HP", error);
      }
    }

    loadCachedHP();
  }, []);

  // STEP 2: When tasks + user are loaded, recompute HP from real data
  // This is the authoritative calculation that overrides the cached value
  useEffect(() => {
    if (!user || tasks.length === 0) return;

    async function recomputeHP() {
      try {
        // Load the user's profile to get their dailyGoal setting
        // ? I believe we are changing this - I'll code for now
        const profile = await getUserProfile(user!.uid) as Record<string, any>;
        const dailyGoal: number = profile?.dailyGoal ?? 5;

        // Count how many tasks are complete for today
        const completedTasks = tasks.filter((t) => t.completed).length;

        // Check if the Daily Spark has beeen completed
        const isDailySparkCompleted = tasks.some(
          (t) => t.isDailySpark && t.completed
        );

        // Run the HP formula: (completedTasks / dailyGoal) x 100
        const hp = calculateHP(completedTasks, dailyGoal);

        // Map the number to a state string ("Thriving")l
        const state = classifyHP(hp);

        // Bonfire only triggers at full HP && Daily Spark completed
        const isBonfire = checkBonfire(hp, isDailySparkCompleted);

        // Update React state so the UI re-renders
        setEmberData({ hp, state, isBonfire });

        // Write back to AsyncStorage so next app launch is instant
        await AsyncStorageService.setLocalEmberData({ hp, visualState: state });

      } catch (error) {
        console.error("useEmber: failed to recompute HP", error);
      }
    }

    recomputeHP();
  }, [user, tasks]);

  return emberData;
}