/**
 * Ember — Onboarding Layout
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U9
 * Status: 🟢 READY
 *
 * Dependencies: None
 *
 * Notes:
 *   Separate layout from tabs — no tab bar during onboarding.
 */

import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
