/**
 * Ember — deepLinkEngine.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L9
 * Status: 🟢 COMPLETE
 * 
 * Notes: 
 *  - Handles navigation when a user taps an Ember notification
 *  - routeFromNotification() maps notification type → correct app route
 *  - setupNotificationResponseHandler() attaches the listener and returns
 *    a cleanup function — use this in a useEffect in _layout.tsx

 * Dependencies: 
 *  - expo-router: router 
 *  - expo-notifications: addNotificationResponseReceivedListener
 */

import { router } from "expo-router";
import * as Notifications from "expo-notifications";

type NotificationData = {
  type: "morning" | "spark" | "midnight";
};

/**
 * Maps a notification data payload to the correct app route.
 * Called internally by the response handler.
 *
 * @param data - The data object attached to the notification
 */
// ← JOSH: Kaley applied this fix pre-submission to clear tsc errors — trailing slash removed
function routeFromNotification(data: NotificationData): void {
  switch (data.type) {
    // Morning briefing → Home tab (Ember dashboard)
    case "morning":
      router.push("/(tabs)");
      break;
      // Daily Spark → Home tab (Spark card lives here)
    case "spark":
      router.push("/(tabs)");
      break;
      // Midnight Reckoning → Quest Board tab (user needs to see incomplete quests)
    case "midnight":
      router.push("/(tabs)/quests");
      break;
      // Unknown notification type — fall back to home
    default:
      router.push("/(tabs)");
  }
}

/**
 * Attaches a listener that fires when the user taps a notification.
 * Returns a cleanup function — call it in the useEffect cleanup to
 * prevent the listener from stacking up across re-renders.
 *
 * Usage in _layout.tsx:
 *   useEffect(() => {
 *     const cleanup = setupNotificationResponseHandler();
 *     return cleanup;
 *   }, []);
 */
export function setupNotificationResponseHandler(): () => void {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data as NotificationData;

      if (!data?.type) {
        console.warn("deepLinkEngine: notificaiton missing data.type", data);
        return;
      }

      routeFromNotification(data);
    }
  );

  return () => subscription.remove();
}