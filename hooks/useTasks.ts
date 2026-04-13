/**
 * Ember — useTasks.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L3, L4
 * Status: 🟢 READY
 *
 * Notes:
 *  - Returns the full list of tasks from Firestore
 *
 * Dependencies:
 *  - AuthContext for current user ID
 *  - FirestoreServices.getTasks for task data
 */

import { useState, useEffect } from "react";
import { Task } from "@/types";
import { useAuth } from "@/store/authContext";
import { getTasks } from "@/services/FirestoreServices";

export function useTasks(): { tasks: Task[]; loading: boolean; refresh: () => Promise<void> } {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTasks() {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const raw = await getTasks(user.uid);
      const mapped: Task[] = raw.map((doc: any) => ({
        id: doc.id,
        name: doc.title ?? doc.name ?? "",
        hpCost: doc.hpCost ?? 0,
        completed: doc.completed ?? false,
        isDailySpark: doc.isDailySpark ?? false,
        priority: doc.priority ?? "medium",
        tags: doc.tags ?? [],
        createdAt: doc.createdAt?.toDate?.()?.toISOString?.() ?? doc.createdAt ?? "",
      }));
      setTasks(mapped);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return { tasks, loading, refresh: fetchTasks };
}
