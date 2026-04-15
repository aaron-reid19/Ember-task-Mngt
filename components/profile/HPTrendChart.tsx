/**
 * Ember — HP Trend Chart Component
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U8
 * Status: 🟢 READY
 *
 * Notes:
 *   Line chart showing HP over time with Week/Month toggle.
 *   Line segments are color-coded by Ember state thresholds.
 *   Includes back/forward arrows to navigate through historical periods.
 */

import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, LayoutChangeEvent } from "react-native";
import Svg, { Circle, Line, Rect, Text as SvgText } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import type { HPSnapshot } from "@/types";
import { EmberStates } from "@/constants/EmberStates";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type HPTrendChartProps = {
  snapshots: HPSnapshot[];
};

type ChartRange = "weekly" | "monthly";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_WEEK_LABELS = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"];

/** Get the color for an HP value based on Ember state thresholds */
function getHPColor(hp: number): string {
  if (hp >= EmberStates.Thriving.hpMin) return EmberStates.Thriving.color;
  if (hp >= EmberStates.Steady.hpMin) return EmberStates.Steady.color;
  if (hp >= EmberStates.Strained.hpMin) return EmberStates.Strained.color;
  return EmberStates.Flickering.color;
}

/** Get the Monday of the week containing a given date */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Get the first day of the month containing a given date */
function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Format a date range label */
function formatPeriodLabel(start: Date, range: ChartRange): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (range === "weekly") {
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}`;
  }
  return start.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function isCurrentPeriod(periodStart: Date, range: ChartRange): boolean {
  const now = new Date();
  if (range === "weekly") {
    return periodStart.getTime() === getWeekStart(now).getTime();
  }
  return periodStart.getTime() === getMonthStart(now).getTime();
}

export function HPTrendChart({ snapshots }: HPTrendChartProps) {
  const [activeRange, setActiveRange] = useState<ChartRange>("weekly");
  const [offset, setOffset] = useState(0);
  const [chartWidth, setChartWidth] = useState(280);

  const CHART_HEIGHT = 160;
  const PADDING_X = 16;
  const PADDING_TOP = 20;
  const PADDING_BOTTOM = 28;

  function handleRangeChange(range: ChartRange) {
    setActiveRange(range);
    setOffset(0);
  }

  const periodStart = useMemo(() => {
    const now = new Date();
    if (activeRange === "weekly") {
      const start = getWeekStart(now);
      start.setDate(start.getDate() - offset * 7);
      return start;
    }
    const start = getMonthStart(now);
    start.setMonth(start.getMonth() - offset);
    return start;
  }, [activeRange, offset]);

  const { dataPoints, labels } = useMemo(() => {
    if (activeRange === "weekly") {
      const buckets: (number | null)[] = Array(7).fill(null);
      for (const snap of snapshots) {
        const d = new Date(snap.date);
        const weekStart = getWeekStart(d);
        if (weekStart.getTime() === periodStart.getTime()) {
          const dayIndex = (d.getDay() + 6) % 7;
          buckets[dayIndex] = snap.hp;
        }
      }
      return { dataPoints: buckets, labels: DAY_LABELS };
    }
    const buckets: (number | null)[] = Array(4).fill(null);
    const counts = Array(4).fill(0);
    const sums = Array(4).fill(0);
    for (const snap of snapshots) {
      const d = new Date(snap.date);
      if (
        d.getFullYear() === periodStart.getFullYear() &&
        d.getMonth() === periodStart.getMonth()
      ) {
        const weekIndex = Math.min(3, Math.floor((d.getDate() - 1) / 7));
        sums[weekIndex] += snap.hp;
        counts[weekIndex]++;
      }
    }
    for (let i = 0; i < 4; i++) {
      if (counts[i] > 0) buckets[i] = Math.round(sums[i] / counts[i]);
    }
    return { dataPoints: buckets, labels: MONTH_WEEK_LABELS };
  }, [snapshots, periodStart, activeRange]);

  const hasData = dataPoints.some((d) => d !== null);
  const isCurrent = isCurrentPeriod(periodStart, activeRange);

  const drawableWidth = chartWidth - PADDING_X * 2;
  const drawableHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  // Build points with coordinates and colors
  const points = dataPoints
    .map((val, i) => {
      if (val === null) return null;
      const x = PADDING_X + (i / (dataPoints.length - 1)) * drawableWidth;
      const y = PADDING_TOP + drawableHeight - (val / 100) * drawableHeight;
      return { x, y, val, color: getHPColor(val) };
    })
    .filter(Boolean) as { x: number; y: number; val: number; color: string }[];

  // Build colored line segments between consecutive points
  const segments: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const avgHP = (points[i].val + points[i + 1].val) / 2;
    segments.push({
      x1: points[i].x,
      y1: points[i].y,
      x2: points[i + 1].x,
      y2: points[i + 1].y,
      color: getHPColor(avgHP),
    });
  }

  // State zone bands for background
  const zones = [
    { min: 80, max: 100, color: EmberStates.Thriving.color, label: "Thriving" },
    { min: 50, max: 79, color: EmberStates.Steady.color, label: "Steady" },
    { min: 20, max: 49, color: EmberStates.Strained.color, label: "Strained" },
    { min: 0, max: 19, color: EmberStates.Flickering.color, label: "Flickering" },
  ];

  function handleLayout(e: LayoutChangeEvent) {
    setChartWidth(e.nativeEvent.layout.width);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>HP Trend</Text>
        <View style={styles.toggleGroup}>
          <Pressable
            onPress={() => handleRangeChange("weekly")}
            style={[styles.toggleButton, activeRange === "weekly" && styles.toggleButtonActive]}
          >
            <Text style={[styles.toggleLabel, activeRange === "weekly" && styles.toggleLabelActive]}>
              Weekly
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleRangeChange("monthly")}
            style={[styles.toggleButton, activeRange === "monthly" && styles.toggleButtonActive]}
          >
            <Text style={[styles.toggleLabel, activeRange === "monthly" && styles.toggleLabelActive]}>
              Monthly
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Period navigation */}
      <View style={styles.navRow}>
        <Pressable onPress={() => setOffset((o) => o + 1)} hitSlop={12}>
          <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
        </Pressable>
        <Text style={styles.periodLabel}>{formatPeriodLabel(periodStart, activeRange)}</Text>
        <Pressable
          onPress={() => setOffset((o) => Math.max(0, o - 1))}
          hitSlop={12}
          disabled={isCurrent}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isCurrent ? Colors.textMuted : Colors.textSecondary}
          />
        </Pressable>
      </View>

      {/* Chart */}
      <View style={styles.chartArea} onLayout={handleLayout}>
        {!hasData ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No data for this period</Text>
          </View>
        ) : (
          <Svg width={chartWidth} height={CHART_HEIGHT}>
            {/* Background zone bands */}
            {zones.map((zone) => {
              const yTop = PADDING_TOP + drawableHeight - (zone.max / 100) * drawableHeight;
              const yBot = PADDING_TOP + drawableHeight - (zone.min / 100) * drawableHeight;
              return (
                <React.Fragment key={zone.label}>
                  <Rect
                    x={PADDING_X}
                    y={yTop}
                    width={drawableWidth}
                    height={yBot - yTop}
                    fill={zone.color}
                    opacity={0.08}
                  />
                  <SvgText
                    x={chartWidth - PADDING_X - 2}
                    y={yTop + (yBot - yTop) / 2 + 3}
                    fontSize={8}
                    fill={zone.color}
                    opacity={0.5}
                    textAnchor="end"
                  >
                    {zone.label}
                  </SvgText>
                </React.Fragment>
              );
            })}

            {/* Colored line segments */}
            {segments.map((seg, i) => (
              <Line
                key={i}
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke={seg.color}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            ))}

            {/* Data points with state-colored dots */}
            {points.map((p, i) => (
              <Circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={5}
                fill={p.color}
                stroke={Colors.bgDeep}
                strokeWidth={2}
              />
            ))}

            {/* X-axis labels */}
            {labels.map((label, i) => {
              const x = PADDING_X + (i / (labels.length - 1)) * drawableWidth;
              const isActive = dataPoints[i] !== null;
              return (
                <SvgText
                  key={i}
                  x={x}
                  y={CHART_HEIGHT - 6}
                  fontSize={10}
                  fill={isActive ? Colors.textPrimary : Colors.textMuted}
                  textAnchor="middle"
                  fontWeight={isActive ? "600" : "400"}
                >
                  {label}
                </SvgText>
              );
            })}
          </Svg>
        )}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {zones.map((zone) => (
          <View key={zone.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: zone.color }]} />
            <Text style={styles.legendLabel}>{zone.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.semiBold,
  },
  toggleGroup: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  toggleButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.bgCardAlt,
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
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  periodLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  chartArea: {
    height: 160,
    borderRadius: 12,
    backgroundColor: Colors.bgDeep,
    overflow: "hidden",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
});
