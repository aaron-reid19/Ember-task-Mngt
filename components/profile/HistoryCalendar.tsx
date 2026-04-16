/**
 * Ember — History Calendar
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U8
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L2: EmberState classifier (Thriving/Steady/Strained/Flickering) — Josh — PENDING
 *   - L6, D9: useHPHistory() hook returning HPSnapshot[] — Josh + Aaron — PENDING
 *
 * Notes:
 *   Replaces EvolutionLog.tsx. Same HPSnapshot[] prop — no data layer changes needed.
 *   Ring colours are imported from constants/EmberStates.ts.
 *   Month navigation is local state only — does not affect any other component.
 */

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import type { HPSnapshot } from "@/types";
import { EmberStates } from "@/constants/EmberStates";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import type { EmberState } from "@/types";

// ~ ─────────────────────────────────────────────────────────────────
// ~ Helpers — plain JS date arithmetic (no date-fns in this project)
// ~ ─────────────────────────────────────────────────────────────────

/** Format a Date as "YYYY-MM-DD" to match HPSnapshot.date */
function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Format month header — e.g. "April 2026" */
function formatMonthYear(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/** Format detail card date — e.g. "April 15, 2026" */
function formatFullDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Return number of days in a month (0-indexed month) */
function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the day-of-week index for the 1st of the month.
 * Returns 0 = Monday … 6 = Sunday (Monday-start week).
 */
function startDayOfWeek(year: number, month: number): number {
  const jsDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  return jsDay === 0 ? 6 : jsDay - 1;
}

// ~ ─────────────────────────────────────────────────────────────────
// ~ Component
// ~ ─────────────────────────────────────────────────────────────────

type HistoryCalendarProps = {
  /** Array of daily HP snapshots — same shape as EvolutionLog used */
  history: HPSnapshot[];
};

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function HistoryCalendar({ history }: HistoryCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());

  const today = toDateString(new Date());

  // Build a lookup map: "YYYY-MM-DD" → HPSnapshot for O(1) access
  const snapshotMap = useMemo(() => {
    const map: Record<string, HPSnapshot> = {};
    for (const snap of history) {
      map[snap.date] = snap;
    }
    return map;
  }, [history]);

  // ~ Month navigation
  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();

  const isCurrentMonth =
    year === new Date().getFullYear() && month === new Date().getMonth();

  const goToPrevMonth = () => {
    setDisplayMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    // ! do not navigate into the future — disable next on current month
    if (!isCurrentMonth) {
      setDisplayMonth(new Date(year, month + 1, 1));
    }
  };

  // ~ Build the grid rows
  const totalDays = daysInMonth(year, month);
  const startOffset = startDayOfWeek(year, month);

  // Previous month's trailing days
  const prevMonthDays = daysInMonth(year, month - 1);
  const cells: { day: number; dateString: string; isCurrentMonth: boolean }[] = [];

  // Fill leading cells from previous month
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const pm = month === 0 ? 11 : month - 1;
    const py = month === 0 ? year - 1 : year;
    cells.push({
      day: d,
      dateString: toDateString(new Date(py, pm, d)),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    cells.push({
      day: d,
      dateString: toDateString(new Date(year, month, d)),
      isCurrentMonth: true,
    });
  }

  // Fill trailing cells to complete last row (up to 6 rows × 7 cols = 42)
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nm = month === 11 ? 0 : month + 1;
    const ny = month === 11 ? year + 1 : year;
    cells.push({
      day: d,
      dateString: toDateString(new Date(ny, nm, d)),
      isCurrentMonth: false,
    });
  }

  // Split into rows of 7
  const rows: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  // ~ Handle day tap — toggle selection
  const handleDayPress = (dateString: string) => {
    setSelectedDate((prev) => (prev === dateString ? null : dateString));
  };

  // ~ Detail card data
  const selectedSnapshot = selectedDate ? snapshotMap[selectedDate] : null;

  return (
    <View style={styles.container}>
      {/* ── Month header with prev/next chevrons ────────────────── */}
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={goToPrevMonth} style={styles.chevron}>
          <Text style={styles.chevronText}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.monthLabel}>{formatMonthYear(displayMonth)}</Text>

        <TouchableOpacity
          onPress={goToNextMonth}
          style={[styles.chevron, isCurrentMonth && styles.chevronDisabled]}
          disabled={isCurrentMonth}
        >
          <Text
            style={[
              styles.chevronText,
              isCurrentMonth && styles.chevronTextDisabled,
            ]}
          >
            {">"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Day-of-week header row ──────────────────────────────── */}
      <View style={styles.weekRow}>
        {DAY_LABELS.map((label, i) => (
          <View key={i} style={styles.weekCell}>
            <Text style={styles.weekLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* ── Calendar grid ───────────────────────────────────────── */}
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.weekRow}>
          {row.map((cell) => {
            const snapshot = snapshotMap[cell.dateString];
            const isToday = cell.dateString === today;
            // * ring colour derived from state — intentional, matches creature visual language
            const ringColor = snapshot
              ? EmberStates[snapshot.state].color
              : undefined;
            const isSelected = cell.dateString === selectedDate;

            return (
              <DayCell
                key={cell.dateString}
                day={cell.day}
                isCurrentMonth={cell.isCurrentMonth}
                isToday={isToday}
                isSelected={isSelected}
                ringColor={ringColor}
                onPress={() => handleDayPress(cell.dateString)}
              />
            );
          })}
        </View>
      ))}

      {/* ── Detail card — visible when selectedDate !== null ───── */}
      {selectedDate !== null && (
        <View style={styles.detailCard}>
          <Text style={styles.detailDate}>{formatFullDate(selectedDate)}</Text>
          {selectedSnapshot ? (
            <View style={styles.detailRow}>
              <View
                style={[
                  styles.detailDot,
                  { backgroundColor: EmberStates[selectedSnapshot.state].color },
                ]}
              />
              <Text style={styles.detailText}>
                {selectedSnapshot.state} — {selectedSnapshot.hp}% HP
              </Text>
            </View>
          ) : (
            <Text style={styles.detailTextMuted}>No data for this day</Text>
          )}
        </View>
      )}
    </View>
  );
}

