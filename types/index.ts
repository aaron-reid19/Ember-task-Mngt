/**
 * Ember — Types barrel export
 * Layer: UI
 * Owner: Kaley
 * Task IDs: Wave 1 foundation
 * Status: 🟢 READY
 *
 * Notes:
 *   Import all types from here: import { Task } from '@/types'
 *   Never import directly from the individual type files — use this barrel.
 */

export type { EmberState, HPData, HPSnapshot } from "./ember";
export type { Task, TaskPriority, TaskTag } from "./task";
export { CADENCE_LABELS } from "./quest";
export type { Quest, QuestCadence, WeekDay } from "./quest";
