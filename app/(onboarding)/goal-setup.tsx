/**
 * Ember — Onboarding: Welcome
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U9
 * Status: 🟢 READY
 *
 * Notes:
 *   Shown exactly once, on the user's very first launch.
 *   Introduces Ember and marks onboardingComplete in Firestore.
 *   Uses router.replace() to go to tabs — this REPLACES the navigation stack,
 *   so the user cannot press back to return to onboarding.
 *
 *   No tab bar is visible — (onboarding) has its own layout separate from (tabs).
 *
 *   🔵 DECISION — No RHF+Zod on this screen: no user-editable fields.
 *   The dailyGoal stepper was moved to the Profile screen (U8).
 *   QA_FIXES_HANDOFF Fix 2 Step 3 no longer applies here.
 */

import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { useAuth } from "@/store/authContext";
import { useProfile } from "@/hooks/useProfile";

export default function GoalSetupScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { completeOnboarding } = useProfile();
  const [submitting, setSubmitting] = useState(false);

  async function onContinue() {
    setSubmitting(true);
    await completeOnboarding();
    router.replace("/(tabs)");
  }

  async function onBack() {
    await logout();
    router.replace("/(auth)/login");
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </Pressable>

      <View style={styles.centeredContent}>
        <Text style={styles.welcomeTitle}>Welcome to Ember</Text>
        <Text style={styles.subtitle}>
          Your tasks fuel Ember's fire.
        </Text>
        <Text style={styles.description}>
          Every task you add has an HP cost. Complete tasks to restore
          Ember's health — the heavier the task, the bigger the boost.
        </Text>

        <Button
          label={submitting ? "Getting started..." : "Let's Go"}
          onPress={onContinue}
          disabled={submitting}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
  },
  backButton: {
    position: "absolute",
    top: Spacing.xxl + Spacing.lg,
    left: Spacing.screen,
    zIndex: 1,
    padding: Spacing.sm,
  },
  centeredContent: {
    flex: 1,
    padding: Spacing.screen,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
  },
  welcomeTitle: {
    color: Colors.accent,
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    textAlign: "center",
  },
  subtitle: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.medium,
    textAlign: "center",
  },
  description: {
    color: Colors.textSecondary,
    fontSize: Typography.md,
    textAlign: "center",
    lineHeight: 24,
  },
});
