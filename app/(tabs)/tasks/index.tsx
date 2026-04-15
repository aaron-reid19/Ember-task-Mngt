/**
 * Ember — Task List Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U6
 * Status: 🟢 READY
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

import { View, FlatList, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TaskListItem } from "@/components/tasks/TaskListItem";
import { Ionicons } from "@expo/vector-icons";
import { HPBar } from "@/components/ui/HPBar";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { useEmber } from "@/hooks/useEmber";
import { useTasks } from "@/hooks/useTasks";

export default function TaskListScreen() {
  const router = useRouter();
  const { hp, state } = useEmber();
  const { tasks } = useTasks();

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.screenTitle}>Quests</Text>
        <View style={{ width: 32 }} />
      </View>

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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
  },
  backButton: {
    padding: Spacing.xs,
  },
  screenTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  hpBarSection: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.screen,
  },
  taskList: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.xxl,
  },
  listSeparator: {
    height: Spacing.md,
  },
});
