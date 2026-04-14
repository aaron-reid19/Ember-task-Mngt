/**
 * Ember — useTasks.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L3, L4
 * Status: 🔴 ERROR
 * 
 * Notes:
 *  - Fetches all tasks for the current user from Firestore
 *  - Aaron's getTasks() already returns plain objects (not raw Firestore docs)
 *    so we map directly over the array — no .docs needed
 *  - SCHEMA MISMATCH: Aaron stores "title", Kaley's Task type uses "name"
 *    Bridged here in the hook so neither layer changes
 * 
 * Dependencies: 
 *  - FirestoreServices: getTasks(uid)
 *  - authContext: useAuth()
 *  - Task from @/types
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { getTasks } from "@/services/FirestoreServices";

import { Task } from "@/types";

export function useTasks(): Task[] {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // ^ Don't fetch if no user is logged in
    if (!user) return;

    async function fetchTasks() {
      try {
        const raw = await getTasks(user!.uid);

        const mapped: Task[] = raw.map((data) => ({
          id: data.id,

          // ! SCHEMA MISMATCH: Firestore field is "title. Task type uses "name"
          name: data.title,

          hpCost: data.hpCost ?? 0,
          completed: data.completed ?? false,
          isDailySpark: data.isDailySpark ?? false,
          priority: data.priority ?? "medium",
          tags: data.tags ?? [],

          // Firestore Timestamp -> ISO string
          // .toDate converts Timestamp to JS Date, .toISOString() to string
          // Falls back to now if createdAt is missing
          createdAt: data.createAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
        }));

        setTasks(mapped);
      } catch (error) {
        console.error("useTasks: failed to fetch tasks", error);
        }
    }
    
    fetchTasks();
  }, [user]);

  return tasks;
}