// 🔵 DECISION — replaced Aaron's TaskListItem with Kaley's version [Apr 2026]
// ? Aaron: your version used onPress + Card + Badge (priority/tag badges).
//   Kaley's uses onToggle (checkbox) with simpler row layout (checkbox + name + HP).
//   Aaron's version showed priority/tag badges; Kaley's omits them for the Home screen compact view.

/**
 * Ember — TaskListItem
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U6
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L3: onToggle triggers HP restoration — Josh — PENDING
 *   - D7: task toggle write — Aaron — PENDING
 *
 * Notes:
 *   Figma Home screen shows task rows with:
 *     - Checkbox (same pattern as QuestCard)
 *     - Task name (struck-through when completed, muted colour)
 *     - "+10 HP" / "+20 HP" label on the right (amber when completed)
 *   Used in the "Today's Progress" section on the Home screen.
 */

import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Task } from "@/types";

// ~ ─────────────────────────────────────────────────────────────────

interface TaskListItemProps {
  task: Task;
  onToggle: () => void;
}

// ~ ─────────────────────────────────────────────────────────────────

export function TaskListItem({ task, onToggle }: TaskListItemProps) {
  return (
    <View style={styles.row}>
      {/* Checkbox */}
      <Pressable onPress={onToggle} hitSlop={8}>
        <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </Pressable>

      {/* Task name */}
      <Text
        style={[styles.name, task.completed && styles.nameStruck]}
        numberOfLines={1}
      >
        {task.name}
      </Text>

      {/* HP value */}
      <Text style={[styles.hp, task.completed && styles.hpCompleted]}>
        +{task.hpCost} HP
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
