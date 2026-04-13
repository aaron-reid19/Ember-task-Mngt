/**
 * Ember — Streak Display Component
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U8
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L6: Streak count from useStreak() — Josh — PENDING
 *   - D9: HP snapshot data needed for streak calc — Aaron — PENDING
 *
 * Notes:
 *   Displays the user's current streak as a large number with a "Day Streak" label.
 *   Purely display — receives the number as a prop and renders it. No logic.
 *
 * WHERE THE DATA COMES FROM:
 *   Profile screen calls useStreak() → gets a number → passes here as `dayCount`.
 *   ← JOSH: useStreak() must return a number (consecutive days the user hit their goal).
 *
 * CURRENTLY STUBBED:
 *   Profile screen passes a hardcoded streak = 3.
 *   Will show real data once Josh's useStreak() (L6) and Aaron's D9 snapshots are working.
 *
 * USED BY:
 *   - app/(tabs)/profile.tsx → Profile screen
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type StreakDisplayProps = {
  /** Number of consecutive days the user completed their daily goal */
  dayCount: number;
};

export function StreakDisplay({ dayCount }: StreakDisplayProps) {
  return (
    <View style={styles.container}>
      {/* Large streak number — gold color for a celebratory feel */}
      <Text style={styles.streakNumber}>{dayCount}</Text>
      <Text style={styles.streakLabel}>Day Streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  streakNumber: {
    color: Colors.accent, // gold matches the bonfire celebration theme
    fontSize: Typography.hero,
    fontWeight: Typography.bold,
  },
  streakLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    marginTop: Spacing.xs,
  },
});
