/**
 * Ember — useQuest.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L7
 * Status: 🟡 STUB
 * 
 * Notes: 
 *  - Returns a single quest by ID, or null if not found / still loading
 *  - Same field + cadence mapping as useQuests
 *  - Aaron's getQuestById() returns null if the doc doesn't exist
 * 
 * Dependencies: 
 *  - Data Layer - FirestoreServices: getQuestById(uid, questId)
 *  - Data Layer - authContext: useAuth()
 *  - Types: Quest, QuestCadence from @/types
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { getQuestById } from "@/services/FirestoreServices";
import { Quest, QuestCadence } from "@/types";

const CADENCE_MAP: Record<string, QuestCadence> = {
  today:     "Once",
  daily:     "Daily",
  weekly:    "Weekly",
  biweekly:  "Biweekly",
  monthly:   "Monthly",
  custom:    "Custom",
};

export function useQuest( id: string ): Quest | null {
  const [quest, setQuest] = useState<Quest | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !id) return;

    async function fetchQuest() {
      try {
        const data = await getQuestById(user!.uid, id);

        if (!data) {
          console.warn(`useQuest: no quest found with id ${id}`);
          return;
        }

        const mappedCadence: QuestCadence = CADENCE_MAP[data.cadence] ?? "Once";

        setQuest({
          id: data.id,
          name: data.title,
          description: data.description ?? undefined,
          hpCost: data.hpReward ?? 0,
          cadence: mappedCadence,
          activeDays: data.activeDays ?? undefined,
          startDate: data.startDate ?? undefined,
          completed: data.completed ?? false,
          isDailySpark: false,
          status: data.completed ? "complete" : "in progress",
        });

      } catch (error) {
          console.error(`useQuest: failed to fetch quest ${id}`, error);
      }
    }

    fetchQuest();
  }, [user, id]);

  return quest;
}