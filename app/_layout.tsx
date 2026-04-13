/**
 * Ember — Root Layout
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U10
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - D12: Notification permission check — Aaron — PENDING
 *
 * Notes:
 *   The topmost layout that wraps the entire app.
 *   Every screen renders inside the <Stack /> here.
 *   The NotificationBanner is placed above the Stack so it floats over all screens
 *   when notification permission has been denied.
 *
 *   ^ Aaron's D2 (folder scaffold) may also create/modify this file — coordinate on merge.
 *
 * WHERE MISSING WORK GETS ADDED:
 *   1. Replace the hardcoded `showNotificationBanner` with a real permission check.
 *      ← AARON: D12 must provide a function to check notification permission status.
 *      When D12 lands, call it in a useEffect on mount and set the banner state from the result.
 *   2. Font loading (if custom fonts are added) would go here via expo-font's useFonts().
 */

import { useState } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotificationBanner } from "@/components/ui/NotificationBanner";
import { AuthProvider } from "@/store/authContext";

export default function RootLayout() {
  // ┌──────────────────────────────────────────────────────────────┐
  // │ NOTIFICATION PERMISSION STATE                                │
  // │ 🟡 STUB [D12] — hardcoded to false (banner hidden)          │
  // │ Owner: Kaley | Replaces: real permission check from Aaron    │
  // │                                                              │
  // │ 🔴 BLOCKED [D12] — waiting on Aaron's permission module     │
  // │ Unblock: NotificationService.ts must export a function like  │
  // │   getPermissionStatus() that returns "granted" | "denied"    │
  // │                                                              │
  // │ ← AARON: when D12 is done, replace the useState(false)      │
  // │   below with a useEffect that calls your permission check:   │
  // │                                                              │
  // │   useEffect(() => {                                          │
  // │     const status = await NotificationService.getPermStatus();│
  // │     setShowNotificationBanner(status === "denied");          │
  // │   }, []);                                                    │
  // └──────────────────────────────────────────────────────────────┘
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        {/* Banner sits above the navigation stack — visible on all screens */}
        <NotificationBanner
          visible={showNotificationBanner}
          onDismiss={() => setShowNotificationBanner(false)}
        />

        {/* All screens render inside this Stack — headerShown:false lets each screen control its own header */}
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
