// 🔵 DECISION — replaced Aaron's Quest Board scaffold with Kaley's full Figma implementation [Apr 2026]
// ? Aaron: Kaley's version adds sticky header, status strip pills, and different layout philosophy.
//   Your version used FlatList + SafeAreaView + FontSize/FontWeight imports.
//   Kaley's uses ScrollView + View + Typography import. Also, QuestFilterTabs props changed:
//   Aaron's: selected + onFilterChange. Kaley's: onSelect (no controlled selected prop).

/**
 * Ember — Quest Board Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U4
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L7: useQuests(cadence) returning filtered quest list — Josh — PENDING
 *   - L1, L2: useEmber() for status strip — Josh — PENDING
 *   - D8: quest toggle write — Aaron — PENDING
 *
 * Notes:
 *   Figma pages 8–11 show the Quest Board across multiple HP states.
 *   Layout:
 *     - "Quest Board" title header (dark background)
 *     - QuestFilterTabs (Once / Daily / Weekly / Monthly / Custom)
 *     - Status strip (streak · state · HP) + HPBar
 *     - Scrollable list of QuestCards
 *   Tapping a card navigates to /(tabs)/quests/[id] (Quest Detail).
 *   Tapping a checkbox fires toggle — HP logic is Josh's L3.
 *   * Coordinator only — no calculations here.
 */

import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { QuestFilterTabs } from "@/components/quests/QuestFilterTabs";
import { QuestCard } from "@/components/quests/QuestCard";
import { HPBar } from "@/components/ui/HPBar";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { EmberState } from "@/constants/EmberStates";
import { Quest, QuestCadence } from "@/types";

// ~ ─────────────────────────────────────────────────────────────────
// ~ STUB DATA
// ~ ─────────────────────────────────────────────────────────────────

// 🟡 STUB [L1, L2] — replace with useEmber() when Josh's hooks are done
const hp = 12;
const state: EmberState = "Strained";

// 🟡 STUB [L7, D8] — replace with useQuests(selectedCadence) when Josh's hook is done
// Owner: Kaley | Replaces: quests array from useQuests()
const stubQuests: Quest[] = [
  {
    id: "q1",
    name: "Clean Bathroom",
    hpCost: 20,
    completed: false,
    isDailySpark: true,
    cadence: "Daily",
    status: "in progress",
  },
  {
    id: "q2",
    name: "Walk Jaronadel",
    hpCost: 10,
    completed: false,
    isDailySpark: false,
    cadence: "Daily",
    status: "in progress",
  },
  {
    id: "q3",
    name: "Read for 20 minutes",
    hpCost: 10,
    completed: false,
    isDailySpark: false,
    cadence: "Daily",
    status: "in progress",
  },
];

// ~ ─────────────────────────────────────────────────────────────────

export default function QuestBoardScreen() {
  // * Local state for the selected filter tab — interaction state, Kaley owns this
  const [selectedCadence, setSelectedCadence] = useState<QuestCadence>("Daily");

  // ← JOSH: replace stub quests with useQuests(selectedCadence)
  // ^ if hook isn't ready by Apr 9, this screen stays on stub data into Wave 3

  function handleTabSelect(cadence: QuestCadence) {
    setSelectedCadence(cadence);
    // ← JOSH: useQuests() will re-filter automatically when cadence changes
  }

  function handleQuestPress(questId: string) {
    router.push(`/(tabs)/quests/${questId}`);
  }

  function handleQuestToggle(questId: string) {
    // 🔴 BLOCKED [L3, D8] — waiting on Josh's task cost logic + Aaron's Quest CRUD
    // Unblock: FirestoreService.toggleQuest() and useEmber() HP update must exist
    // ! do not ship this handler until the blocker is cleared
    console.log("🟡 STUB: quest toggled", questId);
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quest Board</Text>
      </View>

      {/* Filter tabs — rendered outside ScrollView so they stay sticky */}
      <QuestFilterTabs onSelect={handleTabSelect} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Status strip + HP bar */}
        <View style={styles.statusStrip}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>🔥 7-Day Streak</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{state}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{hp} HP</Text>
          </View>
        </View>
        <HPBar value={hp} state={state} height={8} />

        {/* Quest list */}
        <View style={styles.questList}>
          {stubQuests
            .filter((q) => q.cadence === selectedCadence)
            .map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onPress={() => handleQuestPress(quest.id)}
                onToggle={() => handleQuestToggle(quest.id)}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bgDeep,
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.cardGap,
  },
  statusStrip: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  pill: {
    backgroundColor: Colors.bgCard,
    borderRadius: 99,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillText: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  questList: {
    gap: Spacing.cardGap,
    marginTop: Spacing.sm,
  },
});
