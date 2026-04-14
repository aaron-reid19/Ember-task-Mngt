/**
 * Ember — useTask.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L3, L4
 * Status: 🔴 ERROR
 * 
 * Notes: 
 *  - Returns a single task by ID, or null if not found / still loading
 *  - Aaron's getTaskById() returns null if the doc doesn't exist
 *  - Same field mapping as useTasks
 * 
 * Dependencies: 
 *  - Data Layer - FirestoreServices: getTaskById(uid, taskId)
 *  - Data Layer - authContext: useAuth() 
 *  - Types - Task from @/types
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { getTaskById } from "@/services/FirestoreServices";

import { Task } from "@/types";

export function useTask( id: string ): Task | null {
  const [task, setTask] = useState<Task | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !id) return;

    async function fetchTask() {
      try {
        // Returns null if the document doesn't exist in Firestore
        const data = await getTaskById(user!.uid, id);

        if (!data) {
          console.warn(`useTask: no task found with id ${id}`);
          return;
        }

        setTask({
          id: data.id,
          name: data.title,         // TODO: remove once Kaley fixes duplicate Task definition in task.ts
          title: data.title,        // ^ duplicate to satisfy stale Task definition
          hpCost: data.hpCost ?? 0,
          completed: data.completed ?? false,
          isDailySpark: data.isDailySpark ?? false,
          priority: data.priority ?? "medium",
          tags: data.tags ?? [],
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),  
          updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
        });
      } catch (error) {
        console.error(`useTask: failed to fetch task ${id}`, error);
      }
    }

    fetchTask();
  }, [user, id]); // Re-run if user or the requested ID changes

  return task;
}