/**
 * Ember — DailySparkCard
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U2
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L4: spark quest comes from useDailySpark() — Josh — READY
 *   - L3: onComplete triggers HP restoration — Josh — READY
 *   - D7: quest completion write to Firestore — Aaron — READY
 *
 * Notes:
 *   Figma shows this card with:
 *     - Spark icon (starburst) on the left
 *     - "DAILY SPARK" label (uppercase, small)
 *     - Quest name (bold, large)
 *     - "+20 HP on Completion" subtitle
 *     - Checkbox toggle on the right (same style as QuestListItem)
 *   Checkbox toggles completed state on tap — matches quest list pattern.
 *   * Uses Card primitive from components/ui/.
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/components/ui/Card";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Quest } from "@/types";

// ~ ─────────────────────────────────────────────────────────────────

interface DailySparkCardProps {
  quest: Quest | null;
  onComplete: () => void;
}

// ~ ─────────────────────────────────────────────────────────────────

export function DailySparkCard({ quest, onComplete }: DailySparkCardProps) {
  // ^ if quest is null, Josh's useDailySpark() hasn't resolved yet — render nothing
  if (!quest) return null;

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        {/* Left: icon + text stack */}
        <View style={styles.iconWrap}>
          <Ionicons name="flame" size={32} color={Colors.accent} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.sparkLabel}>DAILY SPARK</Text>
          <Text style={styles.questName}>{quest.name}</Text>
          <Text style={styles.hpHint}>+{quest.hpCost} HP on Completion</Text>
        </View>

        {/* Right: checkbox — same pattern as QuestListItem */}
        <Pressable onPress={onComplete} hitSlop={8}>
          <View style={[styles.checkbox, quest.completed && styles.checkboxDone]}>
            {quest.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </Pressable>
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
  textBlock: {
    flex: 1,
  },
  sparkLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.accent,
    letterSpacing: Typography.capsTracking,
  },
  questName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  hpHint: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  checkbox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: Colors.checkboxUnchecked,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: {
    backgroundColor: Colors.checkboxChecked,
    borderColor: Colors.checkboxChecked,
  },
  checkmark: {
    color: Colors.bgDeep,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
});
