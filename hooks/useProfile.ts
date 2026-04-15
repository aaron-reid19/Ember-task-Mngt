/**
 * Ember — useProfile.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L1
 * Status: 🟢 READY
 *
 * Notes:
 *  - Provides user profile mutations (e.g. marking onboarding complete)
 *  - Screens call this hook instead of importing FirestoreServices directly
 *
 * Dependencies:
 *  - AuthContext for current user ID
 *  - FirestoreServices.updateUserProfile for writes
 */

import { useCallback } from "react";
import { useAuth } from "@/store/authContext";
import { updateUserProfile } from "@/services/FirestoreServices";

export function useProfile(): {
  completeOnboarding: () => Promise<void>;
} {
  const { user } = useAuth();

  const completeOnboarding = useCallback(async () => {
    if (!user) return;
    await updateUserProfile(user.uid, { onboardingComplete: true });
  }, [user]);

  return { completeOnboarding };
}
