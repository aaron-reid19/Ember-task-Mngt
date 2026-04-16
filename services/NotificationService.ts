/**
 * Ember — Notification Service
 * Layer: Data
 * Owner: Aaron
 * Task IDs: D12
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - expo-notifications — installed — READY
 *
 * Notes:
 *   Sets up Android notification channels and requests OS-level permission.
 *   Actual scheduling lives in utils/notificationEngine.ts (Josh's L8).
 *   // ^ Android requires a channel before any notification can be posted
 *   // & see utils/notificationEngine.ts for scheduling logic
 */

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF8C42",
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
    const existing = await Notifications.getPermissionsAsync();
  
    if (existing.granted) {
      return true;
    }
  
    const requested = await Notifications.requestPermissionsAsync();
  
    return requested.granted;
  }