/**
 * Ember — useNotificationSetup.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L8
 * Status: 🟢 READY
 *
 * Notes:
 *  - Wraps Android channel setup + OS permission request behind a hook so the
 *    UI layer (app/_layout.tsx) never imports services/NotificationService directly
 *  - Returns `permissionGranted` — screens/layouts use this to show a banner
 *    prompting the user to re-enable notifications when denied
 *
 * Dependencies:
 *  - NotificationService for the raw channel + permission calls
 */

import { useEffect, useState } from "react";
import {
  setupNotificationChannels,
  requestNotificationPermission,
} from "@/services/NotificationService";

export function useNotificationSetup(): { permissionGranted: boolean | null } {
  // null = not yet resolved, true = granted, false = denied
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    setupNotificationChannels();
    requestNotificationPermission().then(setPermissionGranted);
  }, []);

  return { permissionGranted };
}
