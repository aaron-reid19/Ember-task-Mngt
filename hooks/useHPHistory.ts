/**
 * Ember — useHPHistory.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L6
 * Status: 🟢 READY
 *
 * Notes:
 *  - Returns HP over time from Firestore hpSnapshots collection
 *
 * Dependencies:
 *  - AuthContext for current user ID
 *  - FirestoreServices.getHPSnapshots for snapshot data
 */

import { useState, useEffect } from "react";
import { HPSnapshot } from "@/types";
import { useAuth } from "@/store/authContext";
import { getHPSnapshots } from "@/services/FirestoreServices";

export function useHPHistory(): { snapshots: HPSnapshot[]; loading: boolean } {
  const { user } = useAuth();
  const [snapshots, setSnapshots] = useState<HPSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSnapshots([]);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const raw = await getHPSnapshots(user.uid);
        const mapped: HPSnapshot[] = raw.map((doc: any) => ({
          date: doc.date ?? doc.createdAt?.toDate?.()?.toISOString?.() ?? "",
          hp: doc.hp ?? 0,
          state: doc.visualState ?? doc.state ?? "Flickering",
        }));
        // Sort newest first
        mapped.sort((a, b) => b.date.localeCompare(a.date));
        setSnapshots(mapped);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return { snapshots, loading };
}
