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
