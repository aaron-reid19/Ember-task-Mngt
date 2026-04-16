/**
 * Ember — Quest Detail Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U5
 * Status: 🟢 READY
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
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HPBar } from "@/components/ui/HPBar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { useQuest } from "@/hooks/useQuest";
import { useQuests } from "@/hooks/useQuests";
import { useAuth } from "@/store/authContext";

export default function QuestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { quest, loading } = useQuest(id);
  const { update: updateQuest } = useQuests();
  const { user } = useAuth();

  async function handleMarkComplete() {
    if (!id) return;
    await updateQuest(id, { completed: true });
    router.replace("/(tabs)/quests");
  }

  if (loading || !quest) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <Text style={{ color: Colors.textSecondary, textAlign: "center", marginTop: 100 }}>
          {loading ? "Loading..." : "Quest not found"}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Quest Details</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Quest detail card */}
      <View style={styles.detailCard}>
        {/* Spark badge — only shown if isDailySpark */}
        {quest.isDailySpark && (
          <View style={styles.sparkRow}>
            <Ionicons name="flame" size={28} color={Colors.accent} />
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
        label={quest.completed ? "Completed" : "Mark as Complete"}
        onPress={handleMarkComplete}
        variant="primary"
        disabled={quest.completed}
        style={styles.actionBtn}
      />
      <Button
        label="Edit Quest"
        onPress={() => router.push(`/(tabs)/quests/edit/${id}`)}
        variant="secondary"
        style={styles.actionBtn}
      />
      <Button
        label="Back to Dashboard"
        onPress={() => router.replace("/(tabs)")}
        variant="secondary"
        style={styles.actionBtn}
      />
    </ScrollView>
    </SafeAreaView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.screen,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
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
