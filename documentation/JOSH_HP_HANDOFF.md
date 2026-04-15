# Josh — HP Formula Change Handoff

**Author:** Kaley (via branch-kaley)
**Date:** 2026-04-12

---

## TL;DR

The HP formula has changed. Instead of counting completed tasks against a daily goal, HP is now driven by the **hpCost values on each task**. Your files `hpEngine.ts` and `useEmber.ts` have been updated. `classifyHP()` and `checkBonfire()` are untouched.

---

## What Changed and Why

### Old formula
```
HP = (number of completed tasks / dailyGoal) × 100
```
- `dailyGoal` was set once during onboarding (e.g. 5)
- Every task was worth the same HP regardless of its `hpCost`
- Adding a 30 HP task and a 5 HP task had identical impact on Ember

### New formula
```
HP = (sum of completed task hpCosts / sum of all task hpCosts) × 100
```
- HP is weighted by per-task `hpCost` values
- A 30 HP task moves the needle more than a 5 HP task
- Adding new tasks lowers HP (denominator grows), completing them raises it
- No tasks on the board = 100 HP (Ember starts happy)

### Why the change
The old formula ignored `hpCost` entirely — the field existed on every task but was decorative. Now HP reflects the actual weight of what's been done vs what's left, which is the core loop the app is built around.

---

## Files Modified

### `hooks/utils/hpEngine.ts` (your file)

| Function | Change |
|----------|--------|
| `calculateHP()` | **Signature changed:** `(completedTasks, dailyGoal)` → `(completedHP, totalHP)`. Now divides sum of completed hpCosts by sum of all hpCosts. Returns 100 when `totalHP <= 0` (no tasks). |
| `calculateTaskHP()` | **Removed.** Was `(1 / dailyGoal) * 100`. No longer needed — each task's hpCost is its own value. |
| `classifyHP()` | **No change.** Same thresholds, same EmberState mapping. |
| `checkBonfire()` | **No change.** Still `hp === 100 && isDailySparkComplete`. |

### `hooks/useEmber.ts` (your file)

| What | Change |
|------|--------|
| Data source | No longer reads `dailyGoal` from `useAppStore()`. Still reads `tasks` from `useTasks()`. |
| Calculation | Sums `task.hpCost` across all tasks (`totalHP`) and completed tasks (`completedHP`), passes both to `calculateHP()`. |
| Return type | **Unchanged.** Still returns `{ hp, state, isBonfire, loading }`. Every consumer works as-is. |

### Files you did NOT write (updated for consistency)

| File | What changed |
|------|-------------|
| `app/(tabs)/index.tsx` | "Today's Progress" now shows `{completedHP} of {totalHP} HP` instead of `{completedCount} of {dailyGoal} Complete`. Progress bar uses hpCost sums. Removed `useAppStore` import (no longer needed here). |
| `app/(tabs)/profile.tsx` | "Sets your HP denominator" label → "Your personal daily target". The goal config stepper is still there — `dailyGoal` is now a personal target, not the HP denominator. |
| `app/(onboarding)/goal-setup.tsx` | Updated header comment to reflect that dailyGoal is a personal target, not the HP formula input. |
| `README.md` | Formula updated in intro section and L1 task description. |
| `documentation/KALEY_HANDOFF.md` | HP Formula line updated. |

---

## What's Preserved

- **`classifyHP()`** — Identical. Same thresholds from `EmberStates.ts`.
- **`checkBonfire()`** — Identical. Same `BONFIRE_HP_THRESHOLD` check.
- **`useEmber()` return shape** — `{ hp, state, isBonfire, loading }` is unchanged. All screens that call `useEmber()` required zero changes.
- **`useTasks()`** — Untouched. Already maps `hpCost` from Firestore.
- **Task type** — `Task.hpCost` was already defined and populated. No type changes.
- **EmberStates thresholds** — Untouched. Thriving 80-100, Steady 50-79, Strained 20-49, Flickering 0-19.

---

## Edge Cases to Be Aware Of

| Scenario | Behavior |
|----------|----------|
| No tasks exist | `totalHP = 0` → returns 100 HP (Ember is happy, nothing to do) |
| All tasks completed | `completedHP === totalHP` → returns 100 HP (Bonfire eligible) |
| Task with `hpCost: 0` | Doesn't affect HP ratio (adds 0 to both sums) |
| Single large task (e.g. 50 HP) incomplete | HP drops significantly — by design, heavy tasks have heavy impact |
| `hpCost` is undefined/null on a task | Guarded with `?? 0` in `useEmber.ts` — treated as 0 |

---

## `dailyGoal` — Removed

`dailyGoal` has been fully stripped from the codebase. It was orphaned after the formula change (nothing read it), so it's been removed from:

- Onboarding screen (no longer asks for a goal — just a welcome + "Let's Go")
- Profile screen (goal config card removed)
- `useAppStore` (no longer tracks or exposes it)
- `FirestoreServices` (`createUserProfile` no longer writes it, `updateUserProfile` no longer accepts it)
- `UserProfileInput` type

Existing Firestore documents may still have a `dailyGoal` field — it's harmless, just ignored.

---

## What You Don't Need to Worry About

- **`calculateTaskHP()`** was removed but had zero imports — nothing breaks.
- **L3 (task HP on complete)** — there's no separate L3 logic. Screens call `updateTask()` directly, and HP recalculates reactively via `useEmber()` → `useTasks()`. No old-formula code to update.
- **All consumers of `useEmber()`** — return shape is identical, no screen changes needed.
