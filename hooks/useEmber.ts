/**
 * Ember — useEmber.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L1, L2, L5
 * Status: 🟢 READY
 *
 * Notes:
 *  - Computes Ember's HP from real quest data using hpCost values
 *  - HP = (sum of completed quest hpCosts / sum of all quest hpCosts) × 100
 *  - Returns HPData (hp, state, isBonfire) plus loading flag
 *
 * Dependencies:
 *  - useQuests for quest list with hpCost values
 *  - useAppStore for loading state
 */

import { useEffect, useRef } from "react";
import { HPData, Quest } from "@/types";
import { calculateHP, classifyHP, checkBonfire } from "@/utils/hpEngine";
import { useQuests } from "./useQuests";
import { useAppStore } from "@/store/useAppStore";
import { useAuth } from "@/store/authContext";
import { HPSyncService } from "@/services/HPSyncServices";

export function useEmber(externalQuests?: Quest[]): HPData & { loading: boolean } {
  const { quests: internalQuests, loading: questsLoading } = useQuests();
  const { loading: storeLoading } = useAppStore();
  const { user } = useAuth();

  const quests = externalQuests ?? internalQuests;
  const loading = (externalQuests ? false : questsLoading) || storeLoading;

  // Sum hpCost across all quests and completed quests
  const totalHP = quests.reduce((sum, q) => sum + (q.hpCost ?? 0), 0);
  const completedHP = quests
    .filter((q) => q.completed)
    .reduce((sum, q) => sum + (q.hpCost ?? 0), 0);

  const isDailySparkCompleted = quests.some((q) => q.isDailySpark && q.completed);

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
