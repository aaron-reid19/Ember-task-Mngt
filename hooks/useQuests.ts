/**
 * Ember — useQuests.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L7
 * Status: 🟢 READY
 *
 * Notes:
 *  - Returns quests from Firestore, optionally filtered by cadence
 *
 * Dependencies:
 *  - AuthContext for current user ID
 *  - FirestoreServices.getQuests for quest data
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
        description: doc.description,
        hpCost: doc.hpReward ?? doc.hpCost ?? 0,
        cadence: (doc.cadence ?? "today") as QuestCadence,
        activeDays: doc.activeDays,
        startDate: doc.startDate,
        completed: doc.completed ?? false,
        isDailySpark: doc.isDailySpark ?? false,
        status: doc.completed ? "complete" : "in progress",
      }));

      if (cadence) {
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
