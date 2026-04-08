/**
 * Ember — Quests Stack Layout
 * Layer: UI
 * Owner: Kaley
 * Task IDs: —
 * Status: 🟢 READY
 *
 * Dependencies: None
 *
 * Notes:
 *   Nested stack for quests tab — enables push from list to detail
 *   with a back button, without leaving the Quests tab.
 */

import { Stack } from "expo-router";

export default function QuestsLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
