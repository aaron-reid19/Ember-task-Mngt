# Kaley's UI Layer Handoff

**Author:** Kaley Wood
**Date:** 2026-04-13
**Branch:** `branch-kaley`

---

## Summary

The entire UI layer for Ember is complete. All screens, components, types, constants, and navigation are built and rendering with real Firestore data. Authentication (email/password), onboarding, and the HP system are fully wired end-to-end.

---

## What's New Since Last Handoff (Apr 7 → Apr 13)

### Authentication System (New)

Full email/password auth flow built from scratch:

| File | What it does |
|------|-------------|
| `app/(auth)/login.tsx` | Login screen with email/password form, show/hide password toggle, demo account button |
| `app/(auth)/signup.tsx` | Signup screen with first/last name, email, password + confirm, show/hide toggle |
| `app/(auth)/_layout.tsx` | Auth stack layout (no header) |
| `services/firebaseAuth.ts` | `signup()`, `login()`, `loginWithGoogle()`, `logout()`, `subscribeToAuth()` — all with user-friendly error messages |
| `services/firebaseConfig.ts` | Firebase app initialization from env vars |
| `store/authContext.tsx` | `AuthProvider` + `useAuth()` hook — wraps app, provides user state and auth methods |

**Key details:**
- Signup auto-falls back to login if email already exists (handles half-created accounts)
- Firestore profile sync is best-effort — auth succeeds even if Firestore hiccups
- Friendly error messages replace raw Firebase error codes (e.g. "An account with this email already exists. Try signing in instead.")
- Demo account: `demo@ember.app` / `demo1234` — self-provisioning via "Skip — use demo account" button on login screen

### HP Formula Change (Breaking)

**Old formula:** `HP = (completed task count / dailyGoal) × 100`
**New formula:** `HP = (sum of completed task hpCosts / sum of all task hpCosts) × 100`

HP is now driven by per-task `hpCost` values. Adding a 30 HP task drops Ember's health more than adding a 5 HP task. Completing heavy tasks gives a bigger boost. No tasks on the board = 100 HP.

See `documentation/JOSH_HP_HANDOFF.md` for the full migration details for Josh.

### `dailyGoal` Removed

`dailyGoal` was orphaned after the HP formula change (nothing consumed it). Fully stripped from:
- Onboarding screen (no longer asks for a goal)
- Profile screen (goal config card removed)
- `useAppStore` (no longer tracks it)
- `FirestoreServices` (no longer stored or accepted)
- `UserProfileInput` type

Existing Firestore documents may still have a `dailyGoal` field — it's harmless, just ignored.

### Onboarding Simplified

The onboarding screen is now a welcome page that explains the HP system and marks `onboardingComplete: true` in Firestore. No goal picker. Back button logs out and returns to login.

### Routing & Navigation

| Route | When |
|-------|------|
| `app/index.tsx` | Entry point — checks auth + onboarding, redirects accordingly |
| Not signed in | → `/(auth)/login` |
| Signed in, not onboarded | → `/(onboarding)/goal-setup` |
| Signed in + onboarded | → `/(tabs)` |
| Login/signup success | → `/` (index handles routing) |
| Onboarding back button | → logout + `/(auth)/login` |

### Firestore Profile

`createUserProfile()` now initializes:
- `currentHP: 100`
- `emberState: "thriving"`
- `bonfireActive: false`
- `onboardingComplete: false`
- `displayName`, `email`, `photoURL` from auth

### Component Updates

- `HPCostCalculator` — added optional `label` and `showBadge` props (defaults preserve existing behavior)
- `Button` — unchanged, `primary` and `secondary` variants used across auth screens

---

## What Was Built (Complete List)

### Screens (9 total)

| Screen | Route | Status |
|--------|-------|--------|
| Home | `(tabs)/index.tsx` | Complete — real data via `useEmber()`, `useTasks()`, `useStreak()` |
| Quest Board | `(tabs)/quests/index.tsx` | Complete — real data |
| Quest Detail | `(tabs)/quests/[id].tsx` | Complete — real data |
| Task List | `(tabs)/tasks/index.tsx` | Complete — real data |
| Task Edit | `(tabs)/tasks/[id].tsx` | Complete — real data |
| Profile | `(tabs)/profile.tsx` | Complete — real data, goal config removed |
| Onboarding | `(onboarding)/goal-setup.tsx` | Complete — welcome screen, no goal picker |
| Login | `(auth)/login.tsx` | **New** — email/password + demo login |
| Signup | `(auth)/signup.tsx` | **New** — first/last name + email/password |

### Components (16 total)

**Base Primitives** (`components/ui/`)
- `Card.tsx` — Dark purple container with border and padding
- `Button.tsx` — Pill-shaped, primary (amber) and secondary (transparent) variants
- `Badge.tsx` — Small pill label, default and outlined variants
- `HPBar.tsx` — Animated fill bar, color driven by EmberState
- `NotificationBanner.tsx` — Floating permission alert (stub, always hidden)

