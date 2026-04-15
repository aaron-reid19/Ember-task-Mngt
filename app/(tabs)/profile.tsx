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
 *     - 2×2 stats grid: Current streak / Total tasks done / Quests completed / Days tracked
 *     - HP Trend chart (line chart) with Weekly/Monthly toggle
 *     - Goal Config — "Daily task goal" stepper
 *   Profile components (HPTrendChart, StreakDisplay, EvolutionLog) each handle their
 *   own internal state (e.g. weekly/monthly toggle lives inside HPTrendChart).
 *   ^ Stats grid values are all stubs — every one of these needs Josh or Aaron's data.
 */

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { updateProfile } from "firebase/auth";
import { HPBar } from "@/components/ui/HPBar";
import { HPTrendChart } from "@/components/profile/HPTrendChart";
import { EvolutionLog } from "@/components/profile/EvolutionLog";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { EmberStates } from "@/constants/EmberStates";
import { useEmber } from "@/hooks/useEmber";
import { useStreak } from "@/hooks/useStreak";
import { useHPHistory } from "@/hooks/useHPHistory";
import { useQuests } from "@/hooks/useQuests";
import { useAuth } from "@/store/authContext";
import { updateUserProfile } from "@/services/FirestoreServices";
import { AsyncStorageService } from "@/services/AsyncStorageService";

export default function ProfileScreen() {
  const { hp, state } = useEmber();
  const { current: streak } = useStreak();
  const { snapshots } = useHPHistory();
  const { quests } = useQuests();
  const { user, logout } = useAuth();
  const router = useRouter();

  // ~ ─── Local edit state ────────────────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(user?.displayName ?? "Explorer");
  const [dailyGoal, setDailyGoal] = useState(5);

  useEffect(() => {
    AsyncStorageService.getDailyGoal().then(setDailyGoal);
  }, []);

  // ~ ─── Save handler ────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (user) {
      await updateProfile(user, { displayName: editDisplayName });
      await updateUserProfile(user.uid, { displayName: editDisplayName });
    }
    await AsyncStorageService.setDailyGoal(dailyGoal);
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
        <TouchableOpacity
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
        </TouchableOpacity>

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
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => setDailyGoal((g) => Math.max(1, g - 1))}
              accessibilityLabel="Decrease daily goal"
            >
              <Text style={styles.stepperButtonLabel}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepperValue}>{dailyGoal}</Text>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => setDailyGoal((g) => g + 1)}
              accessibilityLabel="Increase daily goal"
            >
              <Text style={styles.stepperButtonLabel}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Save button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonLabel}>Save Changes</Text>
          </TouchableOpacity>
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
        <HPTrendChart snapshots={snapshots} />
      </View>

      {/* ~ ── Evolution Log ──────────────────────────────────────── */}
      <View style={styles.card}>
        <EvolutionLog snapshots={snapshots} />
      </View>

      {/* ~ ── Logout ────────────────────────────────────────────── */}
      <TouchableOpacity style={styles.logoutButton} onPress={async () => {
        await logout();
        router.replace("/(auth)/login");
      }}>
        <Ionicons name="log-out-outline" size={18} color="#E74C3C" />
        <Text style={styles.logoutLabel}>Log Out</Text>
      </TouchableOpacity>

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
  cardTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E74C3C",
  },
  logoutLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#E74C3C",
  },
});
