/**
 * Ember — QuestListItem
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U6
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - L3: onToggle triggers HP restoration — Josh — READY
 *   - D7: quest toggle write — Aaron — READY
 *
 * Notes:
 *   Figma Home screen shows quest rows with:
 *     - Checkbox (same pattern as QuestCard)
 *     - Quest name (struck-through when completed, muted colour)
 *     - "+10 HP" / "+20 HP" label on the right (amber when completed)
 *   Used in the "Today's Progress" section on the Home screen.
 *   // * this is the compact row variant — QuestCard is the full card used on Quest Board
 */

import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Quest } from "@/types";

// ~ ─────────────────────────────────────────────────────────────────

interface QuestListItemProps {
  quest: Quest;
  onToggle: () => void;
}

// ~ ─────────────────────────────────────────────────────────────────

export function QuestListItem({ quest, onToggle }: QuestListItemProps) {
  return (
    <View style={styles.row}>
      {/* Checkbox */}
      <Pressable onPress={onToggle} hitSlop={8}>
        <View style={[styles.checkbox, quest.completed && styles.checkboxDone]}>
          {quest.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </Pressable>

      {/* Quest name */}
      <Text
        style={[styles.name, quest.completed && styles.nameStruck]}
        numberOfLines={1}
      >
        {quest.name}
      </Text>

      {/* HP value */}
      <Text style={[styles.hp, quest.completed && styles.hpCompleted]}>
        +{quest.hpCost} HP
      </Text>
    </View>
  );
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  name: {
    flex: 1,
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  nameStruck: {
    textDecorationLine: "line-through",
    color: Colors.textMuted,
  },
  hp: {
    fontSize: Typography.md,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
  },
  hpCompleted: {
    color: Colors.accent,
  },
});
