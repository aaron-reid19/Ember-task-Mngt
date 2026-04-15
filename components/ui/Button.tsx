/**
 * Ember — Button
 * Layer: UI
 * Owner: Kaley
 * Task IDs: used by DailySparkCard (COMPLETE), Add Quest (Save / Discard), Onboarding
 * Status: 🟢 READY
 *
 * Notes:
 *   Two variants seen in Figma:
 *     "primary"   — amber fill, dark text (COMPLETE button, Save Quest)
 *     "secondary" — transparent fill, white text, no border (Discard, Back to Dashboard)
 *   * Figma shows COMPLETE button as bold amber pill — this matches that.
 */

import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
} from "react-native";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

// ~ ─────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary";

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

// ~ ─────────────────────────────────────────────────────────────────

export function Button({
  label,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "primary" ? styles.labelPrimary : styles.labelSecondary,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    borderRadius: 99,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.cardGap,
  },
  primary: {
    backgroundColor: Colors.completeBg,
  },
  secondary: {
    backgroundColor: Colors.bgCard,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  labelPrimary: {
    color: Colors.completeText,
  },
  labelSecondary: {
    color: Colors.textPrimary,
  },
});
