/**
 * Ember — Task Edit Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U7
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L3: useTask(id) hook returning a single Task — Josh — PENDING
 *   - D7: FirestoreService.updateTask() — Aaron — PENDING
 *
 * Notes:
 *   Pushed onto the stack when the user taps a TaskListItem on the task list.
 *   The user can edit the task name, priority, and HP cost.
 *   All form values are held in local useState (interaction state — Kaley owns this).
 *   On save, the screen calls Aaron's FirestoreService.updateTask() to persist.
 *
 * WHERE MISSING WORK GETS ADDED:
 *   1. Replace hardcoded form defaults → useTask(id) to load real task data (Josh L3)
 *   2. Wire up the save button → FirestoreService.updateTask() (Aaron D7)
 *   3. Priority selector currently uses Badge as visual-only — needs onPress to switch
 *
 * SCREEN LAYOUT:
 *   ┌──────────────────────────────────┐
 *   │ ← Back                          │
 *   │  Edit Task                       │
 *   │ ┌────────────────────────────┐   │
 *   │ │ Task Name                  │   │
 *   │ │ [__________________]      │   │  ← TextInput
 *   │ │ Priority                   │   │
 *   │ │ [low] [medium] [high]     │   │  ← Badge selector
 *   │ │ HP Cost                    │   │
 *   │ │    [-]  20  [+]           │   │  ← HPCostCalculator stepper
 *   │ └────────────────────────────┘   │
 *   │ [ Save ]                        │  ← Button
 *   └──────────────────────────────────┘
 */

import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TaskPriority } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HPCostCalculator } from "@/components/tasks/HPCostCalculator";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

// Zod schema — validation rules for the task edit form
const taskSchema = z.object({
  name: z.string().trim().min(1, "Task name is required."),
  priority: z.enum(["low", "medium", "high"]),
  hpCost: z.number().min(1).max(50),
});
type TaskFormData = z.infer<typeof taskSchema>;

// * Priority badge colors now come from Colors.ts design tokens
const PRIORITY_BADGE_COLORS: Record<TaskPriority, string> = {
  high: Colors.priorityHigh,
  medium: Colors.priorityMedium,
  low: Colors.priorityLow,
};

export default function TaskEditScreen() {
  // Read the task ID from the dynamic route: tasks/[id]
  const { id } = useLocalSearchParams<{ id: string }>();

  // ┌──────────────────────────────────────────────────────────────┐
  // │ STUB: TASK DATA (form defaults)                              │
  // │ 🟡 STUB [L3] — replace with useTask(id) to load real values │
  // │ Owner: Kaley | Replaces: task data from useTask(id)          │
  // │                                                              │
  // │ ← JOSH: plug useTask(id) here. It must return a Task.       │
  // │   Then pass task values as defaultValues to useForm below.   │
  // └──────────────────────────────────────────────────────────────┘
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "Finish project proposal",
      priority: "high",
      hpCost: 20,
    },
  });

  const selectedPriority = watch("priority");

  const onSubmit = (data: TaskFormData) => {
    // ┌──────────────────────────────────────────────────────────────┐
    // │ 🔴 BLOCKED [D7] — waiting on Aaron's Task CRUD              │
    // │ Unblock: FirestoreService.updateTask() must exist            │
    // │ ! do not ship the save button until this is resolved         │
    // │                                                              │
    // │ ← AARON: when D7 lands, uncomment and use:                  │
    // │   await FirestoreService.updateTask(id, {                    │
    // │     name: data.name,                                         │
    // │     priority: data.priority,                                 │
    // │     hpCost: data.hpCost,                                     │
    // │   });                                                        │
    // └──────────────────────────────────────────────────────────────┘
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Edit Task</Text>

        <Card>
          {/* Task name input */}
          <Text style={styles.fieldLabel}>Task Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                style={[styles.textInput, errors.name && styles.inputError]}
                placeholderTextColor={Colors.textSecondary}
              />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

          {/* Priority selector — tap a badge to select that priority */}
          <Text style={styles.fieldLabel}>Priority</Text>
          <View style={styles.priorityOptions}>
            {(["low", "medium", "high"] as TaskPriority[]).map((level) => (
              <Badge
                key={level}
                label={level.charAt(0).toUpperCase() + level.slice(1)}
                onPress={() => setValue("priority", level)}
                style={
                  selectedPriority === level
                    ? { backgroundColor: PRIORITY_BADGE_COLORS[level] } // full color when selected
                    : { opacity: 0.5 }                                    // dimmed when not selected
                }
              />
            ))}
          </View>

          {/* HP cost stepper — +/- buttons to set how much HP this task costs */}
          <Text style={styles.fieldLabel}>HP Cost</Text>
          <Controller
            control={control}
            name="hpCost"
            render={({ field: { onChange, value } }) => (
              <HPCostCalculator initialValue={value} onCostChange={onChange} min={1} max={50} />
            )}
          />
        </Card>

        {/* Save button — validates via Zod then fires onSubmit */}
        <Button label="Save" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
  },
  scrollContent: {
    padding: Spacing.screen,
    gap: Spacing.xl,
  },
  screenTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  fieldLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  textInput: {
    backgroundColor: Colors.bgInput,
    color: Colors.textPrimary,
    fontSize: Typography.md,
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priorityOptions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  inputError: {
    borderColor: Colors.priorityHigh,
  },
  errorText: {
    color: Colors.priorityHigh,
    fontSize: Typography.sm,
    marginTop: Spacing.xs,
  },
});
