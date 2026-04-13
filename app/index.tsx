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
import { useAuth } from "@/store/authContext";
import { useAppStore } from "@/store/useAppStore";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { onboardingComplete, loading: storeLoading } = useAppStore();

  if (authLoading || storeLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  // Not signed in — send to login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Signed in but hasn't set up their goal yet
  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)/goal-setup" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
    alignItems: "center",
    justifyContent: "center",
  },
});
