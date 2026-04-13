# Ember — Session Report

**Date:** April 12, 2026
**Branch:** `branch-kaley`
**Owner:** Kaley
**Session goal:** Complete all actionable items from Kaley's workload in the Revised Build Timeline

---

## Summary

This session reviewed the full build plan (Waves 1-4), audited the existing codebase, and completed all Kaley-owned tasks that were not blocked on Aaron or Josh. Additionally, a full auth flow (login/signup) was created and an in-depth QA test plan was written and executed.

---

## Work Completed

### 1. Firestore: `updateQuest()` added + quest screens wired

**Files changed:**
- `services/FirestoreServices.ts` — added `updateQuest(userId, questId, updates)` function
- `app/(tabs)/quests/index.tsx` — quest toggle now calls `updateQuest()` to persist completion to Firestore
- `app/(tabs)/quests/[id].tsx` — "Mark as Complete" button now writes to Firestore and navigates back to quest list

**Why:** Quest Board and Quest Detail both had `console.log` stubs for completion. The `updateQuest` function was missing entirely from FirestoreServices.

---

### 2. `createQuest()` wired in Add Quest screen

**Files changed:**
- `app/(tabs)/add-quest.tsx` — `onSubmit` now calls `createQuest()` with form data mapped to Firestore schema (title, description, hpReward, cadence, recurrenceRule)

**Why:** The `createQuest` function existed in FirestoreServices but was never called from the UI. The save button only logged to console.

---

### 3. Navigation polish — SafeAreaView + back buttons

**Files changed:**
- `app/(tabs)/index.tsx` — wrapped in `SafeAreaView` with `edges={["top"]}`
- `app/(tabs)/profile.tsx` — wrapped in `SafeAreaView`
- `app/(tabs)/add-quest.tsx` — wrapped in `SafeAreaView`
- `app/(tabs)/quests/index.tsx` — wrapped in `SafeAreaView`
- `app/(tabs)/quests/[id].tsx` — wrapped in `SafeAreaView`, added back button with Ionicons arrow, header made row layout
- `app/(tabs)/tasks/index.tsx` — added back button with Ionicons arrow, header made row layout
- `app/(tabs)/tasks/[id].tsx` — added back button with Ionicons arrow, header made row layout

**Why:** Multiple screens had content rendering behind the Android status bar. Sub-screens (task edit, task list, quest detail) had no way to navigate back without the system back gesture.

---

### 4. Onboarding wired to Firestore

**Files changed:**
- `app/(onboarding)/goal-setup.tsx` — `onSubmit` now calls `updateUserProfile(user.uid, { dailyGoal })` to persist the goal
- `app/index.tsx` — entry redirect now checks `useAuth()` for auth state and `useAppStore().onboardingComplete` for profile existence

**Why:** Onboarding was a dead-end stub (only logged to console). The entry redirect was hardcoded to always skip onboarding.

---

### 5. Auth flow — Login & Signup screens (NEW)

**Files created:**
- `app/(auth)/_layout.tsx` — Stack layout for auth route group (no tabs, no header)
- `app/(auth)/login.tsx` — Login screen with email/password form
- `app/(auth)/signup.tsx` — Signup screen with name/email/password/confirm password form

**Files changed:**
- `app/index.tsx` — now gates on auth state: no user -> login, no profile -> onboarding, otherwise -> tabs

**Design details:**
- Both screens use `react-hook-form` + `zod` for validation (same pattern as all other forms)
- Zod schemas validate email format, password length (6+), and password confirmation match
- Firebase auth errors displayed in a styled error box below the form
- Submitting state shows spinner text ("Signing in..." / "Creating account...")
- Login and Signup link to each other via `router.replace()`
- Full design system compliance: dark purple cards, amber accents, caps-tracked labels, bgInput fields, SafeAreaView, KeyboardAvoidingView

**Auth gate flow:**
```
App launch
  -> Loading spinner (auth + profile loading)
  -> No user? -> /(auth)/login
  -> User exists, no profile? -> /(onboarding)/goal-setup
  -> User + profile? -> /(tabs)
```

---

### 6. Quest Detail — "Mark as Complete" button improved

**File changed:**
- `app/(tabs)/quests/[id].tsx` — button changed from `variant="secondary"` to `variant="primary"`, label changes to "Completed" when done, navigates to quest list after marking complete

---

## QA Test Plan & Execution

**File created:** `QA.md` — 16-section comprehensive test plan covering:
- Build & compilation (TypeScript, Metro, Expo export)
- Auth flow (login, signup, auth gate routing)
- Every screen (Home, Tasks, Quests, Add Quest, Profile, Onboarding)
- Tab navigation
- Design consistency
- Expo Go smoke test checklist

### Automated QA Results

| Check | Result |
|---|---|
| TypeScript compilation (`tsc --noEmit`) | PASS — 0 errors |
| Android bundle (`expo export --platform android`) | PASS |
| Route files | 18/18 exist |
| Component files | 15/15 exist |
| Hooks & services | 17/17 exist |
| Sprite assets | 7/7 exist |
| Zod validation on form screens | 5/5 |
| SafeAreaView on screens | 11/11 |
| Firestore writes wired | createQuest (1), updateQuest (2), updateTask (2), updateUserProfile (2) |
| Auth guard (useAuth) | 10 screen files |
| Dependencies in package.json | 8/8 present |

