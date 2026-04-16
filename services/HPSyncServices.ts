/**
 * Ember — HP Sync Service
 * Layer: Data
 * Owner: Aaron
 * Task IDs: D3, D4, D9
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - AsyncStorageService: local HP cache — Aaron — READY
 *   - FirestoreServices.saveHPStateToFirestore / saveDailyHPSnapshot — Aaron — READY
 *
 * Notes:
 *   Write-through cache: every HP change lands in AsyncStorage first (so the UI
 *   survives offline), then is mirrored to Firestore when the network is up.
 *   Returns a structured result so callers can tell local vs. cloud success apart.
 *   // * local-first order matters — do not flip these calls
 *   // ^ a failed cloud sync is not fatal; surfaced via HPSyncResult.error
 */

import { AsyncStorageService } from "@/services/AsyncStorageService";
import { saveHPStateToFirestore, saveDailyHPSnapshot } from "@/services/FirestoreServices";
import type { LocalEmberData } from "@/types/ember";


export interface HPSyncResult {
  localSaved: boolean;
  cloudSynced: boolean;
  error?: string;
}

export const HPSyncService = {
  async saveHPState(userId: string, data: LocalEmberData): Promise<HPSyncResult> {
    try {
      await AsyncStorageService.setLocalEmberData(data);
    } catch (error) {
      return {
        localSaved: false,
        cloudSynced: false,
        error: error instanceof Error ? error.message : "Failed local save",
      };
    }

    try {
      await saveHPStateToFirestore(userId, data);
      await saveDailyHPSnapshot(userId,data);

      return {
        localSaved: true,
        cloudSynced: true,
      };
    } catch (error) {
      console.error("Firestore sync failed:", error);

      return {
        localSaved: true,
        cloudSynced: false,
        error: error instanceof Error ? error.message : "Failed cloud sync",
      };
    }
  },
};