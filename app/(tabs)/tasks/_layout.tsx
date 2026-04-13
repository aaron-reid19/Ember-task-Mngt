/**
 * Ember — Tasks Stack Layout
 * Layer: UI
 * Owner: Kaley
 * Task IDs: —
 * Status: 🟢 READY
 *
 * Dependencies: None
 *
 * Notes:
 *   Nested stack for tasks tab — enables push from list to edit
 *   with a back button, without leaving the Tasks tab.
 */

import { Stack } from "expo-router";

export default function TasksLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
