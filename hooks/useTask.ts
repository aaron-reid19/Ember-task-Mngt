/**
 * Ember — useTask.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L3, L4
 * Status: 🟢 READY
 *
 * Notes:
 *  - Returns a single task by ID from Firestore
 *
 * Dependencies:
 *  - AuthContext for current user ID
 *  - FirestoreServices.getTask for single task fetch
 */

import { useState, useEffect } from "react";
import { Task } from "@/types";
import { useAuth } from "@/store/authContext";
import { getTask } from "@/services/FirestoreServices";

export function useTask(id: string): { task: Task | null; loading: boolean } {
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) {
      setTask(null);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const doc: any = await getTask(user.uid, id);
        if (doc) {
          setTask({
            id: doc.id,
            name: doc.title ?? doc.name ?? "",
            hpCost: doc.hpCost ?? 0,
            completed: doc.completed ?? false,
            isDailySpark: doc.isDailySpark ?? false,
            priority: doc.priority ?? "medium",
            tags: doc.tags ?? [],
            createdAt: doc.createdAt?.toDate?.()?.toISOString?.() ?? doc.createdAt ?? "",
          });
        } else {
          setTask(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user, id]);

  return { task, loading };
}
