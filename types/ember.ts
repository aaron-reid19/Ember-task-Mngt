export type EmberState = "Thriving" | "Steady" | "Strained" |"Flickering";

export interface LocalEmberData {
    hp: number;
    visualState: EmberState;
}
// 🔵 DECISION — replaced Aaron's ember.ts with Kaley's version [Apr 2026]
// ? Aaron: your version defined EmberState directly as a type literal here.
//   Kaley's re-exports EmberState from constants/EmberStates.ts (canonical source).
//   Also changed HPData/HPSnapshot from type to interface.

/**
 * Ember — ember.ts types
 * Layer: UI
 * Owner: Kaley
 * Task IDs: Wave 1 foundation
 * Status: 🟢 READY
 *
 * Notes:
 *   Shared with Josh's logic layer. Do not modify shape without team alignment.
 *   & see EmberStates.ts for the EmberState union type — it lives there
 *     because both files need it and that one defines the threshold contract.
 */

export type { EmberState } from "@/constants/EmberStates";

// * Returned by Josh's useEmber() hook
export interface HPData {
  hp: number;          // 0–100
  state: import("@/constants/EmberStates").EmberState;
  isBonfire: boolean;  // true only when HP === 100 AND Daily Spark was completed
}

// * Written by Aaron's D9 — one snapshot per day
export interface HPSnapshot {
  date: string;        // ISO date string "2025-04-06"
  hp: number;          // 0–100 — end-of-day value
  state: import("@/constants/EmberStates").EmberState;
}
