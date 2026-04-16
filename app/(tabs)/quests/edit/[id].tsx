/**
 * Ember — Quest Edit Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U7
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - L3: useQuest(id) hook returning a single Quest — Josh — 🟢 READY
 *   - D7: useQuests().update() for persisting edits — Aaron — 🟢 READY
 *
 * Notes:
 *   Pushed onto the stack when the user taps a QuestListItem. The user can
 *   edit the quest name, priority, and HP cost. All form values are managed
 *   by React Hook Form + Zod. On save, calls useQuests().update().
 *   // * Priority is kept as a quest-level concept (former Task field)
 *
 * SCREEN LAYOUT:
 *   ┌──────────────────────────────────┐
 *   │ ← Back                          │
 *   │  Edit Quest                     │
 *   │ ┌────────────────────────────┐   │
 *   │ │ Quest Name                 │   │
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
import type { QuestPriority } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HPCostCalculator } from "@/components/quests/HPCostCalculator";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { useQuest } from "@/hooks/useQuest";
import { useQuests } from "@/hooks/useQuests";

// Zod schema — validation rules for the quest edit form
const questSchema = z.object({
  name: z.string().trim().min(1, "Quest name is required."),
  priority: z.enum(["low", "medium", "high"]),
  hpCost: z.number().min(1).max(50),
});
type QuestFormData = z.infer<typeof questSchema>;

// * Priority badge colors now come from Colors.ts design tokens
const PRIORITY_BADGE_COLORS: Record<QuestPriority, string> = {
  high: Colors.priorityHigh,
  medium: Colors.priorityMedium,
  low: Colors.priorityLow,
};

export default function QuestEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { quest } = useQuest(id);
  const { update: updateQuest } = useQuests();
  const router = useRouter();

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<QuestFormData>({
    resolver: zodResolver(questSchema),
    defaultValues: {
      name: quest?.name ?? "",
      priority: quest?.priority ?? "medium",
      hpCost: quest?.hpCost ?? 10,
    },
  });

  const selectedPriority = watch("priority");

  const onSubmit = async (data: QuestFormData) => {
    await updateQuest(id, {
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
          <Text style={styles.screenTitle}>Edit Quest</Text>
          <View style={{ width: 32 }} />
        </View>

        <Card>
          {/* Quest name input */}
          <Text style={styles.fieldLabel}>Quest Name</Text>
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
            {(["low", "medium", "high"] as QuestPriority[]).map((level) => (
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

          {/* HP cost stepper — +/- buttons to set how much HP this quest costs */}
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
