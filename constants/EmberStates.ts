/**
 * Ember — EmberStates
 * Layer: UI + Logic (shared contract)
 * Owner: Kaley
 * Task IDs: Wave 1 foundation
 * Status: 🟢 READY
 *
 * Notes:
 *   This file is the ONLY place HP thresholds and state colours are defined.
 *   Both the UI layer (Kaley) and the logic layer (Josh) import from here.
 *   & see ADR-004 for the HP state classification decision.
 *   ! Do not hardcode these thresholds anywhere else in the codebase.
 */

import type { EmberState } from "@/types";

export const EmberStates: Record<
  EmberState,
  {
    label: string;
    hpMin: number;
    hpMax: number;
    color: string;        // accent colour used in badges and HPBar
    creatureScale: number; // how large the fire image renders
    creatureOpacity: number;
  }
> = {
  Thriving: {
    label: "Thriving",
    hpMin: 80,
    hpMax: 100,
    color: "#F5A623",   // amber — matches Figma "Thriving" badge
    creatureScale: 1.1,
    creatureOpacity: 1.0,
  },
  Steady: {
    label: "Steady",
    hpMin: 50,
    hpMax: 79,
    color: "#B8A0D0",   // muted purple — matches Figma "Steady" label
    creatureScale: 1.0,
    creatureOpacity: 0.9,
  },
  Strained: {
    label: "Strained",
    hpMin: 20,
    hpMax: 49,
    color: "#C0392B",   // red
    creatureScale: 0.95,
    creatureOpacity: 0.7,
  },
  Flickering: {
    label: "Flickering",
    hpMin: 0,
    hpMax: 19,
    color: "#7B6A95",   // dark muted purple
    creatureScale: 0.9,
    creatureOpacity: 0.45,
  },
};

// * Bonfire is a mode triggered at 100 HP + Daily Spark complete
// * It is not a state — Josh's L5 handles the trigger detection
// & see L5 in KALEY_SCOPE.md — do not implement trigger logic here
export const BONFIRE_HP_THRESHOLD = 100;
