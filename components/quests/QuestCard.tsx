// 🔵 DECISION — replaced Aaron's QuestCard with Kaley's version [Apr 2026]
// ? Aaron: your version had only onPress prop. Kaley's adds onToggle for checkbox interaction.
//   Layout changed: checkbox + text block + HP pts column (matching Figma).
//   Uses Quest.hpCost instead of Quest.hpReward.

/**
 * Ember — QuestCard
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U4, U5
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L7: quest data comes from useQuests(cadence) — Josh — PENDING
 *   - D8: quest completion write — Aaron — PENDING
 *
 * Notes:
 *   Figma shows QuestCard with:
 *     - Checkbox (unchecked: dark ring / checked: amber fill + checkmark)
 *     - Quest name (bold)
 *     - "Status: in progress" subtitle
 *     - Cadence badge ("Daily", "Weekly" etc.) bottom-left
 *     - "+20 pts" hp reward top-right
 *     - Optional spark icon overlay (top-right on Daily Spark quest)
 *   Tapping the card navigates to Quest Detail screen (U5).
 *   Tapping the checkbox fires onToggle — the actual HP write is Josh/Aaron's job.
 */

import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Quest } from "@/types";

// ~ ─────────────────────────────────────────────────────────────────

export interface QuestCardProps {
  quest: Quest;
  onPress: () => void;  // navigates to Quest Detail
  onToggle: () => void; // fires checkbox — HP logic handled upstream
}

// ~ ─────────────────────────────────────────────────────────────────

export function QuestCard({ quest, onPress, onToggle }: QuestCardProps) {
  return (
    <Card onPress={onPress}>
      <View style={styles.row}>
        {/* Checkbox */}
        <Pressable onPress={onToggle} style={styles.checkboxHitArea} hitSlop={8}>
          <View style={[styles.checkbox, quest.completed && styles.checkboxDone]}>
            {quest.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </Pressable>

        {/* Text block */}
        <View style={styles.textBlock}>
          <Text style={[styles.name, quest.completed && styles.nameStruck]}>
            {quest.name}
          </Text>
          <Text style={styles.status}>Status: {quest.status}</Text>
          <Badge label={quest.cadence} style={styles.badge} />
        </View>

        {/* Right: HP pts + optional spark icon */}
        <View style={styles.rightBlock}>
          <Text style={[styles.pts, quest.completed && styles.ptsCompleted]}>
            +{quest.hpCost} pts
          </Text>
          {/* Spark icon — only show if this quest is the Daily Spark */}
          {quest.isDailySpark && (
            // 🟡 STUB — replace with actual spark icon asset
            <View style={styles.sparkIconPlaceholder} />
          )}
        </View>
      </View>
    </Card>
  );
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  checkboxHitArea: {
    marginTop: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.xs,
  },
  name: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  nameStruck: {
    textDecorationLine: "line-through",
    color: Colors.textMuted,
  },
  status: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  badge: {
    marginTop: Spacing.xs,
  },
  rightBlock: {
    alignItems: "flex-end",
    gap: Spacing.xs,
  },
  pts: {
    fontSize: Typography.md,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
  },
  ptsCompleted: {
    color: Colors.accent,
  },
  // 🟡 STUB — remove when spark icon asset added
  sparkIconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    opacity: 0.5,
  },
});
