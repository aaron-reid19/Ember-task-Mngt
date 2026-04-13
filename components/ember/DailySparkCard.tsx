/**
 * Ember — DailySparkCard
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U2
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L4: spark task comes from useDailySpark() — Josh — PENDING
 *   - L3: onComplete triggers HP restoration — Josh — PENDING
 *   - D7: task completion write to Firestore — Aaron — PENDING
 *
 * Notes:
 *   Figma shows this card with:
 *     - Spark icon (starburst) on the left
 *     - "DAILY SPARK" label (uppercase, small)
 *     - Task name (bold, large)
 *     - "+20 HP on Completion" subtitle
 *     - Amber COMPLETE / COMPLETED button on the right
 *   Button text changes from COMPLETE → COMPLETED when task.completed === true.
 *   * Uses Card + Button primitives from components/ui/.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Quest } from "@/types";

// ~ ─────────────────────────────────────────────────────────────────

interface DailySparkCardProps {
  task: Quest | null;
  onComplete: () => void;
}

// ~ ─────────────────────────────────────────────────────────────────

export function DailySparkCard({ task, onComplete }: DailySparkCardProps) {
  // ^ if task is null, Josh's useDailySpark() hasn't resolved yet — render nothing
  if (!task) return null;

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        {/* Left: icon + text stack */}
        <View style={styles.iconWrap}>
          {/* 🟡 STUB — replace with actual spark icon asset */}
          <View style={styles.sparkIconPlaceholder} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.sparkLabel}>DAILY SPARK</Text>
          <Text style={styles.taskName}>{task.name}</Text>
          <Text style={styles.hpHint}>+{task.hpCost} HP on Completion</Text>
        </View>

        {/* Right: COMPLETE button */}
        <Button
          label={task.completed ? "COMPLETED" : "COMPLETE"}
          onPress={onComplete}
          disabled={task.completed}
          style={styles.button}
        />
      </View>
    </Card>
  );
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  // 🟡 STUB — remove when spark icon asset is added
  sparkIconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    opacity: 0.4,
  },
  textBlock: {
    flex: 1,
  },
  sparkLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.accent,
    letterSpacing: Typography.capsTracking,
  },
  taskName: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  hpHint: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  button: {
    marginBottom: 0,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
});
