/**
 * Ember — HPBar
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U1 (used on Home), U4 (Quest Board status bar), U8 (Profile)
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - L1, L2: hp and state values come from useEmber() — Josh — PENDING
 *
 * Notes:
 *   Receives a number (0–100), animates its own fill width.
 *   Gradient runs red → amber matching Figma HP bar exactly.
 *   Does not know where hp comes from — the screen passes it down.
 *   * Reanimated withTiming gives the smooth fill feel from the Figma prototype.
 */

import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Colors from "@/constants/Colors";
import { EmberState, EmberStates } from "@/constants/EmberStates";

// ~ ─────────────────────────────────────────────────────────────────

interface HPBarProps {
  value: number;       // 0–100 — the current HP percentage
  state: EmberState;   // used to derive bar colour if needed — currently uses gradient always
  height?: number;     // optional override — defaults to 8
}

// ~ ─────────────────────────────────────────────────────────────────

export function HPBar({ value, state, height = 8 }: HPBarProps) {
  // * width is a 0–1 fraction for the animated fill
  // ^ clamp to [0, 1] so a bad value from the hook doesn't break layout
  const fillFraction = useSharedValue(Math.min(Math.max(value / 100, 0), 1));

  useEffect(() => {
    const clamped = Math.min(Math.max(value / 100, 0), 1);
    fillFraction.value = withTiming(clamped, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${fillFraction.value * 100}%`,
  }));

  // * bar color driven by EmberState — source: constants/EmberStates.ts
  const barColor = EmberStates[state].color;

  return (
    <View style={[styles.track, { height }]}>
      <Animated.View style={[styles.fillWrapper, animStyle, { backgroundColor: barColor }]} />
    </View>
  );
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  track: {
    width: "100%",
    backgroundColor: Colors.bgCardAlt,
    borderRadius: 99,
    overflow: "hidden",
  },
  fillWrapper: {
    height: "100%",
    borderRadius: 99,
    overflow: "hidden",
  },
});
