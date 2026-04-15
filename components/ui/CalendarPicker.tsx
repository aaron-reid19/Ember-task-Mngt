/**
 * Ember — CalendarPicker
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U4
 * Status: 🟢 READY
 *
 * Notes:
 *   Custom month-grid date picker matching Figma calendar designs.
 *   Dark purple theme with amber/orange selected-day highlight.
 *   Used in Add Quest → Start Date section.
 */

import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

// ~ ─────────────────────────────────────────────────────────────────

interface CalendarPickerProps {
  selected: string | null; // ISO date string "YYYY-MM-DD" or null
  onSelect: (date: string) => void;
}

// ~ ─────────────────────────────────────────────────────────────────

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  // 0 = Sunday, convert to Monday-first (0 = Monday)
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function toISO(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function formatDisplayDate(iso: string): string {
  const date = new Date(iso + "T00:00:00");
  const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}

// ~ ─────────────────────────────────────────────────────────────────

export function CalendarPicker({ selected, onSelect }: CalendarPickerProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  // Previous month overflow days
  const prevMonthDays = getDaysInMonth(
    viewMonth === 0 ? viewYear - 1 : viewYear,
    viewMonth === 0 ? 11 : viewMonth - 1,
  );

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  // Build the 6-row grid of day cells
  const cells: { day: number; inMonth: boolean; iso: string }[] = [];

  // Leading days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ day: d, inMonth: false, iso: toISO(y, m, d) });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, iso: toISO(viewYear, viewMonth, d) });
  }

  // Trailing days from next month
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    const nm = viewMonth === 11 ? 0 : viewMonth + 1;
    const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, inMonth: false, iso: toISO(ny, nm, d) });
    }
  }

  // Split into rows of 7
  const rows: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <View style={styles.container}>
      {/* Month header with navigation arrows */}
      <View style={styles.header}>
        <Text style={styles.monthLabel}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </Text>
        <View style={styles.navButtons}>
          <Pressable onPress={goToPrevMonth} style={styles.navButton}>
            <Ionicons name="chevron-back" size={18} color={Colors.textSecondary} />
          </Pressable>
          <Pressable onPress={goToNextMonth} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Day-of-week header row */}
      <View style={styles.weekRow}>
        {DAY_LABELS.map((label, i) => (
          <View key={i} style={styles.dayCell}>
            <Text style={styles.weekDayLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      {rows.map((row, ri) => (
        <View key={ri} style={styles.weekRow}>
          {row.map((cell, ci) => {
            const isSelected = cell.iso === selected;
            const isToday = cell.iso === todayISO && cell.inMonth;

            return (
              <Pressable
                key={ci}
                style={styles.dayCell}
                onPress={() => onSelect(cell.iso)}
              >
                <View
                  style={[
                    styles.dayCircle,
                    isSelected && styles.dayCircleSelected,
                    isToday && !isSelected && styles.dayCircleToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      !cell.inMonth && styles.dayTextMuted,
                      isSelected && styles.dayTextSelected,
                      isToday && !isSelected && styles.dayTextToday,
                    ]}
                  >
                    {cell.day}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}

      {/* Selected date display */}
      {selected && (
        <Text style={styles.selectedLabel}>
          {formatDisplayDate(selected)}
        </Text>
      )}
    </View>
  );
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: Spacing.card,
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  navButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  navButton: {
    padding: Spacing.xs,
  },
  weekRow: {
    flexDirection: "row",
  },
  weekDayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
    textAlign: "center",
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleSelected: {
    backgroundColor: Colors.accent,
  },
  dayCircleToday: {
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  dayText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  dayTextMuted: {
    color: Colors.textMuted,
  },
  dayTextSelected: {
    color: Colors.bgDeep,
    fontWeight: "bold",
  },
  dayTextToday: {
    color: Colors.accent,
    fontWeight: "600",
  },
  selectedLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});
