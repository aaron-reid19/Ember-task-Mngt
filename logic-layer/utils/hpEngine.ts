/**
 * Ember — hpEngine.ts
 * Layer: Logic
 * Owner: Josh
 * Task IDs: L1
 * Status: 🟠 IN PROGRESS
 * 
 * Dependencies: None
 * Notes: Calculates the HP of the Ember Character. Takes completedTasks & 
 *  dailyGoal as parameters and returns a calculated value. Formula for the HP
 *  value is (completedTasks / dailyGoal) * 100
 */

export function calculateHP(completedTasks: number, dailyGoal: number): number {
  // ^ Checks that dailyGoal is not 0, to avoid dividing by 0 and causing catastrophic failure
  if (dailyGoal <= 0) {
    return 0;
  } 
  return (completedTasks / dailyGoal) * 100;
}