/**
 * Ember — Global App Store
 * Layer: Data
 * Owner: Aaron
 * Task IDs: D3, D6
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - AuthContext for current user ID
 *   - FirestoreServices.getUserProfile for profile data
 *
 * Notes:
 *   Provides onboarding status and loading state.
 *   HP is calculated in useEmber() from quest hpCost values — not stored here.
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/store/authContext";
import { getUserProfile } from "@/services/FirestoreServices";

type AppStoreData = {
  currentHP: number;
  onboardingComplete: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
};

export function useAppStore(): AppStoreData {
  const { user } = useAuth();
  const [currentHP, setCurrentHP] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setCurrentHP((profile as any).currentHP ?? 0);
        setOnboardingComplete((profile as any).onboardingComplete === true);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    currentHP,
    onboardingComplete,
    loading,
    refresh: fetchProfile,
  };
}
