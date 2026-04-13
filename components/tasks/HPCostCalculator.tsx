/**
 * Ember — HPCostCalculator
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U7 (Task edit), also used in Add Quest (U4)
 * Status: 🟢 READY
 *
 * Notes:
 *   Figma shows: [ − ] [ 9 ] [ + ]  with "+9 HP" badge beside it.
 *   The stepper value and its local state are Kaley's to own.
 *   The HP deduction on save is Josh's L3 — do not write that here.
 *   Fires onCostChange(newValue) so the parent screen can pass it to the save handler.
 *   * Self-contained — no sub-components, no hook imports.
 */

import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Badge } from "@/components/ui/Badge";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

// ~ ─────────────────────────────────────────────────────────────────

interface HPCostCalculatorProps {
  initialValue?: number;
  onCostChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  showBadge?: boolean;
}

// ~ ─────────────────────────────────────────────────────────────────

export function HPCostCalculator({
  initialValue = 10,
  onCostChange,
  min = 1,
  max = 50,
  label = "HP COST",
  showBadge = true,
}: HPCostCalculatorProps) {
  // * Local interaction state — stepper value belongs here, not in the screen
  const [value, setValue] = useState(initialValue);

  function decrement() {
    if (value <= min) return;
    const next = value - 1;
    setValue(next);
    onCostChange(next);
  }

  function increment() {
    if (value >= max) return;
    const next = value + 1;
    setValue(next);
    onCostChange(next);
  }

  return (
    <View style={styles.row}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}

      <View style={styles.stepper}>
        <Pressable
          onPress={decrement}
          style={({ pressed }) => [
            styles.stepperBtn,
            pressed && styles.stepperPressed,
            value <= min && styles.stepperDisabled,
          ]}
          disabled={value <= min}
        >
          <Text style={styles.stepperSymbol}>−</Text>
        </Pressable>

        <Text style={styles.stepperValue}>{value}</Text>

        <Pressable
          onPress={increment}
          style={({ pressed }) => [
            styles.stepperBtn,
            pressed && styles.stepperPressed,
            value >= max && styles.stepperDisabled,
          ]}
          disabled={value >= max}
        >
          <Text style={styles.stepperSymbol}>+</Text>
        </Pressable>
      </View>

      {showBadge && <Badge label={`+${value} HP`} variant="outlined" />}
    </View>
  );
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  fieldLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    letterSpacing: Typography.capsTracking,
    marginRight: Spacing.sm,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.bgCardAlt,
    borderRadius: 99,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperPressed: {
    backgroundColor: Colors.accent,
  },
  stepperDisabled: {
    opacity: 0.3,
  },
  stepperSymbol: {
    fontSize: Typography.xl,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
    lineHeight: Typography.xl + 2,
  },
  stepperValue: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    minWidth: 28,
    textAlign: "center",
  },
});
