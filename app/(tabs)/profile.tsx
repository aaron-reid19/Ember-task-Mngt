/**
 * Ember — Profile Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U8
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - L1, L2: useEmber() for hp, state — Josh
 *   - L6: useStreak() — Josh
 *   - useHPHistory(range): HP snapshot history for chart — Josh
 *   - D9: daily HP snapshot writes — Aaron
 *
 * Notes:
 *   Figma page 1 shows the Profile screen with:
 *     - Avatar initials circle + online dot
 *     - User name + "EMBER'S CURRENT STATE" label + state badge
 *     - Large HP % number
 *     - HPBar
 *     - 2×2 stats grid: Current streak / Total quests done / Quests completed / Days tracked
 *     - HP Trend chart (line chart) with Weekly/Monthly toggle
 *     - Goal Config — "Daily quest goal" stepper
 *   Profile components (HPTrendChart, StreakDisplay, HistoryCalendar) each handle their
 *   own internal state (e.g. weekly/monthly toggle lives inside HPTrendChart).
 *   ^ Stats grid values are all stubs — every one of these needs Josh or Aaron's data.
 */

import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HPBar } from "@/components/ui/HPBar";
import { HPTrendChart, ChartRange } from "@/components/profile/HPTrendChart";
import { HistoryCalendar } from "@/components/profile/HistoryCalendar";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { EmberStates } from "@/constants/EmberStates";
import { useEmber } from "@/hooks/useEmber";
import { useStreak } from "@/hooks/useStreak";
import { useHPHistory } from "@/hooks/useHPHistory";
import { useQuests } from "@/hooks/useQuests";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/store/authContext";