**Ember** (`components/ember/`)
- `EmberCreature.tsx` — Creature sprite with scale/opacity animations per HP state
- `DailySparkCard.tsx` — Spark task card with completion button
- `BonfireIndicator.tsx` — Celebration overlay when HP=100 + Spark done

**Tasks** (`components/tasks/`)
- `TaskListItem.tsx` — Task row: checkbox, name, HP cost
- `HPCostCalculator.tsx` — Stepper with +/- buttons, optional label/badge

**Quests** (`components/quests/`)
- `QuestCard.tsx` — Quest row: checkbox, name, cadence badge, HP, status
- `QuestFilterTabs.tsx` — Horizontal cadence filter (Once/Daily/Weekly/etc.)

**Profile** (`components/profile/`)
- `HPTrendChart.tsx` — Line chart with weekly/monthly toggle (stub data)
- `StreakDisplay.tsx` — Current streak counter
- `EvolutionLog.tsx` — Timeline of state changes

### Services & Store

| File | Purpose |
|------|---------|
| `services/firebaseConfig.ts` | Firebase app init from env vars |
| `services/firebaseAuth.ts` | Auth functions with friendly errors |
| `services/FirestoreServices.ts` | CRUD for profiles, tasks, quests, HP snapshots |
| `store/authContext.tsx` | Auth state provider + `useAuth()` hook |
| `store/useAppStore.ts` | Profile state: `onboardingComplete`, `currentHP`, `loading` |

### Hooks (Logic Layer)

| Hook | Returns | Used By |
|------|---------|---------|
| `useEmber()` | `{ hp, state, isBonfire }` | Home, Quest Board, Task List, Profile |
| `useTasks()` | `Task[]` | Home, Task List, useEmber |
| `useTask(id)` | `Task` | Task Edit |
| `useQuests(cadence?)` | `Quest[]` | Quest Board |
| `useQuest(id)` | `Quest` | Quest Detail |
| `useDailySpark()` | `{ spark, onComplete }` | Home (DailySparkCard) |
| `useStreak()` | `{ current }` | Home, Profile |
| `useHPHistory()` | `{ snapshots }` | Profile (HPTrendChart) |

### Types (`types/`)

All type contracts exported from `types/index.ts`:

- **`ember.ts`** — `EmberState`, `HPData`, `HPSnapshot`
- **`task.ts`** — `Task`, `TaskPriority`, `TaskTag`
- **`quest.ts`** — `Quest`, `QuestCadence`, `WeekDay`

### Constants (`constants/`)

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
8. **File headers on every file** — Block comment with owner, status, dependencies, notes.

---

## HP System (Current)

**Formula:** `HP = (sum of completed task hpCosts / sum of all task hpCosts) × 100`

| Scenario | HP |
|----------|-----|
| No tasks | 100 (Ember is happy) |
| All tasks completed | 100 (Bonfire eligible) |
| Some tasks completed | Weighted ratio based on hpCost |

**State classification** (unchanged from original spec):
- Thriving: 80–100 HP
- Steady: 50–79 HP
- Strained: 20–49 HP
- Flickering: 0–19 HP

**Bonfire Mode:** `hp === 100 AND isDailySparkComplete`

---

## What Josh Needs to Know

See `documentation/JOSH_HP_HANDOFF.md` for the full breakdown. Key points:

- `calculateHP()` signature changed: `(completedHP, totalHP)` instead of `(completedTasks, dailyGoal)`
- `calculateTaskHP()` removed (no imports existed)
- `classifyHP()` and `checkBonfire()` untouched
- `useEmber()` return shape unchanged — all consumers work as-is

---

## What Aaron Needs to Build (Data Layer)

| Service/Store | Purpose |
|---------------|---------|
| `NotificationService` | Schedule reminders, handle permission checks |
| D9: HP snapshot writes | Daily HP snapshot to Firestore for trend chart |
| D12: Notification permission | Permission check for `NotificationBanner` in root layout |

---

## Known Issues & QA Status

Last full QA pass: Apr 13, 2026.

- Auth flow: validated — Zod/Firebase aligned, navigation correct, error handling complete
- HP formula: validated — zero `dailyGoal` references remaining, all edge cases handled
- `loginWithGoogle()` exported but no UI button — incomplete feature, not a regression
- Ember sprite images in `assets/images/` are 0-byte placeholders — real assets needed

---

## Documentation

| File | What It Covers |
|------|----------------|
| `JOSH_HP_HANDOFF.md` | HP formula change details for Josh |
| `COMMENTING_CONVENTIONS.md` | Status tags, inline tags, file header template |
| `EMBER_BEST_PRACTICES.md` | Layer rules, patterns, naming |
| `Ember_Kaley_QA.md` | 100-item QA checklist across all UI work |
| `EMBER_EXPO_GO_QA.md` | Compiler checks, render testing, common errors |
| `QA_FIXES_HANDOFF.md` | 5 high-priority fixes from earlier QA |

---

## How to Run

```bash
npm install
npx expo start
# Scan QR with Expo Go on your device
```

Requires `.env` file with Firebase config (see `services/firebaseConfig.ts` for required keys).
