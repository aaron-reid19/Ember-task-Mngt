# Ember — QA Fixes Handoff
**Branch:** `branch-kaley` | **QA Date:** 2026-04-06 | **Deadline:** Apr 14 (buffer) / Apr 15 (submission)

> All fixes below fall within Kaley's UI scope (`app/`, `components/`, `constants/`).
> No hooks, services, or store modifications are involved.

---

## Summary

| # | Fix | Severity | Files | Est. Time |
|---|-----|----------|-------|-----------|
| 1 | [Raw hex values → Colors.ts](#fix-1--raw-hex-values--colorsts) | ❌ FAIL | 3 + Colors.ts | 10 min |
| 2 | [Forms: React Hook Form + Zod](#fix-2--forms-react-hook-form--zod) | ❌ FAIL | 3 screens | 45 min |
| 3 | [Route `as any` → typed routes](#fix-3--route-as-any--typed-routes) | ❌ FAIL | 6 files | 15 min |
| 4 | [HPBar: use EmberStates color](#fix-4--hpbar-use-emberstates-color) | ⚠️ WARN | 1 component | 5 min |
| 5 | [TODO → DEFERRED in EmberCreature](#fix-5--todo--deferred-in-embercreature) | ⚠️ WARN | 1 component | 2 min |

**Total estimated time: ~1.5 hours**

---

## Fix 1 — Raw Hex Values → Colors.ts

**QA IDs:** D-01, P-10
**Severity:** ❌ FAIL — raw hex values outside `constants/` violate the design token rule

### Problem

5 raw hex values found in `app/` and `components/` instead of referencing `constants/Colors.ts`.

| File | Line | Value | Purpose |
|------|------|-------|---------|
| `app/(tabs)/profile.tsx` | 221 | `"#22C55E"` | Green online indicator dot |
| `app/(tabs)/tasks/[id].tsx` | 54 | `"#E74C3C"` | High priority color |
| `app/(tabs)/tasks/[id].tsx` | 55 | `"#F5A623"` | Medium priority color |
| `app/(tabs)/tasks/[id].tsx` | 56 | `"#7B6A95"` | Low priority color |
| `components/ember/EmberCreature.tsx` | 117 | `"#2D1B4E"` | Creature background |

### Plan

**Step 1 — Add new color tokens to `constants/Colors.ts`:**
```ts
// Priority badge colors
priorityHigh: "#E74C3C",
priorityMedium: "#F5A623",
priorityLow: "#7B6A95",

// Status indicators
onlineGreen: "#22C55E",

// Creature
creatureBg: "#2D1B4E",
```
Add a comment on each: `// * added — confirm matches Figma`

**Step 2 — Replace raw values in each file:**
- `profile.tsx:221` → `Colors.onlineGreen`
- `tasks/[id].tsx:54-56` → `Colors.priorityHigh`, `Colors.priorityMedium`, `Colors.priorityLow`
- `EmberCreature.tsx:117` → `Colors.creatureBg`

**Step 3 — Verify:** Run a grep for `#[0-9a-fA-F]{3,8}` in `app/` and `components/` — must return 0 results.

---

## Fix 2 — Forms: React Hook Form + Zod

**QA IDs:** F-01 through F-09, SC-12, SC-13
**Severity:** ❌ FAIL — all three form screens use plain `useState` instead of the required RHF + Zod pattern

### Problem

The QA spec requires every form to use:
- `react-hook-form` (`useForm`, `Controller`)
- `zod` for validation schemas
- `@hookform/resolvers/zod` for the bridge
- `handleSubmit(onSubmit)` wrapping the submit button
- Inline error messages per field

Currently all three form screens use standalone `useState` for field values with no validation.

### Affected Files

| File | Form Purpose | Fields |
|------|-------------|--------|
| `app/(tabs)/tasks/[id].tsx` | Task Edit | `taskName` (string, required) |
| `app/(tabs)/add-quest.tsx` | Add Quest | `questName` (string, required), `description` (string, optional), `hpCost` (number), `frequency` (QuestCadence), `activeDays` (WeekDay[]), `startDate` (string) |
| `app/(onboarding)/goal-setup.tsx` | Goal Setup | `dailyGoal` (number, min 1, max 50) |

### Plan

**Step 0 — Verify packages are installed:**
```bash
npm ls react-hook-form zod @hookform/resolvers
```
If missing, install them. These are UI-layer form libraries — within Kaley's scope.

**Step 1 — Rewrite `app/(tabs)/tasks/[id].tsx`** (simplest form, do first):

1. Define Zod schema OUTSIDE the component:
   ```tsx
   const taskSchema = z.object({
     name: z.string().trim().min(1, "Task name is required."),
   });
   type TaskFormData = z.infer<typeof taskSchema>;
   ```
2. Replace `useState` with `useForm<TaskFormData>({ resolver: zodResolver(taskSchema) })`.
3. Wrap `TextInput` in `<Controller>` with `onChangeText`.
4. Change save button to `onPress={handleSubmit(onSubmit)}`.
5. Add inline error: `{errors.name && <Text style={styles.error}>{errors.name.message}</Text>}`.
6. Add error border style: `style={[styles.input, errors.name && styles.inputError]}`.
7. Keep the `🔴 BLOCKED` comment on the actual save — only the form validation changes.

**Step 2 — Rewrite `app/(tabs)/add-quest.tsx`** (most complex form):

1. Define Zod schema outside component:
   ```tsx
   const questSchema = z.object({
     name: z.string().trim().min(1, "Quest name is required."),
     description: z.string().optional(),
     hpCost: z.number().min(1).max(20),
     frequency: z.enum(["Once", "Daily", "Weekly", "Biweekly", "Monthly", "Custom"]),
     activeDays: z.array(z.enum(["M", "T", "W", "Th", "F", "S", "Su"])),
     startDate: z.string().optional(),
   });
   type QuestFormData = z.infer<typeof questSchema>;
   ```
2. Replace all `useState` field variables with `useForm`.
3. Wrap each input in `<Controller>`.
4. The `HPCostCalculator` component already fires `onCostChange` — wire it through Controller's `onChange`.
5. The frequency selector and day-of-week toggles become controlled via `Controller` render props.
6. Add inline errors and error border styles for required fields.
7. Save button: `onPress={handleSubmit(onSubmit)}`.

**Step 3 — Rewrite `app/(onboarding)/goal-setup.tsx`** (simplest validation):

1. Define Zod schema:
   ```tsx
   const goalSchema = z.object({
     dailyGoal: z.number().min(1, "Set at least 1 task.").max(50, "Maximum 50 tasks."),
   });
   type GoalFormData = z.infer<typeof goalSchema>;
   ```
2. Replace `useState` with `useForm`. HPCostCalculator is the only input — wire through Controller.
3. Confirm button: `onPress={handleSubmit(onSubmit)}`.
4. Error display below the stepper if value is somehow invalid.

**Step 4 — Verify:**
- Every `TextInput` uses `onChangeText` inside Controller (not `onChange`).
- Zero standalone `useState` for any form field value.
- `handleSubmit` wraps every submit `onPress`.
- Error messages display inline per field.
- Zod schemas are outside the component function.

### Notes
- The `🔴 BLOCKED` comments on actual data saves (Aaron's services) stay untouched.
- The `🟡 STUB` comments on data stay untouched.
- Only the form validation and field management pattern changes.

---

## Fix 3 — Route `as any` → Typed Routes

**QA IDs:** T-12
**Severity:** ❌ FAIL — 7 instances of `as any` violate the "no any" rule

### Problem

All 7 instances are route path casts used to silence expo-router type errors:

| File | Line | Code |
|------|------|------|
| `app/index.tsx` | 44 | `"/(onboarding)/goal-setup" as any` |
| `app/index.tsx` | 47 | `"/(tabs)" as any` |
| `app/(tabs)/index.tsx` | 190 | `"/(tabs)/tasks" as any` |
| `app/(tabs)/quests.tsx` | 103 | `` `/(tabs)/quests/${questId}` as any `` |
| `app/(onboarding)/goal-setup.tsx` | 77 | `"/(tabs)" as any` |
| `app/(tabs)/quests/[id].tsx` | 118 | `"/(tabs)" as any` |
| `app/(tabs)/tasks/index.tsx` | 122 | `` `/(tabs)/tasks/${task.id}` as any `` |

### Plan

**Option A — Enable expo-router typed routes (preferred):**

1. Confirm `expo-router` version supports typed routes (v3+).
2. Run `npx expo customize` or add to `app.json`:
   ```json
   {
     "experiments": {
       "typedRoutes": true
     }
   }
   ```
3. Regenerate types: the build step creates a `.expo/types/router.d.ts` file that maps all file-based routes to a union type.
4. Remove all 7 `as any` casts — the routes should now be recognized.
5. Verify: grep for `as any` in `app/` — must return 0 results.

**Option B — Manual route type declaration (fallback):**

If typed routes can't be enabled, create a declaration file:

1. Create `types/routes.d.ts`:
   ```ts
   import "expo-router";
   declare module "expo-router" {
     export interface RouteParams {
       "/(tabs)": undefined;
       "/(tabs)/tasks": undefined;
       "/(tabs)/tasks/[id]": { id: string };
       "/(tabs)/quests/[id]": { id: string };
       "/(onboarding)/goal-setup": undefined;
     }
   }
   ```
2. Remove all `as any` casts.
3. Verify: grep for `as any` — 0 results.

**Note:** If neither option resolves all type errors cleanly, a `🔵 DECISION` comment can replace each `as any` temporarily:
```tsx
// 🔵 DECISION — expo-router typed routes not resolving this path. Confirm with team.
```
This is better than silent `as any`.

---

## Fix 4 — HPBar: Use EmberStates Color

**QA IDs:** CP-02
**Severity:** ⚠️ WARN — HPBar ignores `state` prop for bar color

### Problem

`components/ui/HPBar.tsx` accepts a `state: EmberState` prop but does not use it for coloring. It always renders a static gradient from `Colors.hpBarStart` to `Colors.hpBarEnd` regardless of Ember state.

The QA spec requires: `EmberStates[state].color` drives the bar color.

### Plan

1. Open `components/ui/HPBar.tsx`.
2. Import `EmberStates` from `@/constants/EmberStates`.
3. In the animated bar fill, derive the color from the state prop:
   ```tsx
   const barColor = EmberStates[state].color;
   ```
4. Replace the static gradient with the state-driven color. Two options:
   - **Simple fill:** Replace `LinearGradient` with a solid `Animated.View` using `backgroundColor: barColor`.
   - **Keep gradient:** Use `barColor` as the gradient end color, keeping a lighter start.
5. Add a comment: `// * bar color driven by EmberState — source: constants/EmberStates.ts`
6. Verify: the `state` prop is no longer unused.

### Note
This is purely visual — "what does it look like" — firmly in Kaley's scope. The state value itself comes from Josh's hook; Kaley just renders it.

---

## Fix 5 — TODO → DEFERRED in EmberCreature

**QA IDs:** C-16, P-04
**Severity:** ⚠️ WARN — unresolved TODO at submission

### Problem

`components/ember/EmberCreature.tsx` line 46:
```tsx
// TODO replace with real sprite assets from the Figma design before Wave 4
```

The QA spec requires zero `// TODO` at submission. Unresolved TODOs must be converted to `⚪ DEFERRED` with a reason.

### Plan

1. Open `components/ember/EmberCreature.tsx`.
2. Replace line 46:
   ```tsx
   // ⚪ DEFERRED — sprite assets awaited from design export; placeholder PNGs are functional
   ```
3. Verify: grep for `// TODO` in `app/` and `components/` — must return 0 results.

---

## Verification Checklist (run after all fixes)

Run these searches to confirm all fixes landed:

```bash
# D-01: No raw hex in UI files
grep -rn "#[0-9a-fA-F]\{3,8\}" app/ components/ --include="*.tsx" --include="*.ts"
# Expected: 0 results

# T-12: No `as any`
grep -rn "as any" app/ components/ --include="*.tsx" --include="*.ts"
# Expected: 0 results

# F-04: Zod + RHF present in form screens
grep -rn "zodResolver" app/
# Expected: 3 results (tasks/[id], add-quest, goal-setup)

# F-07: handleSubmit wraps submit
grep -rn "handleSubmit" app/
# Expected: 3 results

# C-16: No unresolved TODO
grep -rn "// TODO" app/ components/ constants/ types/ --include="*.tsx" --include="*.ts"
# Expected: 0 results

# CP-02: HPBar uses EmberStates
grep -n "EmberStates" components/ui/HPBar.tsx
# Expected: at least 1 result
```

---

## Post-Fix QA Score Projection

| Section | Before | After |
|---------|--------|-------|
| Constants & Tokens (D) | 5/10 | 10/10 |
| TypeScript (T) | 12/13 | 13/13 |
| Screens (SC) | 19/21 | 21/21 |
| Components (CP) | 17/19 | 19/19 |
| Forms (F) | 1/10 | 10/10 |
| **Overall** | **~80%** | **~98%** |

Remaining items after fixes will be the `🔴 BLOCKED` stubs (waiting on Josh/Aaron) and the `// ?` merge documentation comments — both are expected and acceptable at submission.
