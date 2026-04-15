/**
 * One-time seed script for the demo account.
 *
 * Populates Firestore with ~30 days of realistic HP snapshots, tasks, quests,
 * and the current ember state so that the Profile screen graphics have data.
 *
 * Usage:
 *   npx ts-node scripts/seedDemoData.ts
 *
 * Uses the same demo credentials as the app's "Skip — use demo account" button.
 */

import { config } from "dotenv";
config(); // load .env

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  writeBatch,
  Timestamp,
} from "firebase/firestore";

// ── Firebase init (mirrors services/firebaseConfig.ts) ──────────────────────
const app = initializeApp({
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
});

const auth = getAuth(app);
const db = getFirestore(app);

// ── Types ───────────────────────────────────────────────────────────────────
type EmberState = "Thriving" | "Steady" | "Strained" | "Flickering";

function hpToState(hp: number): EmberState {
  if (hp > 80) return "Thriving";
  if (hp >= 50) return "Steady";
  if (hp >= 20) return "Strained";
  return "Flickering";
}

// ── Date helpers ────────────────────────────────────────────────────────────
function isoDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
}

// ── 1. HP Snapshots ─────────────────────────────────────────────────────────
// Hand-crafted 30-day arc:
//   Days 30-24 (week 1): Steady start ~55-68
//   Days 23-17 (week 2): Good week, climbing to 85-100 (bonfire!)
//   Days 16-10 (week 3): Dip to 20-35 (strained/flickering)
//   Days  9-0  (week 4): Recovery toward 65-75
const HP_VALUES: number[] = [
  /* day 30 */ 58,
  /* day 29 */ 62,
  /* day 28 */ 55,
  /* day 27 */ 60,
  /* day 26 */ 65,
  /* day 25 */ 68,
  /* day 24 */ 64,
  /* day 23 */ 72,
  /* day 22 */ 78,
  /* day 21 */ 82,
  /* day 20 */ 88,
  /* day 19 */ 93,
  /* day 18 */ 100,
  /* day 17 */ 85,
  /* day 16 */ 70,
  /* day 15 */ 55,
  /* day 14 */ 42,
  /* day 13 */ 35,
  /* day 12 */ 28,
  /* day 11 */ 22,
  /* day 10 */ 18,
  /* day  9 */ 25,
  /* day  8 */ 32,
  /* day  7 */ 40,
  /* day  6 */ 48,
  /* day  5 */ 55,
  /* day  4 */ 62,
  /* day  3 */ 68,
  /* day  2 */ 72,
  /* day  1 */ 70,
  /* day  0 */ 74,
];

function buildSnapshots(userId: string) {
  return HP_VALUES.map((hp, i) => {
    const dayOffset = 30 - i;
    const date = daysAgo(dayOffset);
    const completedTasks = Math.round((hp / 100) * 8); // rough correlation
    return {
      ref: doc(db, "users", userId, "hpSnapshots", isoDate(date)),
      data: {
        date: isoDate(date),
        hp,
        visualState: hpToState(hp),
        updatedAt: Timestamp.fromDate(date),
      },
    };
  });
}

// ── 2. Tasks ────────────────────────────────────────────────────────────────
const TASKS = [
  { title: "Study for DMIT quiz", priority: "high" as const, tags: ["school"], hpCost: 3, completed: true, daysAgoCreated: 12 },
  { title: "Go for a walk", priority: "low" as const, tags: ["health"], hpCost: 1, completed: true, daysAgoCreated: 20 },
  { title: "Read chapter 5", priority: "medium" as const, tags: ["school"], hpCost: 2, completed: true, daysAgoCreated: 8 },
  { title: "Clean desk", priority: "low" as const, tags: ["home"], hpCost: 1, completed: false, daysAgoCreated: 3 },
  { title: "Message group chat", priority: "medium" as const, tags: ["social"], hpCost: 1, completed: true, daysAgoCreated: 15 },
  { title: "Finish lab report", priority: "high" as const, tags: ["school"], hpCost: 3, completed: false, daysAgoCreated: 2 },
  { title: "Meal prep Sunday", priority: "medium" as const, tags: ["health"], hpCost: 2, completed: true, daysAgoCreated: 10 },
  { title: "Reply to prof email", priority: "high" as const, tags: ["school"], hpCost: 1, completed: true, daysAgoCreated: 6 },
  { title: "Organize notes folder", priority: "low" as const, tags: ["school"], hpCost: 1, completed: false, daysAgoCreated: 1 },
  { title: "30-min jog", priority: "medium" as const, tags: ["health"], hpCost: 2, completed: true, daysAgoCreated: 4 },
];

