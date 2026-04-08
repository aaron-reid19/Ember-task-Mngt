# 🔥 Ember — QA Review: Kaley's UI Layer
**CPRG-303-C | Group 9 (Shrek Bros) | Apr 2026**
**Kaley Wood · Joshua Couto · Aaron Reid**

---

### Status Legend
| Symbol | Meaning |
|--------|---------|
| ✅ PASS | Correct — ship it |
| ⚠️ WARN | Fix before submission |
| ❌ FAIL | Blocker — fix now |
| ℹ️ INFO | Informational only |

---

## Contents
1. [Scope & File Structure](#1-scope--file-structure)
2. [Commenting Conventions](#2-commenting-conventions)
3. [Constants & Design Tokens](#3-constants--design-tokens)
4. [TypeScript & Types](#4-typescript--types)
5. [Screens — Coordinator Pattern](#5-screens--coordinator-pattern)
6. [Components — Visual Expression Only](#6-components--visual-expression-only)
7. [Forms — React Hook Form + Zod](#7-forms--react-hook-form--zod)
8. [Navigation](#8-navigation)
9. [Layer Boundary Audit](#9-layer-boundary-audit)
10. [Pre-Submission Checklist](#10-pre-submission-checklist)
11. [Quick Reference — VS Code Search Queries](#11-quick-reference--vs-code-search-queries)

---

## 1. Scope & File Structure

> **Best Practice — File Ownership**
> - Every file belongs to exactly one layer: UI (Kaley), Logic (Josh), Data (Aaron).
> - Screens live in `app/` only. Components in `components/` only. No cross-layer folders.
> - If a file could exist without a UI, it probably belongs in Josh's or Aaron's layer.
> - When in doubt: add a `🔵 DECISION` comment and raise it with the team.

| ID | Area | Check | Expected | Status | Notes / Fix |
|----|------|-------|----------|--------|-------------|
| S-01 | Structure | `app/(tabs)/index.tsx` exists | Home screen file present | ⚠️ WARN | Verify after Aaron's scaffold merge |
| S-02 | Structure | `app/(tabs)/quests.tsx` exists | Quest Board screen present | ⚠️ WARN | Confirm no naming conflict with Aaron |
| S-03 | Structure | `app/(tabs)/quests/[id].tsx` exists | Quest Detail nested screen present | ⚠️ WARN | Nested folder under `quests/` |
| S-04 | Structure | `app/(tabs)/tasks/index.tsx` exists | Task List screen present | ⚠️ WARN | Must sit inside `tasks/` subfolder |
| S-05 | Structure | `app/(tabs)/tasks/[id].tsx` exists | Task Edit screen present | ⚠️ WARN | Nested under `tasks/` — has `_layout.tsx` sibling |
| S-06 | Structure | `app/(tabs)/profile.tsx` exists | Profile screen present | ⚠️ WARN | Check path — not `tasks/profile` |
| S-07 | Structure | `app/(onboarding)/goal-setup.tsx` exists | Onboarding goal screen present | ⚠️ WARN | `(onboarding)` group — no tab bar here |
| S-08 | Structure | `components/ui/Card.tsx` | Base card primitive present | ⚠️ WARN | Phase 1 file — must exist before anything else |
| S-09 | Structure | `components/ui/Button.tsx` | Button primitive present | ⚠️ WARN | `label`, `onPress`, `variant` props required |
| S-10 | Structure | `components/ui/Badge.tsx` | Badge primitive present | ⚠️ WARN | `label` + `color` props |
| S-11 | Structure | `components/ui/HPBar.tsx` | Animated HP bar present | ⚠️ WARN | `value` (0–100) + `state` props |
| S-12 | Structure | `components/ui/NotificationBanner.tsx` | Notification banner present | ⚠️ WARN | `visible` hardcoded `false` until D12 unblocked |
| S-13 | Structure | `components/ember/EmberCreature.tsx` | Ember creature component present | ⚠️ WARN | U3 — four states + Reanimated |
| S-14 | Structure | `components/ember/EmberAnimations.tsx` | Animation logic file present | ⚠️ WARN | Internal only — not imported by screens |
| S-15 | Structure | `components/ember/DailySparkCard.tsx` | Daily Spark card present | ⚠️ WARN | U2 — uses Card + Button |
| S-16 | Structure | `components/ember/BonfireIndicator.tsx` | Bonfire overlay present | ⚠️ WARN | Renders only when `isBonfire === true` |
| S-17 | Structure | `components/tasks/TaskListItem.tsx` | Task row component present | ⚠️ WARN | U6 — uses Card + Badge |
| S-18 | Structure | `components/tasks/HPCostCalculator.tsx` | HP cost stepper present | ⚠️ WARN | U7 — fires `onCostChange` callback |
| S-19 | Structure | `components/quests/QuestCard.tsx` | Quest card component present | ⚠️ WARN | U4 — uses Card |
| S-20 | Structure | `components/quests/QuestFilterTabs.tsx` | Quest filter tabs present | ⚠️ WARN | U4 — fires `onSelect` callback |
| S-21 | Structure | `components/profile/HPTrendChart.tsx` | HP trend chart present | ⚠️ WARN | U8 — weekly/monthly toggle internal |
| S-22 | Structure | `components/profile/StreakDisplay.tsx` | Streak display component present | ⚠️ WARN | U8 — `streak` prop |
| S-23 | Structure | `components/profile/EvolutionLog.tsx` | Evolution log timeline present | ⚠️ WARN | U8 — `HPSnapshot[]` prop |
| S-24 | Structure | `constants/Colors.ts` exists | Color constants file present | ⚠️ WARN | Wave 1 deliverable |
| S-25 | Structure | `constants/Typography.ts` exists | Typography constants present | ⚠️ WARN | Wave 1 deliverable |
| S-26 | Structure | `constants/Spacing.ts` exists | Spacing constants present | ⚠️ WARN | Wave 1 deliverable |
| S-27 | Structure | `constants/EmberStates.ts` exists | EmberStates constants present | ⚠️ WARN | HP thresholds + colors — shared with Josh |
| S-28 | Structure | `types/ember.ts` exists | Ember types file present | ⚠️ WARN | `EmberState`, `HPData`, `HPSnapshot` |
| S-29 | Structure | `types/task.ts` exists | Task types file present | ⚠️ WARN | `Task`, `TaskPriority`, `TaskTag` |
| S-30 | Structure | `types/quest.ts` exists | Quest types file present | ⚠️ WARN | `Quest`, `QuestCadence` |
| S-31 | Structure | `types/index.ts` exists | Barrel export present | ⚠️ WARN | All types exported from one place |
| S-32 | Boundary | No `services/` imports in any Kaley file | 0 occurrences of `services/` in `app/` or `components/` | ❌ FAIL | Use grep — immediate fix if found |
| S-33 | Boundary | No `hooks/` files created by Kaley | 0 `.tsx` files in `hooks/` owned by Kaley | ❌ FAIL | Hooks are Josh's layer — do not create |
| S-34 | Boundary | No `store/` writes from UI files | `useAppStore` is read-only in screens | ⚠️ WARN | Reading is allowed; writing its structure is not |

---

## 2. Commenting Conventions

> **Best Practice — Comment Systems**
> - **System 1 (Status Tags):** emoji at the top of any stub, blocked, or in-progress section.
> - **System 2 (Inline Tags):** `// !` `// ?` `// *` `// ^` `// &` `// ~` for line-level meaning.
> - Every file header is required — no exceptions, no matter how small the component.
> - `🟡 STUB` comments must name the task ID they replace and the hook/service they're waiting on.
> - `🔴 BLOCKED` comments must include an unblock condition — who, what, when.
> - Handoff tags (`← JOSH` / `← AARON`) go on every hook call site.
> - Run a codebase search before submitting: `🔴 BLOCKED`, `🟠 IN PROGRESS`, `// !`, `// ?`

### File Header Template (required on every file)
```tsx
/**
 * Ember — [Screen or Component Name]
 * Layer: UI
 * Owner: Kaley
 * Task IDs: [e.g. U1, U3]
 * Status: 🟡 STUB | 🟢 READY | 🟠 IN PROGRESS
 *
 * Dependencies:
 *   - [Task ID]: [what this file needs] — [Owner] — [Status]
 *
 * Notes:
 *   [Context the rest of the team needs to understand this file]
 */
```

### Stub Pattern
```tsx
// 🟡 STUB [L1, L2] — replace with useEmber() when Josh's logic hooks are done
// Owner: Kaley | Replaces: { hp, state, isBonfire } from useEmber()
// ^ hardcoded at 72 — exercises the Steady state visually
const hp = 72;
const state: EmberState = "Steady";
const isBonfire = false;
```

### Blocked Pattern
```tsx
// 🔴 BLOCKED [D3] — waiting on Aaron to complete AsyncStorage read/write module
// Unblock: AsyncStorageService.ts must export saveGoal()
// ! do not ship this screen until this line is unblocked
// await AsyncStorageService.saveGoal(goal);
```

### Handoff Tags
```tsx
// ← JOSH: plug useEmber() return value here — needs { hp, state, isBonfire }
// ← AARON: plug FirestoreService.getTasks() here
```

| ID | Area | Check | Expected | Status | Notes / Fix |
|----|------|-------|----------|--------|-------------|
| C-01 | File Header | Every Kaley file has a file header comment | `/** \n * Ember — [Name]\n * Layer: UI\n * Owner: Kaley...` | ❌ FAIL | Missing header = instant FAIL at review |
| C-02 | File Header | Header includes `Layer: UI` | `Layer: UI` on all Kaley files | ⚠️ WARN | Do not write `Layer: Logic` or `Layer: Data` |
| C-03 | File Header | Header `Status` field matches file state | Status is `🟡 STUB` / `🟢 READY` / `🟠 IN PROGRESS` | ⚠️ WARN | Must be updated as stubs get replaced |
| C-04 | File Header | Header `Dependencies` section lists what the file needs | e.g. `L1 (Josh) — useEmber — 🟡 STUB` | ⚠️ WARN | Key for Josh and Aaron to know what to wire |
| C-05 | Status Tags | All hardcoded data sections tagged `🟡 STUB` | No plain `const` arrays without a STUB comment above | ❌ FAIL | Every stub must be findable by search |
| C-06 | Status Tags | `🟡 STUB` includes task ID and replacement instruction | `// 🟡 STUB [L1] — replace with useEmber()...` | ❌ FAIL | IDs without task refs are useless at integration time |
| C-07 | Status Tags | Blocked lines tagged `🔴 BLOCKED` | Commented-out service calls use BLOCKED pattern | ❌ FAIL | Do not silently omit blocked lines — document them |
| C-08 | Status Tags | `🔴 BLOCKED` includes unblock condition | `Unblock: [Who].[method]() must exist` | ❌ FAIL | Without condition, team can't know when to revisit |
| C-09 | Status Tags | No `🟠 IN PROGRESS` tags at submission | Zero results for `IN PROGRESS` in final commit | ⚠️ WARN | Remove or change to `READY` before submitting |
| C-10 | Inline Tags | `// !` used for critical constraints only | HP cap, layer violation warnings, do-not-ship flags | ⚠️ WARN | Don't overuse — `// !` must mean something important |
| C-11 | Inline Tags | `// ?` used for open questions | All open team questions flagged for resolution | ⚠️ WARN | Resolve or escalate to `🔵 DECISION` before submission |
| C-12 | Inline Tags | `// *` used for intentional choices | Marks patterns that should be preserved (e.g. `withSpring`) | ℹ️ INFO | Good habit — helps reviewers understand intent |
| C-13 | Inline Tags | `// ^` used for edge case warnings | HP prop has no upper bound guard, etc. | ℹ️ INFO | Non-blocking — note it and move on |
| C-14 | Handoff Tags | `← JOSH` tag on every hook call site | Every `useEmber()`, `useTasks()`, etc. has a handoff comment | ❌ FAIL | Without this Josh can't find the wiring point |
| C-15 | Handoff Tags | `← AARON` tag where service calls will plug in | Every commented-out service call has a handoff comment | ❌ FAIL | Aaron needs to know where his method connects |
| C-16 | TODOs | No unresolved `// TODO` at submission | Zero TODO results in Kaley's files at submission | ⚠️ WARN | Resolve or convert to `⚪ DEFERRED` with a reason |
| C-17 | Decisions | `🔵 DECISION` used when unsure about layer ownership | Grey zone items flagged rather than guessed | ℹ️ INFO | Better to over-flag than to silently make a wrong call |

---

## 3. Constants & Design Tokens

> **Best Practice — Design Token Rules**
> - Never write a raw hex value anywhere outside `constants/Colors.ts`.
> - Never write a raw font size number outside `constants/Typography.ts`.
> - Never write a raw padding/margin number outside `constants/Spacing.ts`.
> - Never hardcode an HP threshold — `constants/EmberStates.ts` is the shared contract with Josh.
> - If a new color is needed, add it to `Colors.ts` first. Add: `// * added [color] — confirm matches Figma`
> - `EmberStates.ts` is the one file that crosses the layer boundary — both UI and Logic import it.

```tsx
// ✅ Correct — always import from constants/
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { EmberStates } from "@/constants/EmberStates";

backgroundColor: Colors.bg
padding: Spacing.screen
color: EmberStates["Thriving"].color

// ❌ Wrong — never do this
backgroundColor: "#f8fafc"
padding: 20
color: "#22c55e"
```

| ID | Area | Check | Expected | Status | Notes / Fix |
|----|------|-------|----------|--------|-------------|
| D-01 | Colors | No raw hex values (`#xxxxxx`) in `components/` or `app/` | 0 grep hits for `/#[0-9a-fA-F]{3,6}/` outside `constants/` | ❌ FAIL | Run grep before committing — any hit is a FAIL |
| D-02 | Colors | `Colors.ts` covers all Ember brand colors | All screen colors traceable to a `Colors.ts` entry | ⚠️ WARN | Walk each screen and verify each color import |
| D-03 | Typography | No raw font size numbers in `StyleSheet` blocks | `size: Typography.body` — not `size: 14` | ❌ FAIL | Raw font sizes break consistency across screens |
| D-04 | Typography | `Typography.ts` defines at minimum: `title`, `body`, `caption` | Minimum set present and imported where needed | ⚠️ WARN | Screens must not define local font size constants |
| D-05 | Spacing | No raw padding/margin numbers in `StyleSheet` blocks | `padding: Spacing.screen` — not `padding: 20` | ❌ FAIL | Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 |
| D-06 | Spacing | `Spacing.ts` covers screen, card, and small spacing | `Spacing.screen`, `Spacing.card`, `Spacing.sm` at minimum | ⚠️ WARN | All layout spacing should be on this scale |
| D-07 | EmberStates | No HP thresholds hardcoded anywhere in UI files | 0 occurrences of `if (hp > 80)` or `if (hp < 30)` in `app/` or `components/` | ❌ FAIL | Classification is Josh's L2 — UI only reads the state string |
| D-08 | EmberStates | `EmberStates.ts` exports color per state | `EmberStates['Thriving'].color` returns a `Colors.ts` reference | ⚠️ WARN | `HPBar` and `EmberCreature` both pull from this |
| D-09 | EmberStates | `EmberStates.ts` exports threshold values | `EmberStates['Thriving'].min` and `.max` defined | ⚠️ WARN | Josh's L2 also imports this — must stay in sync |
| D-10 | Imports | All constants imported via `@/` alias | `import Colors from '@/constants/Colors'` not `'../../../constants/Colors'` | ❌ FAIL | Relative paths are fragile and break on file moves |

---

## 4. TypeScript & Types

> **Best Practice — TypeScript Rules**
> - Write types before screens. Types are the contract — Josh and Aaron depend on them.
> - Import all types from `@/types` (barrel), never from individual type files.
> - Type component props explicitly with a `type Props = { ... }` block above every component.
> - Use `useLocalSearchParams<{ id: string }>()` — always provide the generic.
> - Never use `any`. Use `unknown` and narrow it if you need to escape the type system.
> - Use `z.infer<typeof schema>` for form types — do not write a separate interface.
> - `EmberState` must be a string union type, not an enum (simpler to share across layers).

```tsx
// ✅ Import from the barrel
import { Task, EmberState, Quest } from "@/types";

// ❌ Deep-importing individual type files
import { Task } from "@/types/task";

// ✅ Typed params
const { id } = useLocalSearchParams<{ id: string }>();

// ✅ Props typed explicitly
type Props = {
  value: number;
  state: EmberState;
};
```

| ID | Area | Check | Expected | Status | Notes / Fix |
|----|------|-------|----------|--------|-------------|
| T-01 | Types | `types/ember.ts` exports `EmberState` | `export type EmberState = 'Thriving' \| 'Steady' \| 'Strained' \| 'Flickering'` | ❌ FAIL | Core shared contract — both UI and Logic depend on this |
| T-02 | Types | `types/ember.ts` exports `HPData` and `HPSnapshot` | Both types exported and used in Profile components | ⚠️ WARN | `HPTrendChart` and `EvolutionLog` depend on `HPSnapshot` |
| T-03 | Types | `types/task.ts` exports `Task`, `TaskPriority`, `TaskTag` | All three exported and used in `TaskListItem` and `HPCostCalculator` | ⚠️ WARN | Priority and Tag types drive Badge rendering |
| T-04 | Types | `types/quest.ts` exports `Quest` and `QuestCadence` | Both exported and used in `QuestCard` and `QuestFilterTabs` | ⚠️ WARN | `QuestCadence` values must match filter tab labels |
| T-05 | Types | `types/index.ts` re-exports all types | All types accessible via `import from '@/types'` | ❌ FAIL | If barrel is missing, imports will break across the codebase |
| T-06 | Props | Every component has a `type Props = { ... }` block | Explicit prop types above every component function | ❌ FAIL | Untyped props = implicit `any` — violates TypeScript rules |
| T-07 | Props | `HPBar` Props: `value (number)`, `state (EmberState)` | Exact prop signature — not `any`, not `unknown` | ⚠️ WARN | `HPBar` is rendered directly by Home screen |
| T-08 | Props | `EmberCreature` Props: `state (EmberState)` | Single prop — state string drives animations | ⚠️ WARN | Do not add HP value here — state is Josh's output |
| T-09 | Props | `QuestFilterTabs` Props: `onSelect` (callback) | `onSelect: (filter: QuestCadence) => void` | ⚠️ WARN | Filter state lives in the screen, not the component |
| T-10 | Props | `HPCostCalculator` Props: `value`, `onCostChange` | `value: number, onCostChange: (cost: number) => void` | ⚠️ WARN | Stepper fires callback — does not save directly |
| T-11 | Generics | `useLocalSearchParams` typed with generic | `useLocalSearchParams<{ id: string }>()` | ❌ FAIL | Without generic, `id` is typed as `string \| string[]` — breaks routing |
| T-12 | any | No `any` type in Kaley's files | Zero occurrences of `: any` or `as any` | ⚠️ WARN | Use `unknown` and narrow, or use `z.infer` |
| T-13 | Imports | All type imports from `@/types` barrel | `import { Task, EmberState, Quest } from '@/types'` | ❌ FAIL | Deep-importing individual type files breaks refactoring |

---

## 5. Screens — Coordinator Pattern

> **Best Practice — Screen Rules**
> - Screens call hooks and pass data down as props. That is their only job.
> - Screens never animate anything — animations live in components.
> - Screens never calculate HP, classify states, or run business logic.
> - Screens never import from `services/` directly.
> - Conditional rendering based on hook data is fine — `{isBonfire && ...}` is UI, not logic.
> - All navigation uses full absolute paths: `router.push('/(tabs)/tasks/task-id')`.
> - `StyleSheet.create()` is defined outside the component function, at the bottom of the file.

```tsx
// ✅ The whole job of a screen
export default function HomeScreen() {
  const { hp, state, isBonfire } = useEmber();   // ← JOSH
  const spark = useDailySpark();                  // ← JOSH

  return (
    <ScrollView>
      <EmberCreature state={state} />
      <HPBar value={hp} state={state} />
      <DailySparkCard task={spark} />
      {isBonfire && <BonfireIndicator />}
    </ScrollView>
  );
}

// ✅ StyleSheet at the bottom, outside the function
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.screen,
    backgroundColor: Colors.bg,
  },
});
```

| ID | Area | Check | Expected | Status | Notes / Fix |
|----|------|-------|----------|--------|-------------|
| SC-01 | Home (U1, U2) | `index.tsx` calls `useEmber()` with `🟡 STUB` fallback | Real hook or stubbed `{ hp, state, isBonfire }` with STUB comment | ⚠️ WARN | `← JOSH` handoff tag required at hook call site |
| SC-02 | Home (U1, U2) | `index.tsx` calls `useDailySpark()` with `🟡 STUB` fallback | Real hook or hardcoded `Task` object with STUB comment | ⚠️ WARN | `← JOSH` handoff tag required |
| SC-03 | Home (U1, U2) | `index.tsx` passes values as props — does not calculate | No HP formula, no state classification in this file | ❌ FAIL | Any `if (hp > 80)` in this file is a layer violation |
| SC-04 | Home (U1, U2) | `BonfireIndicator` conditionally rendered | `{isBonfire && <BonfireIndicator />}` | ⚠️ WARN | Conditional render is UI — `isBonfire` truth is Josh's |
| SC-05 | Quests (U4) | `quests.tsx` uses `FlatList` for quest list | `FlatList` with `keyExtractor` and `renderItem` | ❌ FAIL | `.map()` in `ScrollView` is not acceptable for unknown-length lists |
| SC-06 | Quests (U4) | `quests.tsx` has `useState` for selected filter | `const [filter, setFilter] = useState<QuestCadence>('Today')` | ⚠️ WARN | Interaction state is fine in screens |
| SC-07 | Quests (U4) | Quest data is stubbed with `🟡 STUB` comment | Hardcoded `Quest[]` with STUB + task ID | ⚠️ WARN | Stub shape must match the `Quest` type exactly |
| SC-08 | Quest Detail (U5) | `quests/[id].tsx` reads `id` via typed `useLocalSearchParams` | `const { id } = useLocalSearchParams<{ id: string }>()` | ❌ FAIL | Untyped params is a common mistake here |
| SC-09 | Quest Detail (U5) | Complete button has `🔴 BLOCKED` comment | Aaron's D8 (Quest CRUD) required — button commented out | ⚠️ WARN | Do not implement completion write in UI layer |
| SC-10 | Tasks (U6) | `tasks/index.tsx` uses `FlatList` | `FlatList` for task list — same rule as quests | ❌ FAIL | `.map()` in `ScrollView` not acceptable |
| SC-11 | Tasks (U6) | Task tap navigates with absolute path | `router.push('/(tabs)/tasks/' + item.id)` | ⚠️ WARN | No relative paths |
| SC-12 | Task Edit (U7) | `tasks/[id].tsx` uses React Hook Form + Zod | `useForm` with `zodResolver` — not plain `useState` for fields | ❌ FAIL | Plain `useState` for form fields is explicitly out of spec |
| SC-13 | Task Edit (U7) | Save button uses `handleSubmit(onSubmit)` | `onPress={handleSubmit(onSubmit)}` — not `onPress={onSubmit}` | ❌ FAIL | Missing `handleSubmit` skips validation entirely |
| SC-14 | Task Edit (U7) | Save is `🔴 BLOCKED` pending Aaron's D7 | `FirestoreService.updateTask()` call is commented out + BLOCKED | ⚠️ WARN | Do not implement the write in UI |
| SC-15 | Profile (U8) | `profile.tsx` calls `useStreak()` stub | Hardcoded `streak = 3` with `🟡 STUB` comment or real hook | ⚠️ WARN | `← JOSH` handoff required |
| SC-16 | Profile (U8) | `profile.tsx` calls `useHPHistory(range)` stub | Hardcoded `HPSnapshot[]` with STUB comment or real hook | ⚠️ WARN | Depends on Aaron D9 + Josh L6 — note both |
| SC-17 | Onboarding (U9) | `goal-setup.tsx` stepper works standalone | No Josh hook needed — local `useState` for goal value | ✅ PASS | This screen is independent of all hooks |
| SC-18 | Onboarding (U9) | Confirm navigates to tabs | `router.replace('/(tabs)')` on confirm | ⚠️ WARN | `replace` not `push` — user should not back into onboarding |
| SC-19 | Onboarding (U9) | Goal save is `🔴 BLOCKED` pending Aaron D3 | `AsyncStorageService.saveGoal()` commented out + BLOCKED | ⚠️ WARN | Goal value hardcoded to `5` as stub |
| SC-20 | All Screens | `StyleSheet.create()` outside component function | `const styles = StyleSheet.create({...})` at bottom of file | ❌ FAIL | Inside function = recreated every render = performance issue |
| SC-21 | All Screens | All imports use `@/` alias | No `../` or `../../` imports in any screen file | ❌ FAIL | Run grep — any `../` is an auto-FAIL |

---

## 6. Components — Visual Expression Only

> **Best Practice — Component Rules**
> - Components never import from `services/` or `hooks/`.
> - Components never run the HP formula or classify `EmberState`.
> - Reanimated animations triggered by prop changes are fine — this is UI.
> - `useState` for local interaction state (selected tab, stepper count) is fine.
> - `onPress` handlers fire callback props upward — components do not save data directly.
> - `components/ui/` is the base layer — `Card`, `Button`, `Badge` are used by everything above them.
> - `Card` is the visual shell for `DailySparkCard`, `QuestCard`, and `TaskListItem` — changing `Card` changes all three.

```tsx
// ✅ Component receives a prop and animates — knows nothing else
export function HPBar({ value, state }: Props) {
  const width = useSharedValue(value);

  useEffect(() => {
    width.value = withTiming(value); // animation triggered by prop change — this is fine
  }, [value]);

  // Color comes from constants — not hardcoded, not calculated here
  const barColor = EmberStates[state].color;
}
```

| ID | Area | Check | Expected | Status | Notes / Fix |
|----|------|-------|----------|--------|-------------|
| CP-01 | HPBar | `HPBar` uses Reanimated `useSharedValue` + `withTiming` | Width animated on `value` prop change | ⚠️ WARN | `useEffect` watching `value` triggers animation |
| CP-02 | HPBar | `HPBar` color sourced from `EmberStates[state].color` | No hardcoded color strings | ❌ FAIL | Color must change with state — `EmberStates` is the source |
| CP-03 | HPBar | `HPBar` clamps `value` between 0 and 100 | `Math.max(0, Math.min(100, value))` or prop-level guard | ⚠️ WARN | Caller should cap, but `HPBar` should be defensive |
| CP-04 | EmberCreature | `EmberCreature` renders correct sprite per state | Image source switches on `state` prop | ⚠️ WARN | `🟡 STUB` acceptable for placeholder images |
| CP-05 | EmberCreature | `EmberCreature` uses `EmberAnimations` internally | Animation logic in `EmberAnimations.tsx` — not inline | ⚠️ WARN | `EmberAnimations` is internal — not imported by screens |
| CP-06 | EmberAnimations | No HP threshold logic in `EmberAnimations.tsx` | 0 occurrences of `if (hp...)` — file receives `state` as prop only | ❌ FAIL | `// ! HP threshold logic does not belong here` |
| CP-07 | EmberAnimations | `withSpring` for scale, `withTiming` for opacity | Correct Reanimated functions per animation type | ⚠️ WARN | Spring for bouncy scale, timing for smooth opacity |
| CP-08 | DailySparkCard | `DailySparkCard` uses `Card` and `Button` internally | Imports `Card` and `Button` from `@/components/ui` | ⚠️ WARN | Do not duplicate `Card` styles inside `DailySparkCard` |
| CP-09 | BonfireIndicator | `BonfireIndicator` has no sub-components | Self-contained — no `Card` or `Button` inside | ℹ️ INFO | Simple overlay — keep it flat |
| CP-10 | TaskListItem | `TaskListItem` uses `Card` and `Badge` | Priority badge rendered via `Badge` component | ⚠️ WARN | `Badge` label and color come from `TaskPriority` type |
| CP-11 | HPCostCalculator | `HPCostCalculator` has local `useState` for stepper | `const [cost, setCost] = useState(initialValue)` | ⚠️ WARN | Local interaction state is fine here |
| CP-12 | HPCostCalculator | `HPCostCalculator` fires `onCostChange` callback | `onCostChange(newCost)` called on every increment/decrement | ❌ FAIL | Without callback, parent screen never receives the value |
| CP-13 | QuestFilterTabs | `QuestFilterTabs` fires `onSelect` on tab press | `onSelect(cadence)` called when user taps a tab | ❌ FAIL | Without callback, `quests.tsx` filter state never updates |
| CP-14 | HPTrendChart | `HPTrendChart` has internal toggle state | `const [range, setRange] = useState<'weekly'\|'monthly'>('weekly')` | ⚠️ WARN | Toggle is interaction state — fine to own internally |
| CP-15 | HPTrendChart | `HPTrendChart` renders from `HPSnapshot[]` prop | Data passed in — chart does not fetch or calculate | ❌ FAIL | Any fetch or calculation in this component is a layer violation |
| CP-16 | NotificationBanner | `NotificationBanner` is rendered in `_layout.tsx` | Not inside any tab screen — floats above all content | ⚠️ WARN | `🔴 BLOCKED` on Aaron D12 — `visible` hardcoded `false` |
| CP-17 | All | No `services/` imports in any component file | 0 grep hits for `services/` in `components/` | ❌ FAIL | Immediate layer violation — fix before any review |
| CP-18 | All | `Pressable` used instead of `TouchableOpacity` | 0 occurrences of `TouchableOpacity` in Kaley's files | ❌ FAIL | `TouchableOpacity` is legacy — `Pressable` is the standard |
| CP-19 | All | `StyleSheet.create()` outside component function | Styles defined at bottom of file, outside function body | ❌ FAIL | Inside function = recreated every render |

---

## 7. Forms — React Hook Form + Zod

> **Best Practice — Form Rules**
> - Every form field is managed by `Controller` — never a standalone `useState`.
> - Validation schema defined with Zod — type derived via `z.infer`, not a separate interface.
> - Submit always wrapped in `handleSubmit(onSubmit)` — never `onPress={onSubmit}` directly.
> - `TextInput` always uses `onChangeText` (not `onChange`) inside `Controller` render prop.
> - Error messages displayed inline per field.
> - Do not use HTML `<form>` tags — this is React Native.

```tsx
// ✅ Full correct pattern
const schema = z.object({
  name: z.string().trim().min(1, "Task name is required."),
});

type FormData = z.infer<typeof schema>; // never write a separate interface

const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});

// ✅ Controller with onChangeText
<Controller
  control={control}
  name="name"
  render={({ field: { onChange, value } }) => (
    <TextInput
      value={value}
      onChangeText={onChange}  // onChangeText, not onChange
      style={[styles.input, errors.name && styles.inputError]}
    />
  )}
/>
{errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

// ✅ Submit — always handleSubmit
<Pressable onPress={handleSubmit(onSubmit)}>
```

| ID | Area | Check | Expected | Status | Notes / Fix |
|----|------|-------|----------|--------|-------------|
| F-01 | Setup | React Hook Form imported correctly | `import { useForm, Controller } from 'react-hook-form'` | ⚠️ WARN | Also needs `@hookform/resolvers/zod` |
| F-02 | Setup | Zod schema defined before component | `const schema = z.object({...})` outside the component function | ❌ FAIL | Inside component = recreated every render |
| F-03 | Setup | `FormData` type derived from schema | `type FormData = z.infer<typeof schema>` | ❌ FAIL | Never write a separate interface that mirrors the schema |
| F-04 | Setup | `useForm` called with `zodResolver` | `useForm<FormData>({ resolver: zodResolver(schema) })` | ❌ FAIL | Without resolver, Zod validation never runs |
| F-05 | Fields | All fields use `Controller` | No standalone `useState` for any form field value | ❌ FAIL | Uncontrolled fields break validation and submission |
| F-06 | Fields | `TextInput` uses `onChangeText` not `onChange` | `onChangeText={onChange}` inside `Controller` render prop | ❌ FAIL | `onChange` is a web event — `onChangeText` is React Native |
| F-07 | Submit | Submit button uses `handleSubmit(onSubmit)` | `onPress={handleSubmit(onSubmit)}` | ❌ FAIL | Missing `handleSubmit` skips all validation |
| F-08 | Errors | Error messages displayed inline per field | `{errors.name && <Text style={styles.error}>{errors.name.message}</Text>}` | ⚠️ WARN | Error must be visible to the user on the field |
| F-09 | Errors | Error state applied to `TextInput` style | `style={[styles.input, errors.name && styles.inputError]}` | ⚠️ WARN | Red border or highlight on invalid field |
| F-10 | goal-setup | Goal stepper validates min 1, reasonable max | `z.number().min(1).max(20)` or similar | ⚠️ WARN | Goal of 0 tasks would break HP formula |

---

## 8. Navigation

> **Best Practice — Navigation Rules**
> - Always use full absolute paths: `router.push('/(tabs)/tasks/task-id')` not `'../tasks/task-id'`.
> - Use `router.replace()` for onboarding confirmation — prevent back navigation into onboarding.
> - Tab routes use `(tabs)` group. Stack routes use nested folders (`tasks/`, `quests/`).
> - Quest detail `[id].tsx` and Task edit `[id].tsx` are stack screens inside nested folders.
> - Check `_layout.tsx` tab names match every `router.push()` call in screens — mismatch breaks routing silently.
> - Deep link landing: routing logic is Josh's L9 — Kaley's job is making the screen render correctly when landed on.

```tsx
// ✅ Correct
router.push("/(tabs)/tasks/task-abc-123");
router.replace("/(tabs)"); // onboarding confirm — no going back

// ❌ Fragile — breaks when folder structure changes
router.push("../tasks/task-abc-123");
```

| ID | Area | Check | Expected | Status | Notes / Fix |
|----|------|-------|----------|--------|-------------|
| N-01 | Tab Routes | Tab navigator registers 4 tabs: Home, Quests, Add Quest, Profile | `app/(tabs)/_layout.tsx` has 4 tab entries | ⚠️ WARN | Confirm with Aaron — he may have used different names |
| N-02 | Tab Routes | Tab route names match `router.push()` calls | Every `router.push('/(tabs)/quests')` matches the registered route | ❌ FAIL | Mismatch silently navigates to wrong screen |
| N-03 | Tab Routes | Add Quest tab file name consistent | `add-quest.tsx` matches tab registration | ⚠️ WARN | `🔵 DECISION` if Aaron used a different name — flag before rename |
| N-04 | Stack Routes | Quest detail uses stack navigation | `quests/[id].tsx` is inside a nested folder, not a flat tab | ⚠️ WARN | Detail screens use back button — must be in stack |
| N-05 | Stack Routes | Task edit uses stack navigation | `tasks/[id].tsx` inside `tasks/` folder with `_layout.tsx` | ⚠️ WARN | `tasks/_layout.tsx` must exist for stack to work |
| N-06 | Paths | All `router.push()` calls use full absolute paths | 0 relative path strings in any router call | ❌ FAIL | Relative paths break when folder structure changes |
| N-07 | Paths | Task navigation passes ID correctly | `router.push('/(tabs)/tasks/' + item.id)` | ⚠️ WARN | ID must be a string — matches `useLocalSearchParams` generic |
| N-08 | Onboarding | Onboarding uses `router.replace` not `router.push` | `router.replace('/(tabs)')` after goal confirm | ❌ FAIL | `router.push` allows back navigation into onboarding — wrong behavior |
| N-09 | Back | Back button works on all nested stack screens | Android back and iOS swipe-back both tested | ⚠️ WARN | Test on device or emulator — simulator back is unreliable |
| N-10 | Polish | Tab state preserved across tab switches | Navigating away and back does not reset scroll position or filters | ⚠️ WARN | Phase 6 polish task — verify before submission |

---

## 9. Layer Boundary Audit

> **Best Practice — Run these as grep searches before every commit**
> ```
> grep -r "services/" app/ components/           # must be 0 results
> grep -r "FirestoreService\|AsyncStorageService" app/ components/  # must be 0 results
> grep -r "if (hp >" app/ components/             # must be 0 results
> grep -r "TouchableOpacity" .                    # must be 0 results
> grep -rn "../" app/ components/                 # must be 0 results (imports)
> ```

The three-layer rule is the most important rule in this project. Every violation breaks the team's parallel development model and will cause merge conflicts during integration week.

| Layer | Question it answers | Owner | Location |
|-------|-------------------|-------|----------|
| UI | "What does it look and feel like?" | Kaley | `app/`, `components/`, `constants/`, `types/` |
| Logic | "Is it true right now?" | Josh | `hooks/` |
| Data | "Where does it live?" | Aaron | `services/`, `store/` |

| ID | Area | Check | Expected | Status | Notes / Fix |
|----|------|-------|----------|--------|-------------|
| B-01 | Data Layer | No import from `services/` in any UI file | `grep -r 'services/' app/ components/` = 0 results | ❌ FAIL | Hardest violation to accidentally make — check every file |
| B-02 | Data Layer | No direct `FirestoreService` calls in UI files | `grep -r 'FirestoreService' app/ components/` = 0 results | ❌ FAIL | Must route through Josh's hooks |
| B-03 | Data Layer | No direct `AsyncStorageService` calls in UI files | `grep -r 'AsyncStorageService' app/ components/` = 0 results | ❌ FAIL | Even for reads — route through hooks |
| B-04 | Logic Layer | No HP formula in UI files | `grep -r 'completed / goal\|hp \* \|/ goal' app/ components/` = 0 results | ❌ FAIL | HP ratio is Josh's L1 |
| B-05 | Logic Layer | No HP state classification in UI files | `grep -r 'if (hp >' app/ components/` = 0 results | ❌ FAIL | Classification is Josh's L2 |
| B-06 | Logic Layer | No streak calculation in UI files | No streak computed from dates in Kaley's files | ❌ FAIL | Streak calculation is Josh's L6 |
| B-07 | Logic Layer | No notification scheduling in UI files | No `scheduleNotification` or expo-notifications trigger in Kaley's files | ❌ FAIL | Notification scheduling is Josh's L8 |
| B-08 | Logic Layer | No quest recurrence logic in UI files | No recurrence date math in Kaley's files | ❌ FAIL | Recurrence is Josh's L7 |
| B-09 | Store | `useAppStore` only read, not structurally modified | No new fields added to `useAppStore` in Kaley's files | ⚠️ WARN | Aaron owns the store structure |
| B-10 | Hooks | No hook implementations in Kaley's files | No files in `hooks/` created or modified by Kaley | ❌ FAIL | Hooks are Josh's layer exclusively |
| B-11 | All | `EmberAnimations` not imported by screens directly | Only `EmberCreature` imports `EmberAnimations` | ⚠️ WARN | `EmberAnimations` is internal to the ember component set |
| B-12 | All | No grey-zone guesses — all ambiguity flagged | Every situation in `KALEY_SCOPE.md` grey zone has a `🔵 DECISION` comment | ⚠️ WARN | Guessing and being wrong costs the team rework time |

---

## 10. Pre-Submission Checklist

> **Daily Priority Order — run at the start of every work session**
> 1. **UNBLOCK FIRST** — check if any `🔴 BLOCKED` items are now unblocked (Josh or Aaron finished their task)
> 2. **REPLACE STUBS** — if a hook or service landed, swap `🟡 STUB` for real data
> 3. **CLEAR WARNINGS** — scan for `// !` and `// ?` added since yesterday and resolve
> 4. **BUILD NEXT PHASE** — continue the current phase from `KALEY_IMPLEMENTATION_PLAN.md`
> 5. **FLAG BLOCKERS** — if something stops you, add `🔴 BLOCKED` and message the team

**Deadline: Apr 14 (buffer day). Submission: Apr 15.**

| ID | Area | Check | Expected | Status | Notes / Fix |
|----|------|-------|----------|--------|-------------|
| P-01 | Codebase Search | Search `🔴 BLOCKED` — zero results OR all escalated | Resolved or explicitly handed off to team | ❌ FAIL | Unresolved BLOCKED = feature missing at submission |
| P-02 | Codebase Search | Search `🟠 IN PROGRESS` — zero results | No file header says `IN PROGRESS` | ❌ FAIL | Remove or change to `READY` |
| P-03 | Codebase Search | Search `🟡 STUB` — every result reviewed | Real data OR confirmed acceptable stub for submission | ⚠️ WARN | Some stubs may be acceptable if Josh/Aaron aren't done |
| P-04 | Codebase Search | Search `// TODO` — zero unresolved | Resolved or converted to `⚪ DEFERRED` with reason | ⚠️ WARN | TODOs at submission = unfinished work |
| P-05 | Codebase Search | Search `// !` — every result read and resolved | All critical warnings addressed or noted to team | ❌ FAIL | `// !` means do not ship until fixed |
| P-06 | Codebase Search | Search `// ?` — zero unresolved questions | Resolved or escalated to `🔵 DECISION` | ⚠️ WARN | Open questions = uncertainty at integration time |
| P-07 | Navigation | All screens reachable via navigation | No dead-end screens — every route is navigable | ❌ FAIL | Test every tap path before submission |
| P-08 | Navigation | No crashes on main flows | Home, Quests, Tasks, Profile all render without error | ❌ FAIL | Test on Android emulator — iOS alone is not sufficient |
| P-09 | Visual | Visual consistency pass complete | Colors, spacing, typography consistent across all screens | ⚠️ WARN | Phase 6 deliverable — do not skip |
| P-10 | Visual | All `EmberState` colors come from `EmberStates.ts` | No hardcoded state-conditional hex values | ❌ FAIL | Final grep: `/#[0-9a-fA-F]/` in `app/` and `components/` |
| P-11 | Components | All components in correct folders per `KALEY_SCOPE.md` | No components accidentally placed in `app/` | ❌ FAIL | `app/` is routes only — anything else breaks Expo Router |
| P-12 | Handoff | All `← JOSH` tags have a matching TODO for Josh | Hook call sites clearly documented for integration | ⚠️ WARN | Josh needs to find these to plug in his hooks |
| P-13 | Handoff | All `← AARON` tags have a matching TODO for Aaron | Service call sites clearly documented for integration | ⚠️ WARN | Aaron needs to find these to plug in his services |
| P-14 | Final | File count matches `KALEY_SCOPE.md` | Count files in each folder vs scope document | ⚠️ WARN | Missing files = missing features at submission |
| P-15 | Final | App builds without TypeScript errors | `npx expo start` — zero TS compilation errors | ❌ FAIL | TypeScript errors at build = app will not run |

---

## 11. Quick Reference — VS Code Search Queries

Copy these into VS Code's search panel (`Ctrl+Shift+F`). Run all of them before every commit during integration week. Files to include: `app/, components/`

| Search Term | Expected | If Found |
|-------------|----------|----------|
| `🔴 BLOCKED` | 0 unresolved | Resolve or escalate — do not submit with unresolved blockers |
| `🟠 IN PROGRESS` | 0 results | Change header Status to `READY` or `STUB` |
| `🟡 STUB` | Every result reviewed | Confirm: real data landed or stub is acceptable at submission |
| `// TODO` | 0 results | Complete the task or convert to `⚪ DEFERRED` with a reason |
| `// !` | All resolved | Read each — if constraint is unresolved, fix it now |
| `// ?` | 0 results | Answer the question or escalate to `🔵 DECISION` |
| `services/` | 0 in `app/`, `components/` | Layer violation — remove and route through a Josh hook |
| `FirestoreService` | 0 in `app/`, `components/` | Layer violation — same as above |
| `TouchableOpacity` | 0 results | Replace with `Pressable` |
| `if (hp >` | 0 in `app/`, `components/` | Layer violation — HP classification is Josh's L2 |
| `#[0-9a-fA-F]{3,6}` | 0 in `app/`, `components/` | Inline hex — move to `constants/Colors.ts` |
| `../` | 0 in imports | Relative import — replace with `@/` alias |
| `: any` | 0 results | Replace with proper type or `unknown` + narrowing |
| `StyleSheet.create` | All outside functions | If inside a component function, move to bottom of file |

---

*Ember UI Layer QA · Kaley Wood · CPRG-303-C Group 9 · Apr 2026*
