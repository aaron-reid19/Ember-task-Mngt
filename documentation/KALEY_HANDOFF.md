# Kaley's UI Layer Handoff

**Author:** Kaley Wood
**Date:** 2026-04-07
**Branch:** `branch-kaley`

---

## Summary

The entire UI layer for Ember is complete. All screens, components, types, constants, and navigation are built and rendering with stub data. This document covers what was built, how it's organized, and what Josh and Aaron need to wire up their layers.

---

## What Was Built

### Screens (7 total)

| Screen | Route | User Story | Status |
|--------|-------|------------|--------|
| Home | `(tabs)/index.tsx` | U1, U2 | Complete w/ stub data |
| Quest Board | `(tabs)/quests/index.tsx` | U4 | Complete w/ stub data |
| Quest Detail | `(tabs)/quests/[id].tsx` | U5 | Complete w/ stub data |
| Task List | `(tabs)/tasks/index.tsx` | U6 | Complete w/ stub data |
| Task Edit | `(tabs)/tasks/[id].tsx` | U7 | Complete w/ stub data |
| Profile | `(tabs)/profile.tsx` | U8 | Complete w/ stub data |
| Onboarding | `(onboarding)/goal-setup.tsx` | U9 | Complete w/ stub data |

### Components (16 total)

**Base Primitives** (`components/ui/`)
- `Card.tsx` — Dark purple container with border and padding
- `Button.tsx` — Pill-shaped, primary (amber) and secondary (transparent) variants
- `Badge.tsx` — Small pill label, default and outlined variants
- `HPBar.tsx` — Animated fill bar, color driven by EmberState
- `NotificationBanner.tsx` — Floating permission alert (stub, always hidden)

**Ember** (`components/ember/`)
- `EmberCreature.tsx` — Creature sprite with scale/opacity animations per HP state
- `EmberAnimations.tsx` — Internal Reanimated animation logic
- `DailySparkCard.tsx` — Spark task card with completion button
- `BonfireIndicator.tsx` — Celebration overlay when HP=100 + Spark done

**Tasks** (`components/tasks/`)
- `TaskListItem.tsx` — Task row: checkbox, name, HP cost
- `HPCostCalculator.tsx` — Stepper with +/- buttons, reused across screens

**Quests** (`components/quests/`)
- `QuestCard.tsx` — Quest row: checkbox, name, cadence badge, HP, status
- `QuestFilterTabs.tsx` — Horizontal cadence filter (Once/Daily/Weekly/etc.)

**Profile** (`components/profile/`)
- `HPTrendChart.tsx` — Line chart with weekly/monthly toggle (stub data)
- `StreakDisplay.tsx` — Current streak counter
- `EvolutionLog.tsx` — Timeline of state changes

### Types (`types/`)

All type contracts are locked in and exported from `types/index.ts`:

- **`ember.ts`** — `EmberState`, `HPData`, `HPSnapshot`
- **`task.ts`** — `Task`, `TaskPriority`, `TaskTag`
- **`quest.ts`** — `Quest`, `QuestCadence`, `WeekDay`

### Constants (`constants/`)

All design tokens are centralized — no inline hex values or font sizes anywhere:

- **`Colors.ts`** — Full dark purple palette from Figma
- **`Typography.ts`** — Font sizes (xs–hero), weights, caps tracking
- **`Spacing.ts`** — Scale from xs(4) to xxl(32), plus screen/card/gap presets
- **`EmberStates.ts`** — HP thresholds, state colors, scale, and opacity values

---

## Architecture Rules

These are non-negotiable patterns the whole team agreed on:

1. **Three-layer separation** — UI (`app/`, `components/`) never imports from `services/` or `store/`. Logic (`hooks/`) bridges the gap.
2. **Screens are coordinators** — They call hooks and pass data down as props. No business logic in route files.
3. **Components are dumb** — They receive props and render. They don't know where data comes from.
4. **All design tokens in `constants/`** — Use `Colors.ts`, `Typography.ts`, `Spacing.ts`, `EmberStates.ts`. Never hardcode values.
5. **`@/` alias for all imports** — No relative paths (`../../`).
6. **StyleSheet at file bottom** — Always outside the component function.
7. **Forms use React Hook Form + Zod** — Never plain `useState` for form state.
8. **File headers on every file** — Block comment with owner, status, dependencies, notes. See `COMMENTING_CONVENTIONS.md`.
9. **Status tags on stubs** — Every stub is marked with a comment tag so it's easy to find and replace.

---

## What Josh Needs to Build (Logic Layer)

All screens are ready to consume hooks. Currently using hardcoded stub data where hooks will go.

| Hook | Returns | Used By |
|------|---------|---------|
| `useEmber()` | `{ hp, state, isBonfire }` | Home, Quest Board, Task List, Profile |
| `useTasks()` | `Task[]` | Home (today's progress), Task List |
| `useTask(id)` | `Task` | Task Edit |
| `useQuests(cadence?)` | `Quest[]` | Quest Board |
| `useQuest(id)` | `Quest` | Quest Detail |
| `useDailySpark()` | `{ task, onComplete }` | Home (DailySparkCard) |
| `useStreak()` | `number` | Home, Profile |
| `useHPHistory(range)` | `HPSnapshot[]` | Profile (HPTrendChart) |

**HP Formula:** `HP = (completedTasks / dailyGoal) * 100`, clamped 0–100.

**Bonfire Mode:** `isBonfire = true` only when HP === 100 AND Daily Spark is complete.

---

## What Aaron Needs to Build (Data Layer)

| Service/Store | Purpose |
|---------------|---------|
| `AsyncStorageService` | Local persistence: HP, daily goal, onboarding flag |
| `FirestoreService` | CRUD for tasks, quests, HP snapshots |
| `NotificationService` | Schedule reminders, handle permission checks |
| `useAppStore()` | Global state: daily goal, current HP (consumed by hooks) |

---

## Known Issues & QA Fixes

Five items flagged in `QA_FIXES_HANDOFF.md` that still need attention:

1. **Raw hex values** — 3 files still have ~5 inline hex values that should reference `Colors.ts`
2. **Form wiring** — 3 screens need React Hook Form + Zod validation connected
3. **Route typing** — 7 `as any` casts on `router.push()` calls need typed routes
4. **HPBar color** — Should read from `EmberStates.ts` canonical source, not local logic
5. **TODO comment** — One `// TODO` should be `// DEFERRED` per commenting conventions

---

## Existing Documentation

| File | What It Covers |
|------|----------------|
| `COMMENTING_CONVENTIONS.md` | Status tags, inline tags, file header template |
| `EMBER_BEST_PRACTICES.md` | Layer rules, patterns, naming |
| `Ember_Kaley_QA.md` | 100-item QA checklist across all UI work |
| `EMBER_EXPO_GO_QA.md` | Compiler checks, render testing, common errors |
| `QA_FIXES_HANDOFF.md` | 5 high-priority fixes (details above) |

---

## How to Run

```bash
npm install
npx expo start
# Scan QR with Expo Go on your device
```

---

## Asset Note

The ember sprite images in `assets/images/` (ember-thriving.png, ember-steady.png, ember-strained.png, ember-flickering.png) are **0-byte placeholders**. Real assets need to be dropped in before final QA. The `EmberCreature` component will pick them up automatically by state name.

---

## Next Milestone

Once Josh's hooks and Aaron's services land, I'll:
1. Swap all stub data for real hook calls
2. Run the full `EMBER_EXPO_GO_QA.md` checklist
3. Fix any remaining items from `Ember_Kaley_QA.md`
4. Polish navigation (tab persistence, deep links)
5. Final screen-by-screen render test on device
