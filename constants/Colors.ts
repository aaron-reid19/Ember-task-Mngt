// 🔵 DECISION — replaced Aaron's Colors.ts (navy/slate palette) with Kaley's Figma-derived version (dark purple/amber) [Apr 2026]
// ? Aaron: your scaffold used different property names (screenBackground → bgDeep, cardBackground → bgCard, etc.)
//   and a different color palette. All your files that imported Colors will need property name updates.
//   Kaley's hex values came directly from Figma and must not be changed.

/**
 * Ember — Colors
 * Layer: UI
 * Owner: Kaley
 * Task IDs: Wave 1 foundation
 * Status: 🟢 READY
 *
 * Notes:
 *   All colours derived directly from Phase 3 Figma.
 *   Never write a hex value inline in a component — import from here.
 *   & see EmberStates.ts for per-state accent colours.
 */

// ~ ─────────────────────────────────────────────────────────────────
// ~ Backgrounds
// ~ ─────────────────────────────────────────────────────────────────

const Colors = {
  // * Core backgrounds — dark purple palette from Figma
  bgDeep: "#1A0A2E",       // outermost screen background (darkest purple)
  bgCard: "#2D1B4E",       // card / section background
  bgCardAlt: "#3A2260",    // slightly lighter card (filter tabs, selected states)
  bgInput: "#3A2260",      // text input background

  // ~ ─────────────────────────────────────────────────────────────────
  // ~ Text
  // ~ ─────────────────────────────────────────────────────────────────

  textPrimary: "#FFFFFF",     // main text — white
  textSecondary: "#B8A0D0",   // muted / label text — light purple-grey
  textMuted: "#7B6A95",       // very muted — disabled, placeholder

  // ~ ─────────────────────────────────────────────────────────────────
  // ~ Brand / Accent
  // ~ ─────────────────────────────────────────────────────────────────

  // * Primary orange/amber — used for active selections, HP badge, COMPLETE button
  accent: "#F5A623",
  accentDark: "#D4881A",

  // * HP bar gradient endpoints
  hpBarStart: "#C0392B",    // red left end
  hpBarEnd: "#F5A623",      // amber/orange right end

  // ~ ─────────────────────────────────────────────────────────────────
  // ~ Status / State colours
  // ~ ─────────────────────────────────────────────────────────────────

  // * These are also in EmberStates.ts — that file is the canonical source
  // * for state-specific colours. These are here for direct use only.
  thriving: "#F5A623",
  steady: "#B8A0D0",
  strained: "#C0392B",
  flickering: "#7B6A95",

  // ~ ─────────────────────────────────────────────────────────────────
  // ~ UI Chrome
  // ~ ─────────────────────────────────────────────────────────────────

  border: "#4A3070",         // card borders, dividers
  tabBarBg: "#12082A",       // tab bar background (near black-purple)
  tabBarActive: "#FFFFFF",   // active tab icon / label
  tabBarInactive: "#7B6A95", // inactive tab icon / label

  // * Pill / badge backgrounds
  pillBg: "#3A2260",
  pillBorder: "#F5A623",

  // * Priority badge colors
  priorityHigh: "#E74C3C",    // * added — confirm matches Figma
  priorityMedium: "#F5A623",  // * added — confirm matches Figma
  priorityLow: "#7B6A95",     // * added — confirm matches Figma

  // * Status indicators
  onlineGreen: "#22C55E",     // * added — confirm matches Figma

  // * Creature
  creatureBg: "#2D1B4E",      // * added — confirm matches Figma

  // * Checkbox — unchecked ring, checked fill
  checkboxUnchecked: "#4A3070",
  checkboxChecked: "#F5A623",

  // * Complete button (Daily Spark)
  completeBg: "#F5A623",
  completeText: "#1A0A2E",

  // * Day selector (M T W T F S S) in Add Quest
  daySelectorDefault: "#3A2260",
  daySelectorSelected: "#F5A623",
  daySelectorSelectedText: "#1A0A2E",
};

export default Colors;
