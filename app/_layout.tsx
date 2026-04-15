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

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotificationBanner } from "@/components/ui/NotificationBanner";
import { AuthProvider } from "@/store/authContext";
import { setupNotificationChannels, requestNotificationPermission } from "@/services/NotificationService";

export default function RootLayout() {
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  useEffect(() => {
    setupNotificationChannels();

    requestNotificationPermission().then((granted) => {
      setShowNotificationBanner(!granted);
    });
  }, []);

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
