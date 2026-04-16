/**
 * Ember — Firestore Services
 * Layer: Data
 * Owner: Aaron
 * Task IDs: D4, D5, D6, D7, D8, D9
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - firebaseConfig.ts: initialized `db` — Aaron — READY
 *   - types/index.ts: EmberState, QuestPriority, QuestCadence — Kaley — READY
 *   - types/ember.ts: LocalEmberData — Kaley — READY
 *
 * Notes:
 *   Owns every Firestore read/write in the app: user profile, quests, and HP
 *   snapshots. UI layer must never call these functions directly — they are
 *   consumed by Josh's hooks (useQuests, useQuest, useHPHistory, etc.).
 *   // ! do not import from app/ or components/ — UI must go through hooks
 *   // * Task functions and the "tasks" collection were retired — everything
 *   //   now writes to the "quests" subcollection.
 *   // & see ADR-003 for the write-through cache pattern used with HPSyncService
 */

import { doc,
    serverTimestamp,
    setDoc,
    addDoc,
    updateDoc,
    collection,
    deleteDoc,
    getDoc,
    getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import type { LocalEmberData } from "@/types/ember";
import type { EmberState, QuestPriority, QuestCadence } from "@/types";

export type UserProfileInput = {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
}

export type QuestInput = {
    title: string;
    description?: string;
    notes?: string;
    hpReward?: number;          // legacy alias for hpCost — prefer hpCost
    hpCost?: number;
    cadence: QuestCadence;
    recurrenceRule?: string | null;
    priority?: QuestPriority;
    tags?: string[];
    isDailySpark?: boolean;
    dueDate?: string | null;
};

function profileRef (userId: string){
    return doc(db, "users", userId, "profile", "current");
}

export async function createUserProfile(userId: string, data?: UserProfileInput){
    await setDoc(profileRef(userId), {
        currentHP: 100,
        emberState: "Thriving",
        bonfireActive: false,
        onboardingComplete: false,
        displayName: data?.displayName ?? null,
        email: data?.email ?? null,
        photoURL: data?.photoURL ?? null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}

export async function ensureUserProfile(userId: string, data?: UserProfileInput){
    const snapshot = await getDoc(profileRef(userId));

    if (!snapshot.exists()){
        await createUserProfile(userId,data);
    }
}


export async function getUserProfile(userId: string) {
    const snapshot = await getDoc(profileRef(userId));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function updateUserProfile (userId: string,
updates: Partial<{
  currentHP: number;
  emberState: EmberState;
  bonfireActive: boolean;
  onboardingComplete: boolean;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}>
) {
await updateDoc(profileRef(userId), {
  ...updates,
  updatedAt: serverTimestamp(),
});
}

// Quests ------------------------------------------------------------------
export async function createQuest(userId: string, quest: QuestInput): Promise<string> {
    const questsRef = collection(db, "users", userId, "quests");

    const docRef = await addDoc(questsRef, {
        title: quest.title,
        description: quest.description ?? "",
        notes: quest.notes ?? "",
        hpCost: quest.hpCost ?? quest.hpReward ?? 0,
        cadence: quest.cadence,
        recurrenceRule: quest.recurrenceRule ?? null,
        priority: quest.priority ?? "medium",
        tags: quest.tags ?? [],
        completed: false,
        isDailySpark: quest.isDailySpark ?? false,
        dueDate: quest.dueDate ?? null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return docRef.id;
}

export async function getQuests(userId: string) {
    const questsRef = collection(db, "users", userId, "quests");
    const snapshot = await getDocs(questsRef);

    return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
    }));
}

export async function getQuest(userId: string, questId: string) {
    const questRef = doc(db, "users", userId, "quests", questId);
    const snapshot = await getDoc(questRef);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data(),
    };
}

// & alias kept so existing call sites (useQuest) don't break
export const getQuestById = getQuest;

export async function updateQuest(
    userId: string,
    questId: string,
    updates: Partial<{
        title: string;
        name: string;
        description: string;
        notes: string;
        hpCost: number;
        hpReward: number;
        cadence: QuestCadence;
        recurrenceRule: string | null;
        priority: QuestPriority;
        tags: string[];
        completed: boolean;
        isDailySpark: boolean;
        dueDate: string | null;
    }>
) {
    const questRef = doc(db, "users", userId, "quests", questId);
    await updateDoc(questRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

export async function toggleQuestComplete(
    userId: string,
    questId: string,
    completed: boolean
) {
    const questRef = doc(db, "users", userId, "quests", questId);

    await updateDoc(questRef, {
        completed,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteQuest(userId: string, questId: string) {
    await deleteDoc(doc(db, "users", userId, "quests", questId));
}

// One-time migration: copy any legacy users/{uid}/tasks/* docs into the
// quests subcollection, then delete the originals. Safe to call repeatedly —
// returns the number of docs migrated so the caller can skip future runs.
// & see DECISION in types/quest.ts — Task concept was retired, this moves data
export async function migrateTasksToQuests(userId: string): Promise<number> {
    const tasksRef = collection(db, "users", userId, "tasks");
    const snapshot = await getDocs(tasksRef);

    if (snapshot.empty) return 0;

    const questsRef = collection(db, "users", userId, "quests");
    let migrated = 0;

    for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Record<string, unknown>;
        // Tasks had no cadence — default to "today" (a one-off quest)
        await addDoc(questsRef, {
            title: data.title ?? data.name ?? "Untitled",
            description: data.description ?? "",
            notes: data.notes ?? "",
            hpCost: data.hpCost ?? 0,
            cadence: "today",
            recurrenceRule: null,
            priority: data.priority ?? "medium",
            tags: data.tags ?? [],
            completed: data.completed ?? false,
            isDailySpark: data.isDailySpark ?? false,
            dueDate: data.dueDate ?? null,
            createdAt: data.createdAt ?? serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        await deleteDoc(doc(db, "users", userId, "tasks", docSnap.id));
        migrated += 1;
    }

    return migrated;
}

// HP Snapshots (History) --------------------------------------------------
export async function getHPSnapshots(userId: string) {
    const snapshotsRef = collection(db, "users", userId, "hpSnapshots");
    const snapshot = await getDocs(snapshotsRef);

    return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
    }));
}

export async function saveHPStateToFirestore(
    userId: string,
    data: LocalEmberData
): Promise<void> {
    const emberRef = doc(db, "users", userId, "ember", "current");

    await setDoc(
        emberRef,
        {
            hp: data.hp,
            visualState: data.visualState,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}

export async function saveDailyHPSnapshot(
    userId: string,
    data: LocalEmberData
): Promise<void> {
    const dateKey = new Date().toISOString().split("T")[0];
    const snapshotRef = doc(db, "users", userId, "hpSnapshots", dateKey);

    await setDoc(
        snapshotRef,
        {
            date: dateKey,
            hp: data.hp,
            visualState: data.visualState,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}
