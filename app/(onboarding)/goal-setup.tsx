/**
 * Ember — Onboarding: Daily Goal Setup
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U9
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - D3: AsyncStorageService.saveGoal() — Aaron — PENDING
 *
 * Notes:
 *   Shown exactly once, on the user's very first launch.
 *   The user picks their daily task goal (how many tasks per day they aim to complete).
 *   This number becomes the denominator in the HP formula: HP = (completed / goal) × 100.
 *
 *   On confirm, the screen:
 *   1. Saves the goal to AsyncStorage (Aaron's D3 — currently blocked)
 *   2. Uses router.replace() to go to tabs — this REPLACES the navigation stack,
 *      so the user cannot press back to return to onboarding.
 *
 *   No tab bar is visible — (onboarding) has its own layout separate from (tabs).
 *
 * WHERE MISSING WORK GETS ADDED:
 *   1. Wire up the confirm action → AsyncStorageService.saveGoal(dailyGoal) (Aaron D3)
 *   2. Also set an onboarding flag so app/index.tsx knows to skip onboarding next time
 *
 * SCREEN LAYOUT:
 *   ┌──────────────────────────────────┐
 *   │                                  │
 *   │     Welcome to Ember             │  ← title
 *   │                                  │
 *   │  How many tasks do you want      │  ← subtitle
 *   │  to complete each day?           │
 *   │                                  │
 *   │  This becomes your daily goal... │  ← description
 *   │                                  │
 *   │        [-]  5  [+]               │  ← HPCostCalculator (reused as a generic stepper)
 *   │       tasks per day              │
 *   │                                  │
 *   │      [ Let's Go ]               │  ← Button (confirm)
 *   │                                  │
 *   └──────────────────────────────────┘
 */

import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { HPCostCalculator } from "@/components/tasks/HPCostCalculator";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

// Zod schema — validation rules for the goal setup form
const goalSchema = z.object({
  dailyGoal: z.number().min(1, "Set at least 1 task.").max(50, "Maximum 50 tasks."),
});
type GoalFormData = z.infer<typeof goalSchema>;

export default function GoalSetupScreen() {
  const router = useRouter();

  // * Form managed by React Hook Form + Zod
  const { control, handleSubmit, formState: { errors } } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: { dailyGoal: 5 },
  });

  const onSubmit = (data: GoalFormData) => {
    // ┌──────────────────────────────────────────────────────────────┐
    // │ 🔴 BLOCKED [D3] — waiting on Aaron's AsyncStorage module    │
    // │ Unblock: AsyncStorageService.ts must export saveGoal()      │
    // │ ! do not ship this screen until this line is unblocked      │
    // │                                                              │
    // │ ← AARON: when D3 lands, uncomment and use:                  │
    // │   await AsyncStorageService.saveGoal(data.dailyGoal);        │
    // │                                                              │
    // │ Also need to set an onboarding completion flag so that       │
    // │ app/index.tsx knows to skip onboarding on the next launch:  │
    // │   await AsyncStorageService.setOnboardingComplete(true);     │
    // └──────────────────────────────────────────────────────────────┘

    // * router.replace removes onboarding from the nav stack entirely
    //   so the user can never press back to return here
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.centeredContent}>
        <Text style={styles.welcomeTitle}>Welcome to Ember</Text>
        <Text style={styles.promptSubtitle}>
          How many tasks do you want to complete each day?
        </Text>
        <Text style={styles.explanationText}>
          This becomes your daily goal. Ember's health reflects how close you
          are to hitting it.
        </Text>

        {/* Stepper — reusing HPCostCalculator as a generic +/- number picker */}
        <View style={styles.goalStepperSection}>
          <Controller
            control={control}
            name="dailyGoal"
            render={({ field: { onChange, value } }) => (
              <HPCostCalculator initialValue={value} onCostChange={onChange} min={1} max={50} />
            )}
          />
          <Text style={styles.goalUnitLabel}>tasks per day</Text>
          {errors.dailyGoal && <Text style={styles.errorText}>{errors.dailyGoal.message}</Text>}
        </View>

        {/* Confirm button — validates via Zod then fires onSubmit */}
        <Button label="Let's Go" onPress={handleSubmit(onSubmit)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
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
  promptSubtitle: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.medium,
    textAlign: "center",
  },
  explanationText: {
    color: Colors.textSecondary,
    fontSize: Typography.md,
    textAlign: "center",
    lineHeight: 24,
  },
  goalStepperSection: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  goalUnitLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.md,
  },
  errorText: {
    color: Colors.priorityHigh,
    fontSize: Typography.sm,
    marginTop: Spacing.xs,
  },
});
