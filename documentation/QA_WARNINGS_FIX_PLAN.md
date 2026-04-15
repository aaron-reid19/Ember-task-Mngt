# Ember — QA Warnings Fix Plan
**Branch:** `branch-kaley` | **QA Date:** 2026-04-14 | **Deadline:** Apr 15 (submission)

> Follow-up from the full QA run on 2026-04-14.
> All prior ❌ FAIL items from `QA_FIXES_HANDOFF.md` are now resolved.
> Three ⚠️ WARN items remain — documented below with fix plans.

---

## Summary

| # | Warning | Severity | Owner | Files | Est. Time |
|---|---------|----------|-------|-------|-----------|
| 1 | [goal-setup.tsx — No RHF+Zod form validation](#warning-1--goal-setuptsx--no-rhfzod-form-validation) | ⚠️ WARN | Kaley | 1 screen | 5 min |
| 2 | [EmberAnimations.tsx — Missing file](#warning-2--emberanimationstsx--missing-file) | ⚠️ WARN | Kaley | 1 new file | 10 min |
| 3 | [deepLinkEngine.ts — 3 TypeScript errors](#warning-3--deeplinkengine-ts--3-typescript-errors) | ⚠️ WARN | Josh | 1 file | 2 min |

**Total estimated time: ~17 minutes**

---

## Warning 1 — goal-setup.tsx — No RHF+Zod Form Validation

**QA IDs:** F-01 through F-09 (partial), QA_FIXES_HANDOFF Fix 2 Step 3
**Severity:** ⚠️ WARN — QA spec expects Zod + RHF on all form screens
**Owner:** Kaley
**File:** `app/(onboarding)/goal-setup.tsx`

### Context

The QA_FIXES_HANDOFF doc listed `goal-setup.tsx` as one of three screens needing RHF+Zod with an `HPCostCalculator` stepper for setting `dailyGoal` (min 1, max 50).

However, the current implementation has **no form fields at all**. The screen was simplified to a "Welcome to Ember" onboarding page with only a "Let's Go" button that calls `completeOnboarding()`. There is no `HPCostCalculator`, no `dailyGoal` input, and no text fields.

### Decision Required

**Option A — Mark as non-applicable (recommended if goal-setup no longer has a form):**

The screen has no user-editable fields, so RHF+Zod is unnecessary. The QA spec item was written when the screen was expected to include a goal stepper. Since the stepper was moved to the Profile screen, the spec no longer applies here.

**Action:**
1. Add a `🔵 DECISION` comment to `goal-setup.tsx` explaining why RHF+Zod is not used:
   ```tsx
   // 🔵 DECISION — No RHF+Zod on this screen: no user-editable fields.
   // The dailyGoal stepper was moved to the Profile screen (U8).
   // QA_FIXES_HANDOFF Fix 2 Step 3 no longer applies here.
   ```
2. Update `QA_FIXES_HANDOFF.md` Fix 2 to note that goal-setup is excluded.

**Option B — Restore the HPCostCalculator stepper:**

If the team decides onboarding should still set a daily goal, restore the form:

**Action:**
1. Add imports:
   ```tsx
   import { useForm, Controller } from "react-hook-form";
   import { zodResolver } from "@hookform/resolvers/zod";
   import { z } from "zod";
   import { HPCostCalculator } from "@/components/tasks/HPCostCalculator";
   ```
2. Define Zod schema outside the component:
   ```tsx
   const goalSchema = z.object({
     dailyGoal: z.number().min(1, "Set at least 1 task.").max(50, "Maximum 50 tasks."),
   });
   type GoalFormData = z.infer<typeof goalSchema>;
   ```
3. Replace `useState` with `useForm<GoalFormData>`:
   ```tsx
   const { control, handleSubmit, formState: { errors } } = useForm<GoalFormData>({
     resolver: zodResolver(goalSchema),
     defaultValues: { dailyGoal: 10 },
   });
   ```
4. Wrap `HPCostCalculator` in a `<Controller>` with `render` prop:
   ```tsx
   <Controller
     control={control}
     name="dailyGoal"
     render={({ field: { onChange, value } }) => (
       <HPCostCalculator value={value} onCostChange={onChange} min={1} max={50} />
     )}
   />
   {errors.dailyGoal && (
     <Text style={styles.error}>{errors.dailyGoal.message}</Text>
   )}
   ```
5. Change the "Let's Go" button to use `handleSubmit`:
   ```tsx
   <Button
     label={submitting ? "Getting started..." : "Let's Go"}
     onPress={handleSubmit(onSubmit)}
     disabled={submitting}
   />
   ```
6. Update `onContinue` → `onSubmit` to accept form data:
   ```tsx
   const onSubmit = async (data: GoalFormData) => {
     setSubmitting(true);
     await completeOnboarding(data.dailyGoal);
     router.replace("/(tabs)");
   };
   ```

### Verification

```bash
# Confirm zodResolver is present (if Option B)
grep -n "zodResolver" app/(onboarding)/goal-setup.tsx
# Expected: 1 result

# Confirm handleSubmit wraps submit (if Option B)
grep -n "handleSubmit" app/(onboarding)/goal-setup.tsx
# Expected: 1 result

# Confirm DECISION comment is present (if Option A)
grep -n "DECISION" app/(onboarding)/goal-setup.tsx
# Expected: 1 result
```

---

## Warning 2 — EmberAnimations.tsx — Missing File

**QA IDs:** S-14 (Ember_Kaley_QA.md)
**Severity:** ⚠️ WARN — file referenced in QA structure spec but does not exist
**Owner:** Kaley
**Expected path:** `components/ember/EmberAnimations.tsx`

### Context

The QA spec (S-14) expects `EmberAnimations.tsx` as a separate file containing animation logic for the Ember creature. Currently, all Reanimated animation logic lives inline in `components/ember/EmberCreature.tsx` (lines 59–68):

```tsx
// Inside EmberCreature component:
const scale = useSharedValue(EmberStates[state].creatureScale);
const opacity = useSharedValue(EmberStates[state].creatureOpacity);

useEffect(() => {
  const config = EmberStates[state];
  scale.value = withSpring(isBonfire ? 1.3 : config.creatureScale, {
    damping: 12, stiffness: 100,
  });
  opacity.value = withTiming(config.creatureOpacity, { duration: 500 });
}, [state, isBonfire]);

const animStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
  opacity: opacity.value,
}));
```

The spec note says: *"Internal only — not imported by screens"* — meaning EmberAnimations.tsx is a helper for EmberCreature, not used directly by any screen.

### Plan

**Create `components/ember/EmberAnimations.tsx`** that exports a custom hook encapsulating the creature animation logic. Then refactor `EmberCreature.tsx` to import and use it.

**Step 1 — Create `components/ember/EmberAnimations.tsx`:**

```tsx
/**
 * Ember — EmberAnimations
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U3
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - constants/EmberStates.ts: creatureScale + creatureOpacity per state
 *
 * Notes:
 *   Internal animation hook for EmberCreature — not imported by screens.
 *   Encapsulates Reanimated shared values and animated styles for the
 *   creature's scale and opacity transitions between Ember states.
 *   * withSpring for scale gives the organic creature feel.
 *   * withTiming for opacity gives a smooth fade.
 */

import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  type AnimatedStyle,
} from "react-native-reanimated";
import { EmberState, EmberStates } from "@/constants/EmberStates";

// ~ ─────────────────────────────────────────────────────────────────

interface UseEmberAnimationOptions {
  state: EmberState;
  isBonfire: boolean;
}

/**
 * Custom hook that drives the EmberCreature's scale + opacity animation.
 * Returns an animated style object to spread onto an Animated.View.
 *
 * @param options.state   — current Ember state (drives target scale + opacity)
 * @param options.isBonfire — when true, overrides scale to 1.3
 */
export function useEmberAnimation({ state, isBonfire }: UseEmberAnimationOptions) {
  const scale = useSharedValue(EmberStates[state].creatureScale);
  const opacity = useSharedValue(EmberStates[state].creatureOpacity);

  // * Animate whenever state prop changes — prop drives the animation
  useEffect(() => {
    const config = EmberStates[state];
    scale.value = withSpring(isBonfire ? 1.3 : config.creatureScale, {
      damping: 12,
      stiffness: 100,
    });
    opacity.value = withTiming(config.creatureOpacity, { duration: 500 });
  }, [state, isBonfire]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { animatedStyle };
}
```

**Step 2 — Refactor `components/ember/EmberCreature.tsx`:**

Replace the inline animation logic with the imported hook:

```tsx
// Remove these imports from EmberCreature.tsx:
// - useEffect
// - useSharedValue, useAnimatedStyle, withSpring, withTiming

// Add this import:
import { useEmberAnimation } from "./EmberAnimations";

// Replace lines 59-68 (inline animation) with:
const { animatedStyle } = useEmberAnimation({ state, isBonfire });

// Replace animStyle usage with animatedStyle:
<Animated.View style={[styles.creatureWrapper, animatedStyle]}>
```

**Step 3 — Verify:**

```bash
# File exists
ls components/ember/EmberAnimations.tsx
# Expected: file listed

# EmberCreature imports from EmberAnimations
grep -n "EmberAnimations" components/ember/EmberCreature.tsx
# Expected: 1 import result

# No duplicate animation logic in EmberCreature
grep -n "useSharedValue" components/ember/EmberCreature.tsx
# Expected: 0 results (moved to EmberAnimations)

# TypeScript compiles
npx tsc --noEmit 2>&1 | grep -i "EmberAnimations"
# Expected: 0 errors
```

---

## Warning 3 — deepLinkEngine.ts — 3 TypeScript Errors

**QA IDs:** QA.md 1.1 (TypeScript compilation)
**Severity:** ⚠️ WARN — `npx tsc --noEmit` reports 3 errors
**Owner:** Josh (Layer: Logic, file header says `Owner: Josh`)
**File:** `utils/deepLinkEngine.ts`

### Problem

Three identical TypeScript errors on lines 38, 42, and 50:

```
error TS2345: Argument of type '"/(tabs)/"' is not assignable to parameter of type '...'
```

The route path `"/(tabs)/"` has a trailing slash that Expo Router's typed routes don't recognize. The valid path is `"/(tabs)"` (no trailing slash).

### Context

The file already has a self-documenting comment on line 35:
```tsx
// ! TS errors: router.push("/(tabs)/") path not recognized by Expo Router typed routes
// ← JOSH: change to router.push("/(tabs)") (no trailing slash) or cast as needed
```

This is Josh's file (`Layer: Logic`, `Owner: Josh`). Kaley should not modify it directly.

### Plan

**For Josh:**

1. Open `utils/deepLinkEngine.ts`.
2. Replace all three instances of `"/(tabs)/"` with `"/(tabs)"`:

   | Line | Before | After |
   |------|--------|-------|
   | 38 | `router.push("/(tabs)/");` | `router.push("/(tabs)");` |
   | 42 | `router.push("/(tabs)/");` | `router.push("/(tabs)");` |
   | 50 | `router.push("/(tabs)/");` | `router.push("/(tabs)");` |

3. Remove the `// !` warning comment on line 35 since the issue will be resolved.

**Verification:**

```bash
# No trailing slash routes
grep -n '/(tabs)/"' utils/deepLinkEngine.ts
# Expected: 0 results

# TypeScript compiles clean
npx tsc --noEmit
# Expected: 0 errors
```

### Escalation Path

If Josh is unavailable before the Apr 15 deadline, Kaley may apply this fix with a handoff comment:
```tsx
// ← JOSH: Kaley applied this fix pre-submission to clear tsc errors — trailing slash removed
```

---

## Post-Fix Verification Checklist

Run these after all three warnings are resolved:

```bash
# 1. TypeScript — zero errors
npx tsc --noEmit
# Expected: 0 errors

# 2. Zod in all form screens (login, signup, add-quest, tasks/[id] + goal-setup if Option B)
grep -rn "zodResolver" app/
# Expected: 4 results (or 5 if goal-setup gets a form)

# 3. handleSubmit wraps all submits
grep -rn "handleSubmit" app/
# Expected: 4 results (or 5)

# 4. EmberAnimations file exists and is imported
grep -rn "EmberAnimations" components/ember/
# Expected: 2 results (the file itself + import in EmberCreature)

# 5. No trailing-slash routes
grep -rn '"/(tabs)/"' utils/
# Expected: 0 results

# 6. Expo Go starts clean
npx expo start --clear
# Expected: Metro bundles, QR code appears, no red box
```

---

## QA Score Projection — After Warning Fixes

| Section | Current | After Fixes |
|---------|---------|-------------|
| Build & Compilation (1) | 4/5 | 5/5 |
| File Structure (S) | 33/34 | 34/34 |
| Forms (F) | 8/10 | 10/10 |
| **Overall** | **~95%** | **~98%** |

Remaining items after all fixes will be `🔴 BLOCKED` stubs (waiting on Josh/Aaron integration) and `⚪ DEFERRED` items (out of MVP scope) — both are expected and acceptable at submission.

---

*Ember QA Warnings Fix Plan | Kaley Wood | branch-kaley | 2026-04-14*
