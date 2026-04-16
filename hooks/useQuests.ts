/**
 * Ember — useQuests.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L3, L4, L7
 * Status: 🟢 READY
 *
 * Notes:
 *  - Returns quests from Firestore, optionally filtered by cadence
 *  - Absorbed the former useTasks hook — Task was retired in favour of Quest
 *
 * Dependencies:
 *  - AuthContext for current user ID
 *  - FirestoreServices.getQuests / updateQuest / createQuest
 */

import { useState, useEffect, useCallback } from "react";
import { Quest, QuestCadence } from "@/types";
import { useAuth } from "@/store/authContext";
import {
  getQuests,
  updateQuest as updateQuestService,
  createQuest as createQuestService,
  type QuestInput,
} from "@/services/FirestoreServices";

export function useQuests(cadence?: QuestCadence): {
  quests: Quest[];
  loading: boolean;
  refresh: () => Promise<void>;
  update: (questId: string, updates: Record<string, unknown>) => Promise<void>;
  create: (quest: QuestInput) => Promise<string | undefined>;
  toggle: (questId: string) => Promise<void>;
} {
  const { user } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchQuests() {
    if (!user) {
      setQuests([]);
      setLoading(false);
      return;
    }

    try {
      const raw = await getQuests(user.uid);
      let mapped: Quest[] = raw.map((doc: any) => ({
        id: doc.id,
        name: doc.title ?? doc.name ?? "",
        title: doc.title,
        description: doc.description,
        hpCost: doc.hpCost ?? doc.hpReward ?? 0,
        cadence: (doc.cadence ?? "daily") as QuestCadence,
        activeDays: doc.recurrenceRule
          ? doc.recurrenceRule.split(",")
          : doc.activeDays ?? [],
        startDate: doc.startDate,
        completed: doc.completed ?? false,
        isDailySpark: doc.isDailySpark ?? false,
        status: doc.completed ? "complete" : "in progress",
        priority: doc.priority ?? "medium",
        tags: doc.tags ?? [],
        createdAt: doc.createdAt?.toDate?.()?.toISOString?.() ?? doc.createdAt ?? "",
      }));

      if (cadence && cadence !== "all") {
        mapped = mapped.filter((q) => q.cadence === cadence);
      }

      setQuests(mapped);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuests();
  }, [user, cadence]);

  const update = useCallback(async (questId: string, updates: Record<string, unknown>) => {
    if (!user) return;
    await updateQuestService(user.uid, questId, updates);
    await fetchQuests();
  }, [user]);

  const create = useCallback(async (quest: QuestInput) => {
    if (!user) return;
    const id = await createQuestService(user.uid, quest);
    await fetchQuests();
    return id;
  }, [user]);

  const toggle = useCallback(async (questId: string) => {
    if (!user) return;
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;
    await updateQuestService(user.uid, questId, { completed: !quest.completed });
    await fetchQuests();
  }, [user, quests]);

  return { quests, loading, refresh: fetchQuests, update, create, toggle };
}
