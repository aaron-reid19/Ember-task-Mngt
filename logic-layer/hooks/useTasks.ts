/**
 * Ember — useTasks.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L3, L4
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