---

## Files Changed — Full Inventory

### New files (3 app screens + QA doc)
| File | Purpose |
|---|---|
| `app/(auth)/_layout.tsx` | Auth route group layout |
| `app/(auth)/login.tsx` | Login screen |
| `app/(auth)/signup.tsx` | Signup screen |
| `QA.md` | Comprehensive QA test plan |

### Modified files (11 screens + 1 service)
| File | What changed |
|---|---|
| `services/FirestoreServices.ts` | Added `updateQuest()` function |
| `app/index.tsx` | Auth gate: checks user + profile before routing |
| `app/(onboarding)/goal-setup.tsx` | Wired to save dailyGoal to Firestore |
| `app/(tabs)/index.tsx` | Added SafeAreaView |
| `app/(tabs)/profile.tsx` | Added SafeAreaView |
| `app/(tabs)/add-quest.tsx` | Wired createQuest(), added SafeAreaView |
| `app/(tabs)/quests/index.tsx` | Wired updateQuest() for toggle, added SafeAreaView |
| `app/(tabs)/quests/[id].tsx` | Wired updateQuest() for mark complete, added back button, SafeAreaView |
| `app/(tabs)/tasks/index.tsx` | Added back button |
| `app/(tabs)/tasks/[id].tsx` | Added back button |

---

## Known Issues & Blockers

### Blocking: Firebase `.env` not configured
The app requires a `.env` file with Firebase credentials to run. Without it, all Firestore/Auth calls fail with "invalid api key". Required variables:
```
EXPO_PUBLIC_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

### Medium: `useAppStore` is not a global store
`store/useAppStore.ts` is a plain React hook — each component that calls it gets isolated state. Changing `dailyGoal` on Profile does not update Home until the component remounts. **Fix:** Convert to Zustand store or React Context.

### Low: QuestCadence type mismatch
FirestoreServices uses lowercase cadence values (`"daily"`, `"weekly"`), while UI types use capitalized (`"Daily"`, `"Weekly"`). The hooks normalize with `normalizeCadence()`, and `add-quest.tsx` uses `.toLowerCase() as any`. Functional but fragile.

### Blocked on teammates
| Item | Blocked on |
|---|---|
| HPTrendChart (placeholder, no chart lib) | Chart library decision |
| Notification system (banner, scheduling, deep links) | Aaron D11/D12 |
| HP snapshot writes (Evolution Log / streak empty) | Aaron D9 |
| Offline/AsyncStorage fallback | Aaron D3/D10 |
| Start date picker on Add Quest | DateTimePicker lib install |

---

## Build Plan Status (Kaley's Tasks)

| Task | Wave | Status |
|---|---|---|
| Types: `ember.ts`, `task.ts`, `quest.ts`, `index.ts` | 1 | Done (pre-session) |
| Constants: `Colors`, `Typography`, `Spacing`, `EmberStates` | 1 | Done (pre-session) |
| U9: Onboarding screen | 2 | Done — now wired to Firestore |
| U6: Task list screen | 2 | Done — back button added |
| U4: Quest Board screen | 2 | Done — toggle wired to Firestore |
| U5: Quest detail screen | 2 | Done — mark complete wired |
| U10: Notification banner | 2 | Done (blocked on D12 for real permission check) |
| UI primitives (Card, Button, Badge, HPBar, NotificationBanner) | 2 | Done (pre-session) |
| U3: Creature state animations | 3 | Done (pre-session) |
| U1: Home screen wired to useEmber() | 3 | Done — SafeAreaView added |
| U2: Daily Spark card + Bonfire indicator | 3 | Done (pre-session) |
| U7: Task edit + HP cost calculator | 3 | Done — back button added |
| Feature components (EmberCreature, DailySparkCard, etc.) | 3 | Done (pre-session) |
| U8: Profile screen | 4 | Done — SafeAreaView added |
| Profile components (HPTrendChart, StreakDisplay, EvolutionLog) | 4 | Done (pre-session) |
| Swap stub hooks for real implementations | 4 | Done (pre-session, hooks are real) |
| Navigation polish | 4 | Done this session |
| Visual consistency pass | 4 | Done this session |
| **Auth flow (login/signup)** | **New** | **Done this session** |
| **QA test plan** | **New** | **Done this session** |

---

## Next Steps

1. **Create `.env` file** with Firebase project credentials to unblock all runtime testing
2. **Expo Go smoke test** — run through Section 16 of QA.md once Firebase is configured
3. **Convert `useAppStore` to a global store** (Zustand or Context) to fix isolated state bug
4. **Coordinate with Aaron** on D9 (HP snapshots), D11/D12 (notifications) to unblock remaining features
5. **Choose and install a chart library** for HPTrendChart (react-native-chart-kit or victory-native)
