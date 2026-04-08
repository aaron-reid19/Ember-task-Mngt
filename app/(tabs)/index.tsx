// 🔵 DECISION — replaced Aaron's Home screen scaffold with Kaley's full Figma implementation [Apr 2026]
// ? Aaron: Kaley's version adds greeting, status strip, Today's Progress section, task list, and "See All" link.
//   Your simpler version had fewer imports and no task list. This version is the Figma-matching UI.

/**
 * Ember — Home Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U1, U2
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L1, L2: useEmber() returning { hp, state, isBonfire } — Josh — PENDING
 *   - L4: useDailySpark() returning { task, onComplete } — Josh — PENDING
 *   - L3: task HP restoration on complete — Josh — PENDING
 *   - D3: AsyncStorage HP read on mount — Aaron — PENDING
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
import { router } from "expo-router";
import { EmberCreature } from "@/components/ember/EmberCreature";
import { HPBar } from "@/components/ui/HPBar";
import { DailySparkCard } from "@/components/ember/DailySparkCard";
import { BonfireIndicator } from "@/components/ember/BonfireIndicator";
import { TaskListItem } from "@/components/tasks/TaskListItem";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { EmberState } from "@/constants/EmberStates";
import { Task, Quest } from "@/types";

// ~ ─────────────────────────────────────────────────────────────────
// ~ STUB DATA — replace with real hooks when Josh's Wave 2 logic lands
// ~ ─────────────────────────────────────────────────────────────────

// 🟡 STUB [L1, L2] — replace with useEmber() when Josh's logic hooks are done
// Owner: Kaley | Replaces: { hp, state, isBonfire } from useEmber()
// ^ hardcoded at Smoldering to exercise the low-HP visual state during dev
const hp = 12;
const state: EmberState = "Strained";
const isBonfire = false;

// 🟡 STUB [L4] — replace with useDailySpark() when Josh's hook is done
// Owner: Kaley | Replaces: { task, onComplete } from useDailySpark()
const stubSparkTask: Quest = {
  id: "spark-stub-001",
  name: "Clean Bathroom",
  hpCost: 20,
  completed: false,
  isDailySpark: true,
  cadence: "Daily",
  status: "in progress",
};

// 🟡 STUB [L3, D7] — replace with useTasks() when Josh + Aaron's layers are done
// Owner: Kaley | Replaces: tasks array from useTasks()
const stubTasks: Task[] = [
  {
    id: "t1",
    name: "Read for 20 Minutes",
    hpCost: 10,
    completed: false,
    isDailySpark: false,
    priority: "medium",
    tags: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "t2",
    name: "Clean Bathroom",
    hpCost: 20,
    completed: false,
    isDailySpark: true,
    priority: "high",
    tags: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "t3",
    name: "Walk Jaronadel 🐾",
    hpCost: 10,
    completed: false,
    isDailySpark: false,
    priority: "low",
    tags: [],
    createdAt: new Date().toISOString(),
  },
];

// 🟡 STUB [D3] — replace with real user name from store/profile when Aaron's D3 is done
const userName = "Joshua";
const dailyGoal = 10;
const completedCount = 0;

// ~ ─────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  // ← JOSH: replace stub values above with:
  // const { hp, state, isBonfire } = useEmber();
  // const { task: sparkTask, onComplete } = useDailySpark();
  // ← JOSH: plug useTasks() here for the task list
  // ← AARON: userName and dailyGoal come from useAppStore() or user profile

  function handleSparkComplete() {
    // 🔴 BLOCKED [L3, D7] — waiting on Josh's task cost logic + Aaron's Firestore write
    // Unblock: FirestoreService.completeTask() and useEmber() HP update must exist
    // ! do not ship this handler until the blocker is cleared
    console.log("🟡 STUB: spark complete tapped — no HP update yet");
  }

  function handleTaskToggle(taskId: string) {
    // 🔴 BLOCKED [L3, D7] — same as above
    console.log("🟡 STUB: task toggled", taskId);
  }

  return (
    <ScrollView
      style={styles.screen}
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
          <Text style={styles.pillText}>🔥 7-Day Streak</Text>
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
      <DailySparkCard task={stubSparkTask} onComplete={handleSparkComplete} />

      {/* Today's Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>TODAY'S PROGRESS</Text>
          <Text style={styles.progressCount}>
            {completedCount} of {dailyGoal} Complete
          </Text>
        </View>

        {/* Progress bar */}
        <HPBar value={(completedCount / dailyGoal) * 100} state={state} height={6} />

        {/* Task list — max 3 shown on Home */}
        <View style={styles.taskList}>
          {stubTasks.slice(0, 3).map((task) => (
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
