/**
 * Ember — Root Layout
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U10
 * Status: 🟢 READY
 *
 * Notes:
 *   The topmost layout that wraps the entire app.
 *   Every screen renders inside the <Stack /> here.
 *   The NotificationBanner is placed above the Stack so it floats over all screens
 *   when notification permission has been denied.
 *   Font loading (if custom fonts are added) would go here via expo-font's useFonts().
 */

import { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotificationBanner } from "@/components/ui/NotificationBanner";
import { AuthProvider } from "@/store/authContext";
import { useNotificationSetup } from "@/hooks/useNotificationSetup";

export default function RootLayout() {
  const { permissionGranted } = useNotificationSetup();
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  // * banner becomes visible once the permission check resolves to false
  useEffect(() => {
    if (permissionGranted === false) setShowNotificationBanner(true);
  }, [permissionGranted]);

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
