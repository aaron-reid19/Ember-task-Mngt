/**
 * Ember — useStreak.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L6
 * Status: 🟢 READY
 *
 * Notes:
 *  - Returns streak data — both the current streak and the longest streak
 *  - Uses real HP snapshot data from useHPHistory
 *
 * Dependencies:
 *  - useHPHistory for HP snapshot data
 *  - streakEngine.calculateStreak for streak calculation
 */

import { calculateStreak, calculateLongestStreak } from "@/utils/streakEngine";
import { useHPHistory } from "./useHPHistory";

type StreakData = {
  current: number;
  longest: number;
  loading: boolean;
};

export function useStreak(): StreakData {
  const { snapshots, loading } = useHPHistory();

  if (loading) {
    return { current: 0, longest: 0, loading: true };
  }

  const current = calculateStreak(snapshots);
  const longest = calculateLongestStreak(snapshots);

  return { current, longest, loading: false };
}
