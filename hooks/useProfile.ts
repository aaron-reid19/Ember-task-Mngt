/**
 * Ember — useProfile.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L1
 * Status: 🟢 READY
 *
 * Notes:
 *  - Provides user profile reads + mutations for the Profile screen
 *  - Screens call this hook instead of importing FirestoreServices / AsyncStorageService directly
 *
 * Dependencies:
 *  - AuthContext for current user ID
 *  - FirestoreServices.updateUserProfile for profile writes
 *  - AsyncStorageService.getDailyGoal / setDailyGoal for local goal persistence
 */

import { useCallback, useEffect, useState } from "react";
import { updateProfile as updateFirebaseProfile } from "firebase/auth";
import { useAuth } from "@/store/authContext";
import { updateUserProfile } from "@/services/FirestoreServices";
import { AsyncStorageService } from "@/services/AsyncStorageService";

export function useProfile(): {
  dailyGoal: number;
  setDailyGoalLocal: (goal: number) => void;
  completeOnboarding: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  saveDailyGoal: (goal: number) => Promise<void>;
} {
  const { user } = useAuth();
  const [dailyGoal, setDailyGoalLocal] = useState(5);

  useEffect(() => {
    AsyncStorageService.getDailyGoal().then(setDailyGoalLocal);
  }, []);

  const completeOnboarding = useCallback(async () => {
    if (!user) return;
    await updateUserProfile(user.uid, { onboardingComplete: true });
  }, [user]);

  const updateDisplayName = useCallback(async (name: string) => {
    if (!user) return;
    await updateFirebaseProfile(user, { displayName: name });
    await updateUserProfile(user.uid, { displayName: name });
  }, [user]);

  const saveDailyGoal = useCallback(async (goal: number) => {
    await AsyncStorageService.setDailyGoal(goal);
    setDailyGoalLocal(goal);
  }, []);

  return {
    dailyGoal,
    setDailyGoalLocal,
    completeOnboarding,
    updateDisplayName,
    saveDailyGoal,
  };
}
