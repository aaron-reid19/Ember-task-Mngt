/**
 * Ember — Auth Stack Layout
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U10
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - expo-router Stack — READY
 *
 * Notes:
 *   Headerless stack used for the login and signup screens. The tab bar does
 *   not render inside this group — users must be authed before reaching (tabs).
 *   // & see app/_layout.tsx for the auth redirect that gates this group
 */

import { Stack } from "expo-router";

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
