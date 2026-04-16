/**
 * Ember — Home Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U1, U2
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - L1, L2: useEmber() returning { hp, state, isBonfire } — Josh — READY
 *   - L4: useDailySpark() returning { spark } — Josh — READY
 *   - L3: quest HP restoration on complete — Josh — READY
 *   - D3: AsyncStorage HP read on mount — Aaron — READY
 *
 *   HP is driven by quest hpCost values:
 *     HP = (sum completed hpCost / sum total hpCost) × 100
 *
 * Notes:
 *   Figma pages 2–7 show the Home screen across six HP states:
 *     Smoldering (12 HP) → Glowing (22–32 HP) → Steady (42 HP)
 *     → Thriving (90 HP) → Bonfire (100 HP)
 *   The creature grows and brightens as HP increases.
 *   "Good Morning, [name]" greeting — name comes from user profile.
 *   Today's Progress section shows quests + HP bar.
 *   Coordinator only — no calculations, no animations defined here.
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmberCreature } from "@/components/ember/EmberCreature";
import { HPBar } from "@/components/ui/HPBar";
import { DailySparkCard } from "@/components/ember/DailySparkCard";
import { BonfireIndicator } from "@/components/ember/BonfireIndicator";
import { QuestListItem } from "@/components/quests/QuestListItem";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { useEmber } from "@/hooks/useEmber";
import { useDailySpark } from "@/hooks/useDailySpark";
import { useQuests } from "@/hooks/useQuests";
import { useAuth } from "@/store/authContext";
import { useStreak } from "@/hooks/useStreak";

export default function HomeScreen() {
  const { quests, update: updateQuest, toggle: toggleQuest } = useQuests();
  const { hp, state, isBonfire } = useEmber(quests);
  const { spark: sparkQuest } = useDailySpark(quests);
  const { user } = useAuth();
  const { current: streakDays } = useStreak();

  const totalHP = quests.reduce((sum, q) => sum + (q.hpCost ?? 0), 0);
  const completedHP = quests.filter((q) => q.completed).reduce((sum, q) => sum + (q.hpCost ?? 0), 0);
  const userName = user?.displayName ?? "Explorer";

  // Build a spark card object for the DailySparkCard component
  const sparkCard = sparkQuest
    ? {
        id: sparkQuest.id,
        name: sparkQuest.name,
        hpCost: sparkQuest.hpCost,
        completed: sparkQuest.completed,
        isDailySpark: true,
        cadence: "daily" as const,
        status: (sparkQuest.completed ? "complete" : "in progress") as "complete" | "in progress",
      }
    : null;

  async function handleSparkComplete() {
    if (!sparkQuest) return;
    await toggleQuest(sparkQuest.id);
  }

  async function handleQuestToggle(questId: string) {
    await toggleQuest(questId);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting */}
      <Text style={styles.greeting}>Good Morning,{"\n"}{userName}</Text>

      {/* Ember creature — grows/glows based on HP state */}
      <EmberCreature state={state} isBonfire={isBonfire} />

      {/* Status strip: streak · state label · HP number */}
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

      {/* HP bar */}
      <HPBar value={hp} state={state} height={10} />

      {/* Bonfire indicator — only when isBonfire */}
      {isBonfire && <BonfireIndicator />}

      {/* Daily Spark card */}
      {sparkCard && <DailySparkCard quest={sparkCard} onComplete={handleSparkComplete} />}

      {/* Today's Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>TODAY'S PROGRESS</Text>
          <Text style={styles.progressCount}>
            {completedHP} of {totalHP} HP
          </Text>
        </View>

        {/* Progress bar — HP earned vs total HP on the board */}
        <HPBar value={totalHP > 0 ? (completedHP / totalHP) * 100 : 100} state={state} height={6} />

        {/* Quest list — all quests shown inline */}
        <View style={styles.questList}>
          {quests.map((quest) => (
            <QuestListItem
              key={quest.id}
              quest={quest}
              onToggle={() => handleQuestToggle(quest.id)}
            />
          ))}
        </View>
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
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.cardGap,
  },
  greeting: {
    fontSize: Typography.xxl,
    fontWeight: Typography.extraBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  // Status strip — streak · state · HP
  statusStrip: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
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
  // Today's Progress section
  progressSection: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: Spacing.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  progressCount: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  questList: {
    marginTop: Spacing.sm,
  },
});
