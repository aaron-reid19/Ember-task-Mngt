/**
 * Ember — Quest Board Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U4
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - L7: useQuests(cadence) returning filtered quest list — Josh — PENDING
 *   - L1, L2: useEmber() for status strip — Josh — PENDING
 *   - D8: quest toggle write — Aaron — PENDING
 *
 * Notes:
 *   Figma pages 8–11 show the Quest Board across multiple HP states.
 *   Layout:
 *     - "Quest Board" title header (dark background)
 *     - QuestFilterTabs (Once / Daily / Weekly / Monthly / Custom)
 *     - Status strip (streak · state · HP) + HPBar
 *     - Scrollable list of QuestCards
 *   Tapping a card navigates to /(tabs)/quests/[id] (Quest Detail).
 *   Tapping a checkbox fires toggle — HP logic is Josh's L3.
 *   * Coordinator only — no calculations here.
 */

import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { QuestFilterTabs } from "@/components/quests/QuestFilterTabs";
import { QuestCard } from "@/components/quests/QuestCard";
import { HPBar } from "@/components/ui/HPBar";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { QuestCadence } from "@/types";
import { useEmber } from "@/hooks/useEmber";
import { useQuests } from "@/hooks/useQuests";
import { useStreak } from "@/hooks/useStreak";
import { useAuth } from "@/store/authContext";
import { updateQuest } from "@/services/FirestoreServices";

export default function QuestBoardScreen() {
  const [selectedCadence, setSelectedCadence] = useState<QuestCadence>("Daily");
  const { hp, state } = useEmber();
  const { quests, refresh: refreshQuests } = useQuests(selectedCadence);
  const { current: streakDays } = useStreak();
  const { user } = useAuth();

  function handleTabSelect(cadence: QuestCadence) {
    setSelectedCadence(cadence);
  }

  function handleQuestPress(questId: string) {
    router.push(`/(tabs)/quests/${questId}`);
  }

  async function handleQuestToggle(questId: string) {
    if (!user) return;
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;
    await updateQuest(user.uid, questId, { completed: !quest.completed });
    refreshQuests();
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quest Board</Text>
      </View>

      {/* Filter tabs — rendered outside ScrollView so they stay sticky */}
      <QuestFilterTabs onSelect={handleTabSelect} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Status strip + HP bar */}
        <View style={styles.statusStrip}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>🔥 {streakDays}-Day Streak</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{state}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{hp} HP</Text>
          </View>
        </View>
        <HPBar value={hp} state={state} height={8} />

        {/* Quest list */}
        <View style={styles.questList}>
          {quests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onPress={() => handleQuestPress(quest.id)}
                onToggle={() => handleQuestToggle(quest.id)}
              />
            ))}
        </View>
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
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bgDeep,
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.cardGap,
  },
  statusStrip: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  pill: {
    backgroundColor: Colors.bgCard,
    borderRadius: 99,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillText: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  questList: {
    gap: Spacing.cardGap,
    marginTop: Spacing.sm,
  },
});
