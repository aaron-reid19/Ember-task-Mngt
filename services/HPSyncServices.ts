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