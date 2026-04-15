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
 * Status: 🟢 COMPLETE
 * 
 * Notes: 
 *  - Fetches all quests and applies two layers of filtering:
 *    1. isQuestDueToday — removes quests not relevant today
 *    2. cadence param — optional filter for the Quest Board tab bar
 *  - 🔴 SCHEMA MISMATCHES:
 *    · Aaron cadence lowercase → Kaley QuestCadence Capitalized
 *    · Aaron "hpReward" → Kaley "hpCost"
 *    · Aaron "title" → Kaley "name"
 *    · Aaron has no isDailySpark — defaulted to false
 * 
 * Dependencies: 
 *  - Data Layer - FirestoreServices: getQuests(uid) 
 *  - Data Layer - authContext: useAuth() 
 *  - Logic Layer - isQuestDueToday from questEngine
 *  - Types - Quest, QuestCadence from @/types 
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { getQuests } from "@/services/FirestoreServices";
import { isQuestDueToday } from "../utils/questEngine";
import { Quest, QuestCadence } from "@/types";

// ^ Maps Aaron's Firestore lowercase cadence → Kaley's capitalized QuestCadence
// TODO: remove once cadence mismatch is corrected
const CADENCE_MAP: Record<string, QuestCadence> = {
  today: "Once",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
  custom: "Custom",
};

export function useQuests(cadence?: QuestCadence): Quest[] {
  const [quests, setQuests] = useState<Quest[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function fetchQuests() {
      try {
        const raw = await getQuests(user!.uid);

        // ^ FirestoreServices.ts returns an untyped array so data becomes implicit any
        // ^ Record<string, any> tells TypeScript "this is an object with string keys 
        // ^ and unknown value"
        const mapped: Quest[] = raw.map((data: Record<string, any>) => {
          // Map cadence — fall back to "Once" if Firestore has an unrecognized value
          const mappedCadence: QuestCadence = CADENCE_MAP[data.cadence] ?? "Once";

          return {
            id: data.id,
            name: data.title,               // ! SCHEMA MISMATCH: title → name
            description: data.description ?? undefined,
            hpCost: data.hpReward ?? 0,     // ! SCHEMA MISMATCH: hpReward → hpCost
            cadence: mappedCadence,
            activeDays: data.activeDays ?? undefined,
            startDate: data.startDate ?? undefined,
            completed: data.completed ?? false,
            isDailySpark: false,            // ! SCHEMA MISMATCH: schema has no isDailySpark on quests
            status: data.completed ? "complete" : "in progress",
          };
        });

        // Filter 1: only show quests that are due today based on cadence/recurrence
        const dueToday = mapped.filter((q) => isQuestDueToday(q, new Date()));

        // Filter 2: if the Quest Board passed a cadence tab, filter to that tab
        const filtered = cadence
          ? dueToday.filter((q) => q.cadence === cadence)
          : dueToday;

        setQuests(filtered);
      } catch (error) {
        console.error("useQuests: failed to fetch quests", error);
      }
    }

    fetchQuests();
  }, [user, cadence]);

  return quests;
}
