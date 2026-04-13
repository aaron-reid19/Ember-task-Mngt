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

import { useState, useEffect } from "react";
import { Quest, QuestCadence } from "@/types";
import { useAuth } from "@/store/authContext";
import { getQuests } from "@/services/FirestoreServices";

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

export function useQuests(cadence?: QuestCadence): { quests: Quest[]; loading: boolean; refresh: () => Promise<void> } {
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
        cadence: normalizeCadence(doc.cadence ?? "Once"),
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

  return { quests, loading, refresh: fetchQuests };
}
