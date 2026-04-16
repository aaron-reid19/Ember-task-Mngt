/**
 * Ember — HP Trend Chart Component
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U8
 * Status: 🟢 READY
 *
 * Notes:
 *   Clean single-line HP trend chart with Week/Month toggle.
 *   Smooth amber line over deep background, gradient area fill,
 *   single endpoint marker on the most recent data point.
 */

import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, LayoutChangeEvent } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import type { HPSnapshot } from "@/types";
import { EmberStates } from "@/constants/EmberStates";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

export type ChartRange = "weekly" | "monthly";

type HPTrendChartProps = {
  snapshots: HPSnapshot[];
  activeRange: ChartRange;
  onRangeChange: (range: ChartRange) => void;
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_WEEK_LABELS = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"];

const CHART_HEIGHT = 180;
const PADDING_LEFT = 16;
const PADDING_RIGHT = 16;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 28;

const LINE_COLOR = EmberStates.Thriving.color;

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

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

/** Build a smoothed SVG path through the given points using Catmull-Rom → Bezier. */
function buildSmoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function HPTrendChart({ snapshots, activeRange, onRangeChange }: HPTrendChartProps) {
  const [offset, setOffset] = useState(0);
  const [chartWidth, setChartWidth] = useState(280);

  function handleRangeChange(range: ChartRange) {
    onRangeChange(range);
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
  const activeIndex = dataPoints.reduce(
    (last, val, i) => (val !== null ? i : last),
    -1,
  );

  const drawableWidth = chartWidth - PADDING_LEFT - PADDING_RIGHT;
  const drawableHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const points = dataPoints
    .map((val, i) => {
      if (val === null) return null;
      const x = PADDING_LEFT + (i / (dataPoints.length - 1)) * drawableWidth;
      const y = PADDING_TOP + drawableHeight - (val / 100) * drawableHeight;
      return { x, y, val };
    })
    .filter(Boolean) as { x: number; y: number; val: number }[];

  const linePath = buildSmoothPath(points);
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${PADDING_TOP + drawableHeight} L ${points[0].x} ${PADDING_TOP + drawableHeight} Z`
      : "";

  const endPoint = points[points.length - 1];

  function handleLayout(e: LayoutChangeEvent) {
    setChartWidth(e.nativeEvent.layout.width);
  }

  return (
    <View style={styles.container}>
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
            <Defs>
              <LinearGradient id="hpAreaFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={LINE_COLOR} stopOpacity={0.35} />
                <Stop offset="1" stopColor={LINE_COLOR} stopOpacity={0} />
              </LinearGradient>
            </Defs>

            {/* Area gradient under line */}
            {areaPath !== "" && <Path d={areaPath} fill="url(#hpAreaFill)" />}

            {/* Smooth line */}
            <Path
              d={linePath}
              stroke={LINE_COLOR}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Active endpoint marker */}
            {endPoint && (
              <>
                <Circle cx={endPoint.x} cy={endPoint.y} r={6} fill={LINE_COLOR} />
                <Circle
                  cx={endPoint.x}
                  cy={endPoint.y}
                  r={3}
                  fill={Colors.bgDeep}
                />
              </>
            )}

            {/* X-axis labels */}
            {labels.map((label, i) => {
              const x = PADDING_LEFT + (i / (labels.length - 1)) * drawableWidth;
              const isActive = i === activeIndex;
              return (
                <SvgText
                  key={i}
                  x={x}
                  y={CHART_HEIGHT - 8}
                  fontSize={Typography.caption}
                  fill={isActive ? Colors.accent : Colors.textMuted}
                  textAnchor="middle"
                  fontWeight={Typography.regular}
                >
                  {label}
                </SvgText>
              );
            })}
          </Svg>
        )}
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
  toggleRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
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
    height: CHART_HEIGHT,
    borderRadius: Spacing.md,
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
});
