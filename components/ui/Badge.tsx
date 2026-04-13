/**
 * Ember — Badge
 * Layer: UI
 * Owner: Kaley
 * Task IDs: used by QuestCard (cadence tag), TaskListItem (priority/tag)
 * Status: 🟢 READY
 *
 * Notes:
 *   Small pill label. Two variants seen in Figma:
 *     "default"  — dark bgCardAlt fill, white text ("Daily", "Weekly" cadence tags)
 *     "outlined" — transparent fill, amber border, amber text (HP badges "+9 HP")
 */

import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

// ~ ─────────────────────────────────────────────────────────────────

type BadgeVariant = "default" | "outlined";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  onPress?: () => void;
}

// ~ ─────────────────────────────────────────────────────────────────

export function Badge({ label, variant = "default", style, onPress }: BadgeProps) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={[
        styles.base,
        variant === "outlined" ? styles.outlined : styles.default,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "outlined" ? styles.labelOutlined : styles.labelDefault,
        ]}
      >
        {label}
      </Text>
    </Wrapper>
  );
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    borderRadius: 99,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    alignSelf: "flex-start",
  },
  default: {
    backgroundColor: Colors.bgCardAlt,
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
  },
  labelDefault: {
    color: Colors.textPrimary,
  },
  labelOutlined: {
    color: Colors.accent,
  },
});
