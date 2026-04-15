/**
 * Ember — QuestFilterTabs
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U4
 * Status: 🟢 READY
 *
 * Notes:
 *   Horizontal pill-style filter strip seen at top of Quest Board.
 *   Figma shows: Once / Daily / Weekly / Monthly / Custom
 *   Selected tab has white text + pill background; others are muted.
 *   * Local useState for selected tab — this is interaction state, Kaley owns it.
 *   Fires onSelect(cadence) up to the screen so it can filter the quest list.
 */

import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { QuestCadence, CADENCE_LABELS } from "@/types";

// ~ ─────────────────────────────────────────────────────────────────

// * Figma shows these five tabs on Quest Board
// * "Biweekly" appears in Add Quest form but not Quest Board filter — matches spec
const CADENCE_TABS: QuestCadence[] = ["today", "daily", "weekly", "monthly", "custom"];

export interface QuestFilterTabsProps {
  onSelect: (cadence: QuestCadence) => void;
  initialSelected?: QuestCadence;
}

// ~ ─────────────────────────────────────────────────────────────────

export function QuestFilterTabs({
  onSelect,
  initialSelected = "daily",
}: QuestFilterTabsProps) {
  // * Local state — selected tab is purely interaction state, not business logic
  const [selected, setSelected] = useState<QuestCadence>(initialSelected);

  function handleSelect(cadence: QuestCadence) {
    setSelected(cadence);
    onSelect(cadence);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {CADENCE_TABS.map((cadence) => {
        const isSelected = cadence === selected;
        return (
          <Pressable
            key={cadence}
            onPress={() => handleSelect(cadence)}
            style={[styles.tab, isSelected && styles.tabSelected]}
          >
            <Text style={[styles.tabLabel, isSelected && styles.tabLabelSelected]}>
              {CADENCE_LABELS[cadence]}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    marginBottom: Spacing.md,
  },
  scrollContent: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.screen,
  },
  tab: {
    borderRadius: 99,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "transparent",
  },
  tabSelected: {
    backgroundColor: Colors.bgCardAlt,
    borderColor: Colors.textPrimary,
  },
  tabLabel: {
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Colors.textMuted,
  },
  tabLabelSelected: {
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
});
