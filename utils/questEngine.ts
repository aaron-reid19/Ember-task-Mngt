/**
 * Ember — questEngine.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L7
 * Status: 🟢 COMPLETE
 * 
 * Notes: 
 *  - Determines if a Quest should be rendered based on the quest.cadence
 *    Quests can be scheduled daily, weekly, biweekly, monthly, or custom
 * 
 * Dependencies: 
 *  - Kaley's branch: Quest type from @/types/quest — Kaley — PENDING MERGE
 *  - Kaley's branch: WeekDay type from @/types/quest — Kaley — PENDING MERGE
 */

import { Quest, WeekDay } from "@/types/quest";

export function isQuestDueToday( quest: Quest, today: Date ): boolean {
  const dayMap: Record<number, WeekDay> = {
    0: "Su",
    1: "M",
    2: "T",
    3: "W",
    4: "Th",
    5: "F",
    6: "S"
  };

  switch (quest.cadence) {
    case "Daily":
      return true;
    case "Weekly": {
      const todayWeekDay = dayMap[today.getDay()];
      return quest.activeDays?.includes(todayWeekDay) ?? false;
    }
    case "Biweekly": {
      const start = new Date(quest.startDate!);
      const diffInMs = today.getTime() - start.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      return diffInDays % 14 === 0;
    }
    case "Custom": 
    case "Monthly": {
      const todayDate = today.getDate();
      const startDate = new Date(quest.startDate!).getDate();
      return todayDate === startDate;
    }
    default:
      return false;
  }
}