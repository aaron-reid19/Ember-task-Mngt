/**
 * Ember — Task List Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U6
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L1, L2: useEmber() for current HP display alongside the list — Josh — PENDING
 *   - L3: useTasks() returning Task[] — Josh — PENDING
 *   - D7: Task CRUD in Firestore — Aaron — PENDING
 *
 * Notes:
 *   Shows all tasks in a scrollable list. Each row displays the task name,
 *   priority badge, category tags, and HP cost. An HP bar at the top gives
 *   the user context on how their current tasks relate to their creature's health.
 *   Tapping a task row navigates to the task edit screen.
 *
 * WHERE MISSING WORK GETS ADDED:
 *   1. Replace hp/state stubs → useEmber() hook (Josh L1, L2)
 *   2. Replace hardcoded tasks array → useTasks() hook (Josh L3)
 *   3. Navigation to task edit already works — no changes needed
 *
 * SCREEN LAYOUT:
 *   ┌─────────────────────────────────┐
 *   │  Tasks                          │  ← screen title
 *   │  [████████░░░░] 72% HP          │  ← HPBar showing current health
 *   │  ┌─────────────────────────┐    │
 *   │  │ Task name      -20 HP  │    │  ← TaskListItem (repeated)
 *   │  │ [high] [work]          │    │
 *   │  └─────────────────────────┘    │
 *   └─────────────────────────────────┘
 */

import { View, FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import type { EmberState, Task } from "@/types";
import { TaskListItem } from "@/components/tasks/TaskListItem";
import { HPBar } from "@/components/ui/HPBar";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

export default function TaskListScreen() {
  const router = useRouter();

  // ┌──────────────────────────────────────────────────────────────┐
  // │ STUB #1: CREATURE STATE (for the HP bar at top)              │
  // │ 🟡 STUB [L1, L2] — replace with useEmber()                  │
  // │ Owner: Kaley | Replaces: { hp, state } from useEmber()       │
  // │                                                              │
  // │ ← JOSH: plug useEmber() here. Only hp and state are needed   │
  // │   on this screen (isBonfire is only used on the Home screen).│
  // │                                                              │
  // │ When Josh's hooks land, this becomes:                        │
  // │   const { hp, state } = useEmber();                          │
  // └──────────────────────────────────────────────────────────────┘
  const hp = 72;
  const state: EmberState = "Steady";

  // ┌──────────────────────────────────────────────────────────────┐
  // │ STUB #2: TASK LIST DATA                                      │
  // │ 🟡 STUB [L3] — replace with useTasks()                      │
  // │ Owner: Kaley | Replaces: task list from useTasks()            │
  // │                                                              │
  // │ ← JOSH: plug useTasks() here. Must return Task[].            │
  // │                                                              │
  // │ When Josh's hook lands, this becomes:                        │
  // │   const tasks = useTasks();                                  │
  // └──────────────────────────────────────────────────────────────┘
  const tasks: Task[] = [
    {
      id: "t1",
      name: "Finish project proposal",
      priority: "high",
      tags: ["work"],
      hpCost: 20,
      completed: false,
      isDailySpark: false,
      createdAt: "2026-04-06",
    },
    {
      id: "t2",
      name: "Go for a run",
      priority: "medium",
      tags: ["health"],
      hpCost: 10,
      completed: false,
      isDailySpark: false,
      createdAt: "2026-04-06",
    },
    {
      id: "t3",
      name: "Read chapter 5",
      priority: "low",
      tags: ["learning"],
      hpCost: 5,
      completed: true,
      isDailySpark: false,
      createdAt: "2026-04-05",
    },
  ];

  return (
    <SafeAreaView style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Tasks</Text>

      {/* HP bar gives context — user sees their health alongside pending tasks */}
      <View style={styles.hpBarSection}>
        <HPBar value={hp} state={state} />
      </View>

      {/* Task list — each row navigates to the task edit screen on tap */}
      <FlatList
        data={tasks}
        keyExtractor={(task) => task.id}
        contentContainerStyle={styles.taskList}
        renderItem={({ item: task }) => (
          <TaskListItem
            task={task}
            onToggle={() => router.push(`/(tabs)/tasks/${task.id}`)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
  },
  screenTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
  },
  hpBarSection: {
    paddingVertical: Spacing.lg,
  },
  taskList: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.xxl,
  },
  listSeparator: {
    height: Spacing.md,
  },
});
