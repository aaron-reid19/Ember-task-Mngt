/**
 * Ember — useStreak.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L6
 * Status: 🟢 COMPLETE
 * 
 * Notes: 
 *  - Derives current and longest streak from real HP history
 *  - UseHPHistory handles all Firestore fetching
 * 
 * Dependencies: 
 *  - useHPHistory (local hook)
 *  - calculateStreak, calculateLongestStreak from streakEngine
 */

import { useState, useEffect } from "react";
import { useHPHistory } from "./useHPHistory";
import { calculateStreak, calculateLongestStreak } from "../utils/streakEngine";

type StreakData = {
  current: number
  longest: number
}

export function useStreak(): StreakData {
  
  const [streakData, setStreakData] = useState<StreakData>({
    current: 0, 
    longest: 0,
  });

  // Pull the real HP history array from Firestore (via useHPHistory)
  const history = useHPHistory();

  useEffect(() => {
    if (history.length === 0) return;

    const current = calculateStreak(history);
    const longest = calculateLongestStreak(history);

    setStreakData({ current, longest });
  }, [history]); 

  return streakData;    
}