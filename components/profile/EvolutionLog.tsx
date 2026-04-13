/**
 * Ember — Evolution Log Component
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U8
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - D9: HP snapshot data stored in Firestore — Aaron — PENDING
 *   - L6: useHPHistory() returning HPSnapshot[] — Josh — PENDING
 *
 * Notes:
 *   Vertical timeline showing how the creature's state has changed over time.
 *   Each entry shows the date, the creature state, and the HP percentage.
 *   A colored dot next to each entry matches the state color (green/blue/amber/red).
 *
 * WHERE THE DATA COMES FROM:
 *   Profile screen calls useHPHistory() → gets HPSnapshot[] → passes here as `snapshots`.
 *   ← JOSH: useHPHistory() must return HPSnapshot[] sorted by date ascending.
 *   ← AARON: D9 must write one HPSnapshot to Firestore at the end of each day.
 *
 * CURRENTLY STUBBED:
 *   Profile screen passes hardcoded HPSnapshot[] data.
 *   Will show real evolution data once D9 and useHPHistory are working.
 *
 * USED BY:
 *   - app/(tabs)/profile.tsx → Profile screen, below the HP trend chart
 */

import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import type { HPSnapshot } from "@/types";
import { EmberStates } from "@/constants/EmberStates";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type EvolutionLogProps = {
  /** Array of daily HP snapshots — each becomes one timeline entry */
  snapshots: HPSnapshot[];
};

export function EvolutionLog({ snapshots }: EvolutionLogProps) {
  // Show empty state if no history exists yet
  if (snapshots.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No evolution history yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Evolution Log</Text>
      <FlatList
        data={snapshots}
        keyExtractor={(snapshot) => snapshot.date}
        scrollEnabled={false} // nested inside Profile's ScrollView, so don't scroll independently
        renderItem={({ item: snapshot }) => {
          // Look up the color for this snapshot's state from the shared config
          const stateColor = EmberStates[snapshot.state].color;
          return (
            <View style={styles.timelineEntry}>
              {/* Colored dot — matches the creature state color */}
              <View style={[styles.timelineDot, { backgroundColor: stateColor }]} />
              <View style={styles.entryDetails}>
                <Text style={styles.entryDate}>{snapshot.date}</Text>
                <Text style={[styles.entryState, { color: stateColor }]}>
                  {snapshot.state} — {snapshot.hp}% HP
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.semiBold,
    marginBottom: Spacing.md,
  },
  timelineEntry: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5, // circle
    marginRight: Spacing.md,
  },
  entryDetails: {
    flex: 1,
  },
  entryDate: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
  },
  entryState: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  emptyState: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
  },
});
