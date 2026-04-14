/**
 * Ember — useHPHistory.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L6
 * Status: 🟢 COMPLETE
 *
 * Notes:
 *  - Reads the full HP history from Firestore hpHistory subcollection
 *  - Re-derives state from hp via classifyHP so we are always consistent
 *    with current threshold definitions, regardless of what was persisted
 *
 * Dependencies:
 *  - Kaley's branch: HPSnapshot type from @/types/ember — Kaley — MERGED ✓
 *  - Aaron's D9: saveDailyHPSnapshot writes to users/{uid}/hpHistory/{dateKey} — MERGED ✓
 */

import { useState, useEffect } from "react";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/firebase/config";
import { HPSnapshot } from "@/types/ember";
import { useAuth } from "@/context/authContext";
import { classifyHP } from "../utils/hpEngine";

function mapSnapshot(docSnap: QueryDocumentSnapshot<DocumentData>): HPSnapshot {
  const d = docSnap.data();
  const hp = typeof d.hp === "number" ? d.hp : 0;
  return {
    date: d.date ?? docSnap.id,
    hp,
    // Re-derive state from hp so it always matches current thresholds
    state: classifyHP(hp),
  };
}

export function useHPHistory(): HPSnapshot[] {
  const { user } = useAuth();
  const [snapshots, setSnapshots] = useState<HPSnapshot[]>([]);

  useEffect(() => {
    if (!user) return;

    async function loadHistory() {
      const historyRef = collection(db, "users", user!.uid, "hpHistory");
      const snapshot = await getDocs(historyRef);
      setSnapshots(snapshot.docs.map(mapSnapshot));
    }

    loadHistory().catch(console.error);
  }, [user]);

  return snapshots;
}
