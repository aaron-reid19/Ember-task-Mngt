/**
 * Ember — HP Trend Chart Component
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U8
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - D9: Daily HP snapshot writes to Firestore — Aaron — PENDING
 *   - L6: useHPHistory() hook returning HPSnapshot[] — Josh — PENDING
 *
 * Notes:
 *   Displays a chart of the user's HP over time with a Week/Month toggle.
 *   The toggle is handled internally with local useState — the Profile screen
 *   passes the full history array and doesn't need to track which range is active.
 *
 *   ^ This component depends on D9 (Aaron) and useHPHistory (Josh) — both Wave 3.
 *   It will show "No HP history yet" until real snapshot data is flowing.
 *
 * WHERE THE DATA COMES FROM:
 *   Profile screen calls useHPHistory() → gets HPSnapshot[] → passes here as `snapshots`.
 *   ← JOSH: useHPHistory() must return HPSnapshot[] sorted by date ascending.
 *   ← AARON: D9 must write one HPSnapshot to Firestore at the end of each day.
 *
 * CURRENTLY STUBBED:
 *   The chart area is a placeholder box. No actual chart library is installed yet.
 *   TODO choose and install a chart library (react-native-chart-kit or victory-native)
 *   TODO replace the placeholder with a real line chart rendering HPSnapshot data
 *
 * USED BY:
 *   - app/(tabs)/profile.tsx → Profile screen
 */

import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { HPSnapshot } from "@/types";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type HPTrendChartProps = {
  /** Array of daily HP snapshots — passed from the Profile screen */
  snapshots: HPSnapshot[];
};

/** Time range options for the chart toggle */
type ChartRange = "weekly" | "monthly";

export function HPTrendChart({ snapshots }: HPTrendChartProps) {
  // Local toggle state — this is interaction logic, owned by Kaley
  const [activeRange, setActiveRange] = useState<ChartRange>("weekly");

  return (
    <View style={styles.container}>
      {/* Header: title + range toggle buttons */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>HP Trend</Text>
        <View style={styles.toggleGroup}>
          {/* Week toggle */}
          <Pressable
            onPress={() => setActiveRange("weekly")}
            style={[styles.toggleButton, activeRange === "weekly" && styles.toggleButtonActive]}
          >
            <Text style={[styles.toggleLabel, activeRange === "weekly" && styles.toggleLabelActive]}>
              Week
            </Text>
          </Pressable>
          {/* Month toggle */}
          <Pressable
            onPress={() => setActiveRange("monthly")}
            style={[styles.toggleButton, activeRange === "monthly" && styles.toggleButtonActive]}
          >
            <Text style={[styles.toggleLabel, activeRange === "monthly" && styles.toggleLabelActive]}>
              Month
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 🟡 STUB — chart placeholder, will be replaced with a real chart component */}
      {/* ← KALEY: install a chart library and render a line chart of snapshots here */}
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>
          {snapshots.length > 0
            ? `${snapshots.length} snapshots (${activeRange} view)`
            : "No HP history yet"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.semiBold,
  },
  toggleGroup: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  toggleButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.bgCardAlt,
  },
  toggleButtonActive: {
    backgroundColor: Colors.accent,
  },
  toggleLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
  },
  toggleLabelActive: {
    color: Colors.completeText,
    fontWeight: Typography.bold,
  },
  chartPlaceholder: {
    height: 160,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
  },
});
