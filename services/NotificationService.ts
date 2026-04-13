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