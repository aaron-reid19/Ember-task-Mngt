/**
 * Ember — Notification Banner Component
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U10
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - D12: Notification permission check result — Aaron — PENDING
 *
 * Notes:
 *   Warning banner shown when the user has denied notification permission.
 *   Rendered by app/_layout.tsx (root layout) so it floats above all screens.
 *   The parent controls visibility — this component only handles rendering + dismiss.
 *
 * WHERE THE DATA COMES FROM:
 *   Root layout checks notification permission on mount (via Aaron's D12 module).
 *   ← AARON: D12 must provide a way to check if notifications are permitted.
 *            The root layout will read that status and pass `visible` as a prop.
 *
 * CURRENTLY STUBBED:
 *   visible is always false until Aaron's permission module (D12) is integrated.
 *   The banner will start appearing once the root layout wires up real permission status.
 */

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type NotificationBannerProps = {
  /** Whether to show the banner (true = notifications are denied) */
  visible: boolean;
  /** Callback when user taps "Dismiss" — parent hides the banner */
  onDismiss: () => void;
};

export function NotificationBanner({ visible, onDismiss }: NotificationBannerProps) {
  // Don't render anything if notifications are allowed
  if (!visible) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.messageText}>
        Notifications are off. Enable them in settings to get reminders.
      </Text>
      <Pressable onPress={onDismiss} style={styles.dismissButton}>
        <Text style={styles.dismissText}>Dismiss</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.accent, // amber background to signal a non-critical alert
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messageText: {
    color: Colors.completeText,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    flex: 1,
    marginRight: Spacing.sm,
  },
  dismissButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  dismissText: {
    color: Colors.completeText,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
});