// ~ ─────────────────────────────────────────────────────────────────
// ~ DayCell — inline sub-component (not a separate file)
// ~ ─────────────────────────────────────────────────────────────────

type DayCellProps = {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  ringColor: string | undefined;
  onPress: () => void;
};

function DayCell({
  day,
  isCurrentMonth,
  isToday,
  isSelected,
  ringColor,
  onPress,
}: DayCellProps) {
  // ^ today highlight only works correctly if device clock is accurate — acceptable for MVP
  return (
    <TouchableOpacity
      style={[styles.dayCell, !isCurrentMonth && styles.dayCellOutside]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View
        style={[
          styles.dayCircle,
          // Ring border for days with data (only in current month)
          isCurrentMonth && ringColor
            ? { borderColor: ringColor, borderWidth: 2 }
            : undefined,
          // Today gets a filled gold background
          isToday && styles.dayCircleToday,
          // Selected gets a subtle highlight
          isSelected && !isToday && styles.dayCircleSelected,
        ]}
      >
        <Text
          style={[
            styles.dayText,
            !isCurrentMonth && styles.dayTextOutside,
            isToday && styles.dayTextToday,
          ]}
        >
          {day}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ! do not add onLongPress or swipe gestures — out of MVP scope per ADR-001

// ~ ─────────────────────────────────────────────────────────────────
// ~ Styles
// ~ ─────────────────────────────────────────────────────────────────

const CELL_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    marginBottom: Spacing.md,
  },

  // ~ Month header
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  monthLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: Typography.semiBold,
  },
  chevron: {
    padding: Spacing.sm,
  },
  chevronText: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  chevronDisabled: {
    opacity: 0.3,
  },
  chevronTextDisabled: {
    color: Colors.textMuted,
  },

  // ~ Week header
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  weekCell: {
    width: CELL_SIZE,
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  weekLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    fontWeight: Typography.semiBold,
  },

  // ~ Day cells
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  dayCellOutside: {
    opacity: 0.3,
  },
  dayCircle: {
    width: CELL_SIZE - 4,
    height: CELL_SIZE - 4,
    borderRadius: (CELL_SIZE - 4) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleToday: {
    backgroundColor: EmberStates.Thriving.color,
  },
  dayCircleSelected: {
    backgroundColor: Colors.bgCardAlt,
  },
  dayText: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
  },
  dayTextOutside: {
    color: Colors.textMuted,
  },
  dayTextToday: {
    color: Colors.bgDeep,
    fontWeight: Typography.bold,
  },

  // ~ Detail card
  detailCard: {
    marginTop: Spacing.md,
    backgroundColor: Colors.bgCardAlt,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  detailDate: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: Typography.semiBold,
    marginBottom: Spacing.xs,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  detailDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  detailText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
  },
  detailTextMuted: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
  },
});
