/**
 * Ember — Task Edit Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U7
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - L3: useTask(id) hook returning a single Task — Josh — 🟢 READY
 *   - D7: useTasks().update() for persisting edits — Aaron — 🟢 READY
 *
 * Notes:
 *   Pushed onto the stack when the user taps a TaskListItem on the task list.
 *   The user can edit the task name, priority, and HP cost.
 *   All form values are managed by React Hook Form + Zod.
 *   On save, the screen calls useTasks().update() which routes through Josh's hook.
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

import { View, Text, TextInput, ScrollView, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TaskPriority } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HPCostCalculator } from "@/components/tasks/HPCostCalculator";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { useTask } from "@/hooks/useTask";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/store/authContext";

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
  const { id } = useLocalSearchParams<{ id: string }>();
  const { task, loading } = useTask(id);
  const { update: updateTask } = useTasks();
  const { user } = useAuth();
  const router = useRouter();

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task?.name ?? "",
      priority: task?.priority ?? "medium",
      hpCost: task?.hpCost ?? 10,
    },
  });

  const selectedPriority = watch("priority");

  const onSubmit = async (data: TaskFormData) => {
    await updateTask(id, {
      title: data.name,
      priority: data.priority,
      hpCost: data.hpCost,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.screenTitle}>Edit Task</Text>
          <View style={{ width: 32 }} />
        </View>

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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: Spacing.xs,
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
