/**
 * Ember — Add Quest Screen ("Forge New Quest")
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U4 (add quest form)
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - D8: FirestoreService.createQuest() — Aaron — PENDING
 *   - L3: HP deduction on quest creation — Josh — PENDING
 *
 * Notes:
 *   Figma pages 14–24 show the Add Quest form with multiple interaction states:
 *     - Quest Name (TextInput)
 *     - Description (multiline TextInput, optional)
 *     - HP Cost stepper (HPCostCalculator)
 *     - Frequency section: pill tabs (Daily / Weekly / Biweekly / Monthly)
 *       + M T W T F S S day selectors when Weekly is chosen
 *     - Start Date section: "Today?" default → calendar picker on expand
 *     - "Save Quest" (primary) + "Discard" (secondary) buttons
 *   All form state is local — this screen owns its useState for every field.
 *   The HP deduction on save belongs to Josh's L3, not here.
 *   * Local state for form fields is Kaley's to own per EMBER_BEST_PRACTICES.
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HPCostCalculator } from "@/components/tasks/HPCostCalculator";
import { Button } from "@/components/ui/Button";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { QuestCadence, WeekDay } from "@/types";
import { useAuth } from "@/store/authContext";
import { createQuest } from "@/services/FirestoreServices";

// Zod schema — validation rules for the add quest form
const questSchema = z.object({
  name: z.string().trim().min(1, "Quest name is required."),
  description: z.string().optional(),
  hpCost: z.number().min(1).max(50),
  frequency: z.enum(["Daily", "Weekly", "Biweekly", "Monthly"]),
  activeDays: z.array(z.enum(["M", "T", "W", "Th", "F", "S", "Su"])),
  startDate: z.string().nullable().optional(),
});
type QuestFormData = z.infer<typeof questSchema>;

// ~ ─────────────────────────────────────────────────────────────────

// * Frequency options seen in Figma (pill tabs inside frequency section)
const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Biweekly", "Monthly"] as const;

// * Day selector — M T W T F S S
const DAYS: { label: string; value: WeekDay }[] = [
  { label: "M", value: "M" },
  { label: "T", value: "T" },
  { label: "W", value: "W" },
  { label: "T", value: "Th" },
  { label: "F", value: "F" },
  { label: "S", value: "S" },
  { label: "S", value: "Su" },
];

// ~ ─────────────────────────────────────────────────────────────────

export default function AddQuestScreen() {
  const { user } = useAuth();

  // * All form state managed by React Hook Form + Zod
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<QuestFormData>({
    resolver: zodResolver(questSchema),
    defaultValues: {
      name: "",
      description: "",
      hpCost: 10,
      frequency: "Weekly",
      activeDays: [],
      startDate: null,
    },
  });

  const frequency = watch("frequency");
  const activeDays = watch("activeDays");
  const startDate = watch("startDate");
  const [showCalendar, setShowCalendar] = React.useState(false);

  // ~ ───────────────────────────────────────────────────────────────

  function toggleDay(day: WeekDay) {
    const current = activeDays;
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setValue("activeDays", next);
  }

  async function onSubmit(data: QuestFormData) {
    if (!user) return;
    await createQuest(user.uid, {
      title: data.name,
      description: data.description ?? "",
      hpReward: data.hpCost,
      cadence: data.frequency.toLowerCase() as any,
      recurrenceRule: data.activeDays.length > 0 ? data.activeDays.join(",") : null,
    });
    router.back();
  }

  function handleDiscard() {
    router.back();
  }

  // ~ ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.pageTitle}>Forge New Quest</Text>

      {/* ~ ── Quest details card ─────────────────────────────────── */}
      <View style={styles.card}>
        {/* Quest Name */}
        <Text style={styles.fieldLabel}>QUEST NAME</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={value}
              onChangeText={onChange}
              placeholder="Read for 20 Minutes"
              placeholderTextColor={Colors.textMuted}
              returnKeyType="next"
            />
          )}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        {/* Description */}
        <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>DESCRIPTION</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={value}
              onChangeText={onChange}
              placeholder="Add a description (optional)"
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />

        {/* HP Cost stepper */}
        <Controller
          control={control}
          name="hpCost"
          render={({ field: { onChange, value } }) => (
            <HPCostCalculator
              initialValue={value}
              onCostChange={onChange}
              min={1}
              max={50}
            />
          )}
        />
      </View>

      {/* ~ ── Frequency card ─────────────────────────────────────── */}
      <View style={styles.card}>
        {/* Frequency header row — label + expand toggle */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.fieldLabel}>FREQUENCY</Text>
            <Text style={styles.sectionValue}>{frequency}</Text>
          </View>
          {/* Calendar icon — tapping expands frequency options */}
          <Pressable
            onPress={() => setShowCalendar(!showCalendar)}
            style={styles.iconButton}
          >
            {/* 🟡 STUB — replace with calendar icon asset */}
            <View style={styles.iconPlaceholder} />
          </Pressable>
        </View>

        {/* Day selector — M T W T F S S */}
        <View style={styles.dayRow}>
          {DAYS.map((day, index) => {
            const isSelected = activeDays.includes(day.value);
            return (
              <Pressable
                key={`${day.value}-${index}`}
                onPress={() => toggleDay(day.value)}
                style={[styles.dayBtn, isSelected && styles.dayBtnSelected]}
              >
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                  {day.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Frequency pill tabs — shown when expanded */}
        {showCalendar && (
          <View style={styles.frequencyPills}>
            {FREQUENCY_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => setValue("frequency", option)}
                style={[
                  styles.frequencyPill,
                  frequency === option && styles.frequencyPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.frequencyPillLabel,
                    frequency === option && styles.frequencyPillLabelSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* ~ ── Start Date card ────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.fieldLabel}>START DATE</Text>
            <Text style={styles.sectionValue}>
              {startDate ?? "Today?"}
            </Text>
          </View>
          {/* Calendar icon — tapping would open date picker */}
          <Pressable style={styles.iconButton}>
            {/* 🟡 STUB — replace with calendar icon + DateTimePicker */}
            {/* ⚪ DEFERRED — full date picker integration
                Reason: MVP uses "Today" as default per Figma
                Unblock: add @react-native-community/datetimepicker when ready */}
            <View style={[styles.iconPlaceholder, styles.iconPlaceholderActive]} />
          </Pressable>
        </View>
      </View>

      {/* ~ ── Action buttons ─────────────────────────────────────── */}
      <Button label="Save Quest" onPress={handleSubmit(onSubmit)} variant="primary" />
      <Button label="Discard" onPress={handleDiscard} variant="secondary" />
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
  pageTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.extraBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  // ~ Card container
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: Spacing.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  // ~ Form fields
  fieldLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    letterSpacing: Typography.capsTracking,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.bgInput,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: Typography.md,
    color: Colors.textPrimary,
  },
  inputMultiline: {
    minHeight: 100,
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.priorityHigh,
  },
  errorText: {
    color: Colors.priorityHigh,
    fontSize: Typography.sm,
    marginTop: Spacing.xs,
  },
  // ~ Frequency section
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionValue: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  // 🟡 STUB — remove when icon assets are added
  iconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  iconPlaceholderActive: {
    borderColor: Colors.accent,
  },
  // ~ Day selector
  dayRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "space-between",
  },
  dayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.daySelectorDefault,
    alignItems: "center",
    justifyContent: "center",
  },
  dayBtnSelected: {
    backgroundColor: Colors.daySelectorSelected,
  },
  dayLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
  },
  dayLabelSelected: {
    color: Colors.daySelectorSelectedText,
  },
  // ~ Frequency pills
  frequencyPills: {
    flexDirection: "row",
    gap: Spacing.sm,
    flexWrap: "wrap",
    marginTop: Spacing.md,
  },
  frequencyPill: {
    borderRadius: 99,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  frequencyPillSelected: {
    borderColor: Colors.accent,
  },
  frequencyPillLabel: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    fontWeight: Typography.medium,
  },
  frequencyPillLabelSelected: {
    color: Colors.accent,
    fontWeight: Typography.bold,
  },
});
