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
import type { EmberState, TaskPriority, QuestCadence } from "@/types";

export type UserProfileInput = {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
}

export type TaskInput ={
    title: string;
    notes?: string;
    priority: TaskPriority;
    tags?: string[];
    hpCost: number;
    dueDate?: string | null;
    isDailySpark?: boolean;
}

export type QuestInput = {
    title: string;
    description: string;
    hpReward: number;
    cadence: QuestCadence;
    recurrenceRule?: string | null;
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

  // tasks
  export async function createTask(userId: string, task: TaskInput): Promise<string> {
    const tasksRef = collection(db, "users", userId, "tasks");

    const docRef = await addDoc(tasksRef, {
        title: task.title,
        notes: task.notes ?? "",
        priority: task.priority,
        tags: task.tags ?? [],
        hpCost: task.hpCost,
        completed: false,
        isDailySpark: task.isDailySpark ?? false,
        dueDate: task.dueDate ?? null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
});

return docRef.id;
}

export async function getTasks(userId: string) {
const tasksRef = collection(db, "users", userId, "tasks");
const snapshot = await getDocs(tasksRef);

return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
}));
}
export async function getTaskById(userId: string, taskId: string) {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    const snapshot = await getDoc(taskRef);
  
    if (!snapshot.exists()) {
      return null;
    }
  
    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  }

export async function updateTask(
userId: string,
taskId: string,
updates: Partial<{
    title: string;
    notes: string;
    priority: TaskPriority;
    tags: string[];
    hpCost: number;
    completed: boolean;
    isDailySpark: boolean;
    dueDate: string | null;
}>
) {
const taskRef = doc(db, "users", userId, "tasks", taskId);

await updateDoc(taskRef, {
    ...updates,
    updatedAt: serverTimestamp(),
});
}

export async function toggleTaskComplete(
    userId: string,
    taskId: string,
    completed: boolean
  ) {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
  
    await updateDoc(taskRef, {
      completed,
      updatedAt: serverTimestamp(),
    });
  }

export async function deleteTask(userId: string, taskId: string) {
await deleteDoc(doc(db, "users", userId, "tasks", taskId));
}
//Quests
export async function createQuest(userId: string, quest: QuestInput) {
    const questsRef = collection(db, "users", userId, "quests");
  
    const docRef = await addDoc(questsRef, {
      title: quest.title,
      description: quest.description,
      hpReward: quest.hpReward,
      cadence: quest.cadence,
      recurrenceRule: quest.recurrenceRule ?? null,
      completed: false,
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

  export async function updateQuest(
    userId: string,
    questId: string,
    updates: Partial<{
      title: string;
      description: string;
      hpReward: number;
      cadence: QuestCadence;
      recurrenceRule: string | null;
      completed: boolean;
    }>
  ) {
    const questRef = doc(db, "users", userId, "quests", questId);
    await updateDoc(questRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
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

  export async function getTask(userId: string, taskId: string) {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    const snapshot = await getDoc(taskRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  }

  // HP Snapshots (History)
  export async function getHPSnapshots(userId: string) {
    const snapshotsRef = collection(db, "users", userId, "hpSnapshots");
    const snapshot = await getDocs(snapshotsRef);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  }

  export async function getQuestById(userId: string, questId: string) {
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

export async function deleteQuest(userId: string, questId: string) {
    await deleteDoc(doc(db, "users", userId, "quests", questId));
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
