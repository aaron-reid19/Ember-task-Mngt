/**
 * Ember — Profile Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U8
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - L1, L2: useEmber() for hp, state — Josh — PENDING
 *   - L6: useStreak() — Josh — PENDING
 *   - useHPHistory(range): HP snapshot history for chart — Josh — PENDING
 *   - D9: daily HP snapshot writes — Aaron — PENDING
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

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { useTasks } from "@/hooks/useTasks";
import { useQuests } from "@/hooks/useQuests";
import { useAuth } from "@/store/authContext";

export default function ProfileScreen() {
  const { hp, state } = useEmber();
  const { current: streak } = useStreak();
  const { snapshots } = useHPHistory();
  const { tasks } = useTasks();
  const { quests } = useQuests();
  const { user } = useAuth();

  const totalTasksDone = tasks.filter((t) => t.completed).length;
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

        {/* Large HP % */}
        <Text style={[styles.hpHero, { color: stateColor }]}>{hp}%</Text>

        {/* HP bar */}
        <HPBar value={hp} state={state} height={10} />
      </View>

      {/* ~ ── Stats grid — 2×2 ──────────────────────────────────── */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: stateColor }]}>{streak}</Text>
          <Text style={styles.statLabel}>Current streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: stateColor }]}>{totalTasksDone}</Text>
          <Text style={styles.statLabel}>Total tasks done</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: stateColor }]}>{questsCompleted}</Text>
          <Text style={styles.statLabel}>Quests completed</Text>
        </View>
        <View style={styles.statCard}>
          {/* ^ this one is intentionally muted — "Days tracked" is less exciting */}
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
  // ~ Stats grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.cardGap,
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
});
