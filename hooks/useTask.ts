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
 * Status: 🟢 COMPLETE
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
import { StringFormatParams } from "zod/v4/core";

export function useTask( id: string ): Task | null {
  const [task, setTask] = useState<Task | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !id) return;

    async function fetchTask() {
      try {
        // Returns null if the document doesn't exist in Firestore
        // ^ This works, but it could be better if getTaskById is fixed
        // ! getTaskById in FirestoreServices.ts is not typed on the return side
        const data = await getTaskById(user!.uid, id) as Record<string, any>;;

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