export default function ProfileScreen() {
  const { hp, state } = useEmber();
  const { current: streak } = useStreak();
  const { snapshots } = useHPHistory();
  const { quests } = useQuests();
  const { user, logout } = useAuth();
  const { dailyGoal, setDailyGoalLocal, updateDisplayName, saveDailyGoal } = useProfile();
  const router = useRouter();

  // ~ ─── Local edit state ────────────────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(user?.displayName ?? "Explorer");
  const [showTrend, setShowTrend] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [trendRange, setTrendRange] = useState<ChartRange>("weekly");

  // ~ ─── Save handler ────────────────────────────────────────────────────────
  const handleSave = async () => {
    await updateDisplayName(editDisplayName);
    await saveDailyGoal(dailyGoal);
    setEditMode(false);
  };

  const questsCompleted = quests.filter((q) => q.completed).length;
  const daysTracked = snapshots.length;

  const userName = user?.displayName ?? "Explorer";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const stateColor = EmberStates[state].color;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ~ ── Avatar + identity card ─────────────────────────────── */}
      <View style={styles.identityCard}>
        {/* Avatar circle with initials */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{userInitials}</Text>
          </View>
          {/* Online indicator dot */}
          <View style={styles.onlineDot} />
        </View>

        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.stateLabel}>EMBER'S CURRENT STATE</Text>

        {/* State badge */}
        <View style={[styles.stateBadge, { borderColor: stateColor }]}>
          <Text style={[styles.stateBadgeText, { color: stateColor }]}>{state}</Text>
        </View>

        {/* Edit profile button */}
        <Pressable
          style={styles.editButton}
          onPress={() => setEditMode(!editMode)}
          accessibilityLabel="Edit profile settings"
        >
          <Ionicons
            name={editMode ? "close-outline" : "settings-outline"}
            size={16}
            color={Colors.accent}
          />
          <Text style={styles.editButtonLabel}>
            {editMode ? "Cancel" : "Edit Profile"}
          </Text>
        </Pressable>

        {/* Large HP % */}
        <Text style={[styles.hpHero, { color: stateColor }]}>{hp}%</Text>

        {/* HP bar */}
        <HPBar value={hp} state={state} height={10} />
      </View>

      {/* ~ ── Edit settings panel — only visible when editMode is true ───── */}
      {editMode && (
        <View style={styles.settingsPanel}>
          {/* Display name input */}
          <Text style={styles.settingLabel}>Display Name</Text>
          <TextInput
            style={styles.settingInput}
            value={editDisplayName}
            onChangeText={setEditDisplayName}
            placeholder="Your name"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="words"
          />

          {/* Daily quest goal stepper */}
          <Text style={styles.settingLabel}>Daily Quest Goal</Text>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepperButton}
              onPress={() => setDailyGoalLocal(Math.max(1, dailyGoal - 1))}
              accessibilityLabel="Decrease daily goal"
            >
              <Text style={styles.stepperButtonLabel}>−</Text>
            </Pressable>
            <Text style={styles.stepperValue}>{dailyGoal}</Text>
            <Pressable
              style={styles.stepperButton}
              onPress={() => setDailyGoalLocal(dailyGoal + 1)}
              accessibilityLabel="Increase daily goal"
            >
              <Text style={styles.stepperButtonLabel}>+</Text>
            </Pressable>
          </View>

          {/* Save button */}
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonLabel}>Save Changes</Text>
          </Pressable>
        </View>
      )}

      {/* ~ ── Stats grid ──────────────────────────────────────────── */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.statCardFull]}>
          <Text style={[styles.statValue, { color: stateColor }]}>{streak}</Text>
          <Text style={styles.statLabel}>Current streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: stateColor }]}>{questsCompleted}</Text>
          <Text style={styles.statLabel}>Quests completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValueMuted}>{daysTracked}</Text>
          <Text style={styles.statLabel}>Days tracked</Text>
        </View>
      </View>

      {/* ~ ── HP Trend chart ─────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.dropdownHeader}>
          <Text style={styles.dropdownTitle}>HP Trend</Text>
          {showTrend && (
            <View style={styles.toggleGroup}>
              <Pressable
                onPress={() => setTrendRange("weekly")}
                style={[styles.toggleButton, trendRange === "weekly" && styles.toggleButtonActive]}
              >
                <Text style={[styles.toggleLabel, trendRange === "weekly" && styles.toggleLabelActive]}>
                  Weekly
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setTrendRange("monthly")}
                style={[styles.toggleButton, trendRange === "monthly" && styles.toggleButtonActive]}
              >
                <Text style={[styles.toggleLabel, trendRange === "monthly" && styles.toggleLabelActive]}>
                  Monthly
                </Text>
              </Pressable>
            </View>
          )}
          <Pressable
            onPress={() => setShowTrend(!showTrend)}
            style={styles.dropdownIcon}
          >
            <Ionicons
              name={showTrend ? "chevron-up" : "chevron-down"}
              size={20}
              color={showTrend ? Colors.accent : Colors.textSecondary}
            />
          </Pressable>
        </View>
        {showTrend && (
          <HPTrendChart
            snapshots={snapshots}
            activeRange={trendRange}
            onRangeChange={setTrendRange}
          />
        )}
      </View>

      {/* ~ ── History Calendar ─────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.dropdownHeader}>
          <Text style={styles.dropdownTitle}>History</Text>
          <Pressable
            onPress={() => setShowHistory(!showHistory)}
            style={styles.dropdownIcon}
          >
            <Ionicons
              name={showHistory ? "chevron-up" : "chevron-down"}
              size={20}
              color={showHistory ? Colors.accent : Colors.textSecondary}
            />
          </Pressable>
        </View>
        {showHistory && <HistoryCalendar history={snapshots} />}
      </View>

      {/* ~ ── Logout ────────────────────────────────────────────── */}
      <Pressable style={styles.logoutButton} onPress={async () => {
        await logout();
        router.replace("/(auth)/login");
      }}>
        <Ionicons name="log-out-outline" size={18} color={Colors.destructive} />
        <Text style={styles.logoutLabel}>Log Out</Text>
      </Pressable>

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
  // ~ Identity card
  identityCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: Spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  avatarWrap: {
    position: "relative",
    marginBottom: Spacing.xs,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.bgDeep,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.onlineGreen, // green online indicator
    borderWidth: 2,
    borderColor: Colors.bgCard,
  },
  userName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  stateLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    letterSpacing: Typography.capsTracking,
  },
  stateBadge: {
    borderRadius: 99,
    borderWidth: 1.5,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
  stateBadgeText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  hpHero: {
    fontSize: Typography.hero,
    fontWeight: Typography.extraBold,
    lineHeight: Typography.hero + 8,
  },
  // ~ Edit profile button + settings panel
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  editButtonLabel: {
    fontSize: 13,
    color: Colors.accent,
  },
  settingsPanel: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: Spacing.card,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  settingInput: {
    backgroundColor: Colors.bgInput,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 15,
    marginBottom: 12,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonLabel: {
    fontSize: 20,
    color: Colors.bgDeep,
    fontWeight: "bold",
    lineHeight: 24,
  },
  stepperValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.textPrimary,
    minWidth: 32,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.bgDeep,
  },
  // ~ Stats grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.cardGap,
  },
  statCardFull: {
    minWidth: "100%",
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: Spacing.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: Typography.xxl,
    fontWeight: Typography.extraBold,
  },
  statValueMuted: {
    fontSize: Typography.xxl,
    fontWeight: Typography.extraBold,
    color: Colors.textMuted,
  },
  statLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  // ~ Generic card
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: Spacing.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  // ~ Dropdown section header
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  dropdownIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bgCardAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  // ~ Toggle (Weekly / Monthly)
  toggleGroup: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  toggleButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.md,
    backgroundColor: "transparent",
  },
  toggleButtonActive: {
    backgroundColor: Colors.accent,
  },
  toggleLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
  },
  toggleLabelActive: {
    color: Colors.completeText,
    fontWeight: Typography.bold,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.destructive,
  },
  logoutLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.destructive,
  },
});
