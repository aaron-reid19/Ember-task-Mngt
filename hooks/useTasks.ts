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
 * Status: 🟢 COMPLETE
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

        // ^ FirestoreServices.ts returns an untyped array so data becomes implicit any
        // ^ Record<string, any> tells TypeScript "this is an object with string keys 
        // ^ and unknown value"
        const mapped: Task[] = raw.map((data: Record<string, any>) => ({
          id: data.id,
          name: data.title,
          title: data.title,        // TODO: remove once Kaley fixes duplicate Task definition in task.ts
          hpCost: data.hpCost ?? 0,
          completed: data.completed ?? false,
          isDailySpark: data.isDailySpark ?? false,
          priority: data.priority ?? "medium",
          tags: data.tags ?? [],
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
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
