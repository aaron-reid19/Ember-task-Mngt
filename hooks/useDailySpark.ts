/**
 * Ember — useDailySpark.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L4
 * Status: 🟢 READY
 *
 * Notes:
 *  - Returns a single quest that has been randomly selected as the Daily Spark
 *  - Uses real quest data from Firestore via useQuests
 *
 * Dependencies:
 *  - useQuests hook for real quest list
 *  - sparkEngine.selectDailySpark for selection logic
 */

import { Quest } from "@/types";
import { useQuests } from "./useQuests";
import { selectDailySpark } from "@/utils/sparkEngine";

export function useDailySpark(externalQuests?: Quest[]): { spark: Quest | null; loading: boolean } {
  const { quests: internalQuests, loading: internalLoading } = useQuests();
  const quests = externalQuests ?? internalQuests;
  const loading = externalQuests ? false : internalLoading;

  if (loading) {
    return { spark: null, loading: true };
  }

  // Check if any quest is already marked as daily spark
  const existingSpark = quests.find((q) => q.isDailySpark);
  if (existingSpark) {
    return { spark: existingSpark, loading: false };
  }

  // Otherwise, randomly select one from incomplete quests
  const spark = selectDailySpark(quests);
  return { spark, loading: false };
}
