// 🔵 DECISION — replaced Aaron's Profile scaffold with Kaley's full Figma implementation [Apr 2026]
// ? Aaron: Kaley's version adds avatar/identity card, 2×2 stats grid, HP hero number, goal config stepper.
//   Your version used StreakDisplay, HPTrendChart, EvolutionLog components directly.
//   Kaley's inlines the profile layout and uses HPCostCalculator for goal stepper.
//   Aaron's profile components (StreakDisplay, HPTrendChart, EvolutionLog) are still in components/profile/
//   but are not imported by this screen — they can be re-integrated in Wave 3 if needed.

/**
 * Ember — Profile Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U8
 * Status: 🟡 STUB
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
import { HPBar } from "@/components/ui/HPBar";
import { HPCostCalculator } from "@/components/tasks/HPCostCalculator";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { EmberState, EmberStates } from "@/constants/EmberStates";

// ~ ─────────────────────────────────────────────────────────────────
// ~ STUB DATA
// ~ ─────────────────────────────────────────────────────────────────

// 🟡 STUB [L1, L2] — replace with useEmber() when Josh's hooks are done
const hp = 87;
const state: EmberState = "Thriving";

// 🟡 STUB [L6] — replace with useStreak() when Josh's hook is done
const streak = 7;

// 🟡 STUB [D7, D8, D9] — replace with real data from Aaron's services via Josh's hooks
const totalTasksDone = 42;
const questsCompleted = 12;
const daysTracked = 23;

// 🟡 STUB — replace with real user profile data when available
const userName = "Joshua Couto";
const userInitials = "JC";
const dailyGoal = 10;

// ~ ─────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  // ← JOSH: replace stubs above with:
  // const { hp, state } = useEmber();
  // const streak = useStreak();
  // const history = useHPHistory("weekly"); // or "monthly" based on toggle
  // ← AARON: totalTasksDone, questsCompleted, daysTracked come from Firestore aggregates

  function handleGoalChange(newGoal: number) {
    // 🔴 BLOCKED [D3, D6] — waiting on Aaron's AsyncStorage + Firestore sync
    // Unblock: useAppStore.setDailyGoal() or equivalent must exist
    // ! HP formula denominator changes when this updates — Josh's L1 must re-run
    console.log("🟡 STUB: daily goal changed to", newGoal);
  }

  const stateColor = EmberStates[state].color;

  return (
    <ScrollView
      style={styles.screen}
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
        {/* 🟡 STUB — replace with <HPTrendChart history={history} /> when D9 + Josh's hook ready */}
        {/* ^ HPTrendChart handles its own weekly/monthly toggle internally */}
        <View style={styles.chartStub}>
          <Text style={styles.chartStubLabel}>HP Trend</Text>
          <Text style={styles.chartStubSub}>
            🟡 STUB — HPTrendChart renders here{"\n"}
            Needs: useHPHistory() from Josh + D9 from Aaron
          </Text>
        </View>
      </View>

      {/* ~ ── Goal config ─────────────────────────────────────────── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Goal config</Text>
        <View style={styles.goalRow}>
          <View>
            <Text style={styles.goalLabel}>Daily task goal</Text>
            <Text style={styles.goalSub}>Sets your HP denominator</Text>
          </View>
          <HPCostCalculator
            initialValue={dailyGoal}
            onCostChange={handleGoalChange}
            min={1}
            max={30}
          />
        </View>
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
  // ~ HP Trend stub
  chartStub: {
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  chartStubLabel: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  chartStubSub: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    textAlign: "center",
  },
  // ~ Goal config
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalLabel: {
    fontSize: Typography.md,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  goalSub: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
