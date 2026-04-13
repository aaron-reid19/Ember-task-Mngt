// 🔵 DECISION — replaced Aaron's Quest Detail scaffold with Kaley's Figma implementation [Apr 2026]
// ? Aaron: Kaley's version has centered detail card, spark badge, HPBar visualization, and "Back to Dashboard" button.
//   Your version used Card component wrapper + hpReward. Kaley's uses hpCost + custom detail card layout.

/**
 * Ember — Quest Detail Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U5
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L7: useQuest(id) returning single quest — Josh — PENDING
 *   - D8: quest completion write — Aaron — PENDING
 *
 * Notes:
 *   Figma page 12 shows Quest Details with:
 *     - Spark icon + "DAILY SPARK" label (if isDailySpark)
 *     - Quest name (bold, centred)
 *     - HP cost display + mini HPBar
 *     - Cadence pill badge
 *     - "mark as Complete" button (primary)
 *     - "Back to Dashboard" button (secondary)
 *   Dynamic route — receives quest id via useLocalSearchParams().
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { HPBar } from "@/components/ui/HPBar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Quest } from "@/types";

// ~ ─────────────────────────────────────────────────────────────────
// ~ STUB DATA
// ~ ─────────────────────────────────────────────────────────────────

// 🟡 STUB [L7] — replace with useQuest(id) when Josh's hook is done
// Owner: Kaley | Replaces: quest from useQuest(id)
const stubQuest: Quest = {
  id: "q1",
  name: "Clean Bathroom",
  hpCost: 20,
  completed: false,
  isDailySpark: true,
  cadence: "Daily",
  status: "in progress",
};

// ~ ─────────────────────────────────────────────────────────────────

export default function QuestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // ← JOSH: plug useQuest(id) here — needs { quest }
  // ^ if hook isn't ready, stub quest above is used for all IDs

  const quest = stubQuest; // 🟡 STUB — replace with useQuest(id)

  function handleMarkComplete() {
    // 🔴 BLOCKED [L3, D8] — waiting on Josh's task cost logic + Aaron's Quest CRUD
    // Unblock: FirestoreService.completeQuest() must exist
    // ! do not ship until blocker is cleared
    console.log("🟡 STUB: mark complete tapped for", id);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quest Details</Text>
      </View>

      {/* Quest detail card */}
      <View style={styles.detailCard}>
        {/* Spark badge — only shown if isDailySpark */}
        {quest.isDailySpark && (
          <View style={styles.sparkRow}>
            {/* 🟡 STUB — replace with spark icon asset */}
            <View style={styles.sparkIconPlaceholder} />
            <Text style={styles.sparkLabel}>DAILY SPARK</Text>
          </View>
        )}

        {/* Quest name */}
        <Text style={styles.questName}>{quest.name}</Text>

        {/* HP cost display */}
        <Text style={styles.hpCost}>{quest.hpCost}HP</Text>
        <HPBar value={quest.hpCost} state="Strained" height={10} />

        {/* Cadence badge */}
        <Badge label={quest.cadence} style={styles.cadenceBadge} />
      </View>

      {/* Actions */}
      <Button
        label="mark as Complete"
        onPress={handleMarkComplete}
        variant="secondary"
        disabled={quest.completed}
        style={styles.actionBtn}
      />
      <Button
        label="Back to Dashboard"
        onPress={() => router.replace("/(tabs)")}
        variant="secondary"
        style={styles.actionBtn}
      />
    </ScrollView>
  );
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.xxl,
    gap: Spacing.cardGap,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  detailCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  sparkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  // 🟡 STUB — remove when spark icon asset is added
  sparkIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    opacity: 0.5,
  },
  sparkLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.accent,
    letterSpacing: Typography.capsTracking,
  },
  questName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  hpCost: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    alignSelf: "flex-start",
  },
  cadenceBadge: {
    marginTop: Spacing.sm,
    alignSelf: "center",
  },
  actionBtn: {
    width: "100%",
    marginTop: Spacing.sm,
  },
});
