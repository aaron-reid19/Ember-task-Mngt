/**
 * Ember — Root Index (Entry Point Redirect)
 * Layer: UI
 * Owner: Kaley
 * Task IDs: —
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - D3: AsyncStorage module for checking onboarding status — Aaron — PENDING
 *
 * Notes:
 *   This is the first file Expo Router hits when the app launches.
 *   It doesn't render any UI — it just redirects to the right place:
 *     - If the user has completed onboarding → go to the main tabs
 *     - If this is their first launch → go to the onboarding goal setup
 *
 * WHERE MISSING WORK GETS ADDED:
 *   Replace the hardcoded `hasCompletedOnboarding = true` with a real check.
 *   ← AARON: D3 must provide a way to read whether onboarding is done.
 *   When D3 lands, this becomes:
 *     const hasCompletedOnboarding = await AsyncStorageService.getOnboardingStatus();
 */

import { Redirect } from "expo-router";

export default function Index() {
  // ┌──────────────────────────────────────────────────────────────┐
  // │ ONBOARDING CHECK                                             │
  // │ 🟡 STUB [D3] — always skips onboarding (hardcoded to true)  │
  // │ Owner: Kaley | Replaces: AsyncStorage read for onboarding    │
  // │                                                              │
  // │ ← AARON: when D3 lands, replace this with:                  │
  // │   const hasCompletedOnboarding =                             │
  // │     await AsyncStorageService.getOnboardingStatus();         │
  // │                                                              │
  // │ The onboarding screen (goal-setup.tsx) will call             │
  // │ AsyncStorageService.saveGoal() on confirm, which should also │
  // │ set the onboarding flag so this redirect works correctly.    │
  // └──────────────────────────────────────────────────────────────┘
  const hasCompletedOnboarding = true;

  // First-time users go to onboarding, returning users go straight to tabs
  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)/goal-setup" />;
  }

  return <Redirect href="/(tabs)" />;
}
