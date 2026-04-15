/**
 * Ember — useQuest.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L7
 * Status: 🟢 READY
 *
 * Notes:
 *  - Returns a single quest by ID from Firestore
 *
 * Dependencies:
 *  - AuthContext for current user ID
 *  - FirestoreServices.getQuest for single quest fetch
 */

import { useState, useEffect } from "react";
import { Quest, QuestCadence } from "@/types";
import { useAuth } from "@/store/authContext";
import { getQuest } from "@/services/FirestoreServices";

function normalizeCadence(raw: string): QuestCadence {
  const map: Record<string, QuestCadence> = {
    today: "Once",
    once: "Once",
    daily: "Daily",
    weekly: "Weekly",
    biweekly: "Biweekly",
    monthly: "Monthly",
    custom: "Custom",
  };
  return map[raw.toLowerCase()] ?? (raw as QuestCadence);
}

export function useQuest(id: string): { quest: Quest | null; loading: boolean } {
  const { user } = useAuth();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) {
      setQuest(null);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const doc: any = await getQuest(user.uid, id);
        if (doc) {
          setQuest({
            id: doc.id,
            name: doc.title ?? doc.name ?? "",
            description: doc.description,
            hpCost: doc.hpReward ?? doc.hpCost ?? 0,
            cadence: normalizeCadence(doc.cadence ?? "Once"),
            activeDays: doc.activeDays,
            startDate: doc.startDate,
            completed: doc.completed ?? false,
            isDailySpark: doc.isDailySpark ?? false,
            status: doc.completed ? "complete" : "in progress",
          });
        } else {
          setQuest(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user, id]);

  return { quest, loading };
}
 * Status: 🟢 COMPLETE
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
        // ^ This works, but it could be better if getQuestById is fixed
        // ! getQuestById in FirestoreServices.ts is not typed on the return side
        const data = await getQuestById(user!.uid, id) as Record<string, any>;

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
