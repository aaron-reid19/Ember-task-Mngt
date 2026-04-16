/**
 * Ember — notificationEngine.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L8
 * Status: 🟢 COMPLETE
 * 
 * Notes: 
 *  - Schedules the three Ember notification types using expo-notifications
 *  - Does NOT handle permissions — that's Aaron's NotificationService (D12)
 *  - Does NOT handle Android channels — that's Aaron's NotificationService (D11)
 *  - This engine assumes permission has already been granted before being called
 *  - All three notifications use a DAILY trigger — they repeat every day
 *  - Call cancelAllEmberNotifications() before rescheduling to avoid duplicates
 * 
 * Dependencies: 
 *  - expo-notifications
 */

import * as Notifications from "expo-notifications";

/** 
 * Schedules the Morning Briefing Notification @ 8AM every day
 * 
 * @param hp - The user's current HP (0-100)
 * @param carryOverCount - Number of incomplete quests carried over from yesterday
 */

export async function scheduleMorningBriefing(
  hp: number,
  carryOverCount: number
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Good Morning! 🔥",
      body:
        carryOverCount > 0
          ? `Your HP is ${hp}. You have ${carryOverCount} quests carried over from yesterday.`
          : `Your HP is ${hp}. It's a new day, let's keep the flame alive!`,
      data: { type: "morning" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
}

/**
 * Schedules the Daily Spark notification.
 * Fires at a randomized hour between 11:00 and 13:00 — nudges the user
 * to complete their Daily Spark quest.
 *
 * @param spark - The name of today's Daily Spark quest
 */
export async function scheduleDailySpark(spark: string): Promise<void> {
  // Pick a random hour between 11 and 13 inclusive so it doesn't feel robotic
  const hour = Math.floor(Math.random() * 3) + 11;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Your Daily Spark ⚡",
      body: `Don't forget: "${spark}" - complete it for bonus HP!`,
      data: { type: "spark" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: 0,
    },
  });
}

/**
 * Schedules the Midnight Reckoning notification.
 * Fires every day at 20:00 — warns the user how many quests are still incomplete.
 *
 * @param incompleteCount - Number of quests not yet completed today
 */
export async function scheduleMidnightReckoning(
  incompleteCount: number
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Midnight Reckoning 🌙",
      body:
        incompleteCount > 0
          ? `${incompleteCount} quests still incomplete. Ember's flame is fading...`
          : "All quests complete! Ember will burn bright tonight. 🔥",
      data: { type: "midnight" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

/**
 * Cancels all scheduled Ember notifications.
 * Call this before rescheduling to prevent duplicate notifications
 * stacking up across app launches.
 */
export async function cancelAllEmberNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}