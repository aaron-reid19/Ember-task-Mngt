/**
 * Ember — useQuest.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L3, L7
 * Status: 🟢 READY
 *
 * Notes:
 *  - Returns a single quest by ID from Firestore
 *  - Absorbed the former useTask hook — Task was retired in favour of Quest
 *
 * Dependencies:
 *  - AuthContext for current user ID
 *  - FirestoreServices.getQuest for single quest fetch
 */

import { useState, useEffect } from "react";
import { Quest, QuestCadence } from "@/types";
import { useAuth } from "@/store/authContext";
import { getQuest } from "@/services/FirestoreServices";

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
            title: doc.title,
            description: doc.description,
            hpCost: doc.hpCost ?? doc.hpReward ?? 0,
            cadence: (doc.cadence ?? "today") as QuestCadence,
            activeDays: doc.activeDays,
            startDate: doc.startDate,
            completed: doc.completed ?? false,
            isDailySpark: doc.isDailySpark ?? false,
            status: doc.completed ? "complete" : "in progress",
            priority: doc.priority ?? "medium",
            tags: doc.tags ?? [],
            createdAt: doc.createdAt?.toDate?.()?.toISOString?.() ?? doc.createdAt ?? "",
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
