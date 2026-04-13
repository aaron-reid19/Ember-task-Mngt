// 🔵 DECISION — replaced Aaron's BonfireIndicator (full-screen overlay) with Kaley's version (amber card) [Apr 2026]
// ? Aaron: your version was a full-screen overlay with position:absolute.
//   Kaley's is a simpler amber rounded card shown inline in the scroll content.
//   ⚪ DEFERRED — particle/confetti animation out of MVP scope.

/**
 * Ember — BonfireIndicator
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U2
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L5: isBonfire flag comes from useEmber() — Josh — PENDING
 *
 * Notes:
 *   Only renders when isBonfire === true (100 HP + Daily Spark completed).
 *   Figma page 7 shows full Bonfire state — large fire, "Bonfire" label, 100 HP.
 *   This component is a celebration overlay — it does not contain logic.
 *   The screen renders it conditionally: {isBonfire && <BonfireIndicator />}
 *   ⚪ DEFERRED — particle/confetti animation
 *      Reason: out of MVP scope per ADR-001 sprint constraints
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

// ~ ─────────────────────────────────────────────────────────────────

export function BonfireIndicator() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>🔥 BONFIRE MODE</Text>
      <Text style={styles.sub}>Full HP achieved — Ember is thriving!</Text>
    </View>
  );
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    padding: Spacing.card,
    marginBottom: Spacing.cardGap,
    alignItems: "center",
  },
  label: {
    fontSize: Typography.lg,
    fontWeight: Typography.extraBold,
    color: Colors.completeText,
    letterSpacing: Typography.capsTracking,
  },
  sub: {
    fontSize: Typography.sm,
    color: Colors.completeText,
    marginTop: 4,
    opacity: 0.8,
  },
});
