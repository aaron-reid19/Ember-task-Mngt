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

import { calculateStreak } from "./utils/streakEngine";
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

  // Calculate longest by checking all possible starting positions
  let longest = current;
  for (let start = 1; start < snapshots.length; start++) {
    let streak = 0;
    for (let i = start; i < snapshots.length; i++) {
      if (snapshots[i].hp === 0) break;
      streak++;
    }
    if (streak > longest) longest = streak;
  }

  return { current, longest, loading: false };
}
