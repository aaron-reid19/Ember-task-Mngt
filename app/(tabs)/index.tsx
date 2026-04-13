/**
 * Ember — Home Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U1, U2
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - L1, L2: useEmber() returning { hp, state, isBonfire } — Josh — PENDING
 *   - L4: useDailySpark() returning { task, onComplete } — Josh — PENDING
 *   - L3: task HP restoration on complete — Josh — PENDING
 *   - D3: AsyncStorage HP read on mount — Aaron — PENDING
 *
 *   HP is driven by task hpCost values:
 *     HP = (sum completed hpCost / sum total hpCost) × 100
 *
 * Notes:
 *   Figma pages 2–7 show the Home screen across six HP states:
 *     Smoldering (12 HP) → Glowing (22–32 HP) → Steady (42 HP)
 *     → Thriving (90 HP) → Bonfire (100 HP)
 *   The creature grows and brightens as HP increases.
 *   "Good Morning, [name]" greeting — name comes from user profile (Aaron/Josh TBD).
 *   Today's Progress section shows up to 3 tasks + "See All Today's Tasks →" link.
 *   Coordinator only — no calculations, no animations defined here.
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
import { router } from "expo-router";
import { EmberCreature } from "@/components/ember/EmberCreature";
import { HPBar } from "@/components/ui/HPBar";
import { DailySparkCard } from "@/components/ember/DailySparkCard";
import { BonfireIndicator } from "@/components/ember/BonfireIndicator";
import { TaskListItem } from "@/components/tasks/TaskListItem";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { useEmber } from "@/hooks/useEmber";
import { useDailySpark } from "@/hooks/useDailySpark";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/store/authContext";
import { useStreak } from "@/hooks/useStreak";
import { updateTask } from "@/services/FirestoreServices";

export default function HomeScreen() {
  const { hp, state, isBonfire } = useEmber();
  const { spark: sparkTask } = useDailySpark();
  const { tasks, refresh: refreshTasks } = useTasks();
  const { user } = useAuth();
  const { current: streakDays } = useStreak();

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalHP = tasks.reduce((sum, t) => sum + (t.hpCost ?? 0), 0);
  const completedHP = tasks.filter((t) => t.completed).reduce((sum, t) => sum + (t.hpCost ?? 0), 0);
  const userName = user?.displayName ?? "Explorer";

  // Build a spark quest object for the DailySparkCard component
  const sparkQuest = sparkTask
    ? {
        id: sparkTask.id,
        name: sparkTask.name,
        hpCost: sparkTask.hpCost,
        completed: sparkTask.completed,
        isDailySpark: true,
        cadence: "Daily" as const,
        status: (sparkTask.completed ? "complete" : "in progress") as "complete" | "in progress",
      }
    : null;

  async function handleSparkComplete() {
    if (!user || !sparkTask) return;
    await updateTask(user.uid, sparkTask.id, { completed: true });
    refreshTasks();
  }

  async function handleTaskToggle(taskId: string) {
    if (!user) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    await updateTask(user.uid, taskId, { completed: !task.completed });
    refreshTasks();
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
      {sparkQuest && <DailySparkCard task={sparkQuest} onComplete={handleSparkComplete} />}

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

        {/* Task list — max 3 shown on Home */}
        <View style={styles.taskList}>
          {tasks.slice(0, 3).map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              onToggle={() => handleTaskToggle(task.id)}
            />
          ))}
        </View>

        {/* See all link */}
        <Pressable onPress={() => router.push("/(tabs)/tasks")}>
          <Text style={styles.seeAllLink}>See All Today's Tasks →</Text>
        </Pressable>
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
    fontSize: Typography.md,
    fontWeight: Typography.extraBold,
    color: Colors.textPrimary,
    letterSpacing: Typography.capsTracking,
  },
  progressCount: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  taskList: {
    marginTop: Spacing.sm,
  },
  seeAllLink: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.md,
    fontWeight: Typography.medium,
  },
});
