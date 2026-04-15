/**
 * Ember — Card
 * Layer: UI
 * Owner: Kaley
 * Task IDs: used by DailySparkCard, QuestCard, TaskListItem
 * Status: 🟢 READY
 *
 * Notes:
 *   Visual shell only — accepts children, optional onPress.
 *   Changing this file changes every card in the app — be careful.
 *   * Dark purple card with subtle border matches Figma card styling exactly.
 */

import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

// ~ ─────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

// ~ ─────────────────────────────────────────────────────────────────

export function Card({ children, onPress, style }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: Spacing.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.cardGap,
  },
  pressed: {
    opacity: 0.85,
  },
});