function buildTasks(userId: string) {
  return TASKS.map((t, i) => {
    const created = daysAgo(t.daysAgoCreated);
    const taskId = `seed-task-${i}`;
    return {
      ref: doc(db, "users", userId, "tasks", taskId),
      data: {
        title: t.title,
        notes: "",
        priority: t.priority,
        tags: t.tags,
        hpCost: t.hpCost,
        completed: t.completed,
        isDailySpark: i === 0, // first task is the daily spark
        dueDate: null,
        createdAt: Timestamp.fromDate(created),
        updatedAt: Timestamp.fromDate(created),
      },
    };
  });
}

// ── 3. Quests ───────────────────────────────────────────────────────────────
const QUESTS = [
  { title: "Morning stretch", description: "5-minute stretch routine after waking up", cadence: "daily" as const, hpReward: 5, completedCount: 22 },
  { title: "Weekly review", description: "Review goals and plan the upcoming week", cadence: "weekly" as const, hpReward: 10, completedCount: 3 },
  { title: "Study-group check-in", description: "Biweekly sync with study group on Discord", cadence: "biweekly" as const, hpReward: 8, completedCount: 2 },
  { title: "Clean room", description: "Full room tidy and vacuum", cadence: "weekly" as const, hpReward: 8, completedCount: 4 },
  { title: "Journal entry", description: "Write a short reflection on the day", cadence: "daily" as const, hpReward: 5, completedCount: 18 },
  { title: "Monthly budget review", description: "Check spending and update budget spreadsheet", cadence: "monthly" as const, hpReward: 15, completedCount: 1 },
];

function buildQuests(userId: string) {
  const created = daysAgo(28); // quests created near start of window
  return QUESTS.map((q, i) => {
    const questId = `seed-quest-${i}`;
    return {
      ref: doc(db, "users", userId, "quests", questId),
      data: {
        title: q.title,
        description: q.description,
        hpReward: q.hpReward,
        cadence: q.cadence,
        recurrenceRule: null,
        completed: false,
        createdAt: Timestamp.fromDate(created),
        updatedAt: Timestamp.fromDate(created),
      },
    };
  });
}

// ── 4. Current ember state (matches today's HP) ────────────────────────────
function buildEmberState(userId: string) {
  const todayHP = HP_VALUES[HP_VALUES.length - 1]; // 74
  return {
    ref: doc(db, "users", userId, "ember", "current"),
    data: {
      hp: todayHP,
      visualState: hpToState(todayHP),
      updatedAt: Timestamp.now(),
    },
  };
}

// ── 5. Profile update (sync HP + state) ─────────────────────────────────────
function buildProfileUpdate(userId: string) {
  const todayHP = HP_VALUES[HP_VALUES.length - 1];
  return {
    ref: doc(db, "users", userId, "profile", "current"),
    data: {
      currentHP: todayHP,
      emberState: hpToState(todayHP),
      bonfireActive: false,
      updatedAt: Timestamp.now(),
    },
  };
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  // Same credentials as app/(auth)/login.tsx demo button
  const email = "demo@ember.app";
  const password = "demo1234";

  // Sign in as the demo user
  console.log(`Signing in as ${email}...`);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const userId = cred.user.uid;
  console.log(`Authenticated. UID: ${userId}\n`);

  // Build all documents
  const snapshots = buildSnapshots(userId);
  const tasks = buildTasks(userId);
  const quests = buildQuests(userId);
  const ember = buildEmberState(userId);
  const profile = buildProfileUpdate(userId);

  // Firestore batches are limited to 500 ops each. We have ~50 docs total, so one batch is fine.
  const batch = writeBatch(db);

  for (const s of snapshots) batch.set(s.ref, s.data);
  for (const t of tasks) batch.set(t.ref, t.data);
  for (const q of quests) batch.set(q.ref, q.data);
  batch.set(ember.ref, ember.data, { merge: true });
  batch.set(profile.ref, profile.data, { merge: true });

  console.log("Writing batch to Firestore...");
  await batch.commit();

  console.log(`\n✅ Wrote ${snapshots.length} HP snapshots`);
  console.log(`✅ Wrote ${tasks.length} tasks`);
  console.log(`✅ Wrote ${quests.length} quests`);
  console.log(`✅ Wrote ember/current state (HP ${ember.data.hp}, ${ember.data.visualState})`);
  console.log(`✅ Updated profile/current (HP ${profile.data.currentHP}, ${profile.data.emberState})`);
  console.log("\nSeed complete! 🌱");

  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
