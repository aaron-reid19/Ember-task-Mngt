/**
 * Ember — ember.ts types
 * Layer: UI
 * Owner: Kaley
 * Task IDs: Wave 1 foundation
 * Status: 🟢 READY
 *
 * Notes:
 *   Shared with Josh's logic layer. Do not modify shape without team alignment.
 *   & see EmberStates.ts for the HP threshold contract.
 *
 * 🔵 DECISION — merged Aaron's and Kaley's ember.ts definitions [Apr 2026]
 *   Aaron's version defined: EmberState, LocalEmberData
 *   Kaley's version defined: EmberState (re-export), HPData, HPSnapshot
 *   Unified file keeps all types.
 */

export type EmberState = "Thriving" | "Steady" | "Strained" | "Flickering";

// * Used by Aaron's AsyncStorageService for local caching
export interface LocalEmberData {
  hp: number;
  visualState: EmberState;
}

// * Returned by Josh's useEmber() hook
export interface HPData {
  hp: number;          // 0–100
  state: EmberState;
  isBonfire: boolean;  // true only when HP === 100 AND Daily Spark was completed
}

// * Written by Aaron's D9 — one snapshot per day
export interface HPSnapshot {
  date: string;        // ISO date string "2025-04-06"
  hp: number;          // 0–100 — end-of-day value
  state: EmberState;
}
