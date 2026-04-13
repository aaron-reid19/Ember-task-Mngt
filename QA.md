# Ember — QA Test Plan

**Branch:** `branch-kaley`
**Date:** 2026-04-12
**Tester:** Kaley

---

## 1. Build & Compilation

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 1.1 | `npx tsc --noEmit` — zero TypeScript errors | | |
| 1.2 | `npx expo start` launches without crash | | |
| 1.3 | App loads on Android emulator / Expo Go | | |
| 1.4 | No yellow-box warnings on initial load | | |
| 1.5 | No red-screen errors on initial load | | |

---

## 2. Auth Flow — Login Screen `/(auth)/login`

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 2.1 | Unauthenticated user is redirected to login screen on app launch | | |
| 2.2 | "Ember" brand title + "Keep your fire alive" tagline visible | | |
| 2.3 | "Welcome Back" card heading visible | | |
| 2.4 | EMAIL field label styled with caps tracking | | |
| 2.5 | Email input — placeholder "you@example.com" visible | | |
| 2.6 | PASSWORD field label styled with caps tracking | | |
| 2.7 | Password input — placeholder visible, text is obscured | | |
| 2.8 | Submit with empty fields — Zod errors show ("Email is required", "Password must be at least 6 characters") | | |
| 2.9 | Submit with invalid email — Zod error "Enter a valid email." | | |
| 2.10 | Submit with short password (<6 chars) — Zod error shown | | |
| 2.11 | Submit with wrong credentials — Firebase auth error shown in error box | | |
| 2.12 | Submit with valid credentials — spinner text "Signing in..." appears, then redirects to tabs or onboarding | | |
| 2.13 | "Don't have an account? Sign Up" link navigates to signup screen | | |
| 2.14 | Keyboard avoidance — form scrolls up when keyboard opens | | |
| 2.15 | SafeAreaView — no content behind status bar | | |

---

## 3. Auth Flow — Signup Screen `/(auth)/signup`

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 3.1 | "Create Account" card heading visible | | |
| 3.2 | NAME field present with placeholder "Your name" | | |
| 3.3 | EMAIL field present with placeholder | | |
| 3.4 | PASSWORD field present with "At least 6 characters" placeholder | | |
| 3.5 | CONFIRM PASSWORD field present | | |
| 3.6 | Submit with empty fields — all Zod errors show | | |
| 3.7 | Submit with mismatched passwords — "Passwords do not match." error on confirm field | | |
| 3.8 | Submit with valid data — spinner "Creating account..." then redirects to onboarding | | |
| 3.9 | Firebase error (e.g. duplicate email) shown in error box | | |
| 3.10 | "Already have an account? Sign In" link navigates to login | | |
| 3.11 | Keyboard avoidance works | | |
| 3.12 | SafeAreaView — no content behind status bar | | |

---

## 4. Auth Gate & Routing

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 4.1 | Not signed in → redirects to `/(auth)/login` | | |
| 4.2 | Signed in, no profile → redirects to `/(onboarding)/goal-setup` | | |
| 4.3 | Signed in, profile exists → redirects to `/(tabs)` | | |
| 4.4 | Loading state shows ActivityIndicator spinner | | |
| 4.5 | After logout (Profile screen), user returns to login | | |

---

## 5. Onboarding — Goal Setup `/(onboarding)/goal-setup`

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 5.1 | "Welcome to Ember" title in accent color | | |
| 5.2 | HPCostCalculator stepper works (increment/decrement) | | |
| 5.3 | Min value 1, max value 50 enforced | | |
| 5.4 | "Let's Go" saves dailyGoal to Firestore via updateUserProfile | | |
| 5.5 | After confirm, navigates to tabs (no back to onboarding) | | |
| 5.6 | On next app launch, onboarding is skipped | | |

---

## 6. Home Screen `/(tabs)/index`

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 6.1 | "Good Morning, [name]" greeting shows user displayName | | |
| 6.2 | EmberCreature renders without crash for all 4 states | | |
| 6.3 | Status strip shows streak, state, HP pills | | |
| 6.4 | HPBar renders with correct fill color for current state | | |
| 6.5 | BonfireIndicator shows only when HP=100 + spark done | | |
| 6.6 | DailySparkCard shows spark task name + HP value | | |
| 6.7 | DailySparkCard COMPLETE button marks task as done in Firestore | | |
| 6.8 | Today's Progress section shows task count | | |
| 6.9 | Up to 3 TaskListItems rendered | | |
| 6.10 | Task checkbox toggles completion in Firestore | | |
| 6.11 | "See All Today's Tasks" navigates to task list | | |
| 6.12 | SafeAreaView — no content behind status bar | | |
| 6.13 | ScrollView scrolls correctly | | |

---

## 7. Task List Screen `/(tabs)/tasks`

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 7.1 | Back button (arrow) visible, navigates back to Home | | |
| 7.2 | "Tasks" header centered | | |
| 7.3 | HPBar at top shows current HP | | |
| 7.4 | FlatList renders all tasks | | |
| 7.5 | Tapping a task row navigates to task edit `/(tabs)/tasks/[id]` | | |
| 7.6 | Empty state — no crash when 0 tasks | | |
| 7.7 | SafeAreaView padding correct | | |

---

## 8. Task Edit Screen `/(tabs)/tasks/[id]`

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 8.1 | Back button visible, navigates back to task list | | |
| 8.2 | "Edit Task" header centered | | |
| 8.3 | Task name pre-filled from Firestore | | |
| 8.4 | Priority badges (Low/Medium/High) — selected one is full color, others dimmed | | |
| 8.5 | Tapping a priority badge selects it | | |
| 8.6 | HPCostCalculator stepper works | | |
| 8.7 | Save button updates task in Firestore and navigates back | | |
| 8.8 | Zod validation — empty name shows error | | |

---

## 9. Quest Board Screen `/(tabs)/quests`

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 9.1 | "Quest Board" header visible | | |
| 9.2 | QuestFilterTabs render (Once / Daily / Weekly / Monthly / Custom) | | |
| 9.3 | Tapping a filter tab changes displayed quests | | |
| 9.4 | Status strip (streak, state, HP) renders | | |
| 9.5 | HPBar renders | | |
| 9.6 | QuestCards render with name, status, cadence badge, HP pts | | |
| 9.7 | Checkbox toggle updates quest completion in Firestore | | |
| 9.8 | Tapping a quest card navigates to quest detail | | |
| 9.9 | Empty state — no crash when 0 quests for selected cadence | | |
| 9.10 | SafeAreaView padding correct | | |

---

## 10. Quest Detail Screen `/(tabs)/quests/[id]`

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 10.1 | Back button visible, navigates back | | |
| 10.2 | "Quest Details" header centered | | |
| 10.3 | Quest name displayed | | |
| 10.4 | HP cost + HPBar displayed | | |
| 10.5 | Cadence badge shows correct value | | |
| 10.6 | Daily Spark indicator shown only if isDailySpark | | |
| 10.7 | "Mark as Complete" (primary) writes to Firestore and navigates to quest list | | |
| 10.8 | Button shows "Completed" and is disabled after marking complete | | |
| 10.9 | "Back to Dashboard" navigates to home | | |
| 10.10 | Loading state shows "Loading..." text | | |
| 10.11 | Invalid quest ID shows "Quest not found" | | |

---

## 11. Add Quest Screen `/(tabs)/add-quest`

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 11.1 | "Forge New Quest" title visible | | |
| 11.2 | Quest Name input with placeholder | | |
| 11.3 | Description multiline input | | |
| 11.4 | HPCostCalculator stepper (1-50 range) | | |
| 11.5 | Frequency section — pill tabs toggle (Daily/Weekly/Biweekly/Monthly) | | |
| 11.6 | Day selector (M T W T F S S) — tapping toggles selection | | |
| 11.7 | "Save Quest" creates quest in Firestore with correct data | | |
| 11.8 | After save, navigates back | | |
| 11.9 | Zod validation — empty name shows error | | |
| 11.10 | "Discard" navigates back without saving | | |
| 11.11 | SafeAreaView padding correct | | |

---

## 12. Profile Screen `/(tabs)/profile`

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 12.1 | Avatar circle with user initials | | |
| 12.2 | Online dot (green) visible | | |
| 12.3 | User name displayed | | |
| 12.4 | "EMBER'S CURRENT STATE" label + state badge | | |
| 12.5 | Large HP % number in state color | | |
| 12.6 | HPBar renders | | |
| 12.7 | Stats grid: streak, tasks done, quests completed, days tracked | | |
| 12.8 | HP Trend chart shows placeholder or snapshot count | | |
| 12.9 | Week/Month toggle works on HP Trend chart | | |
| 12.10 | Evolution Log shows snapshot history or empty state | | |
| 12.11 | Goal config — HPCostCalculator changes dailyGoal | | |
| 12.12 | Goal change persists to Firestore | | |
| 12.13 | SafeAreaView padding correct | | |

---

## 13. Tab Navigation

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 13.1 | Four tabs visible: Home, Quest Board, Add Quest, Profile | | |
| 13.2 | Tasks tab is hidden (not in tab bar) | | |
| 13.3 | Tab icons render (Ionicons) | | |
| 13.4 | Active tab — white tint | | |
| 13.5 | Inactive tab — muted tint | | |
| 13.6 | Tab bar background is dark (#12082A) | | |
| 13.7 | Switching tabs preserves scroll position | | |

---

## 14. Design Consistency

| # | Check | Pass | Notes |
|---|-------|------|-------|
| 14.1 | All screens use `Colors.bgDeep` (#1A0A2E) background | | |
| 14.2 | All cards use `Colors.bgCard` (#2D1B4E) with border | | |
| 14.3 | All field labels use uppercase + caps tracking | | |
| 14.4 | All inputs use `Colors.bgInput` background | | |
| 14.5 | Primary buttons are amber (#F5A623) with dark text | | |
| 14.6 | Secondary buttons are bgCard with white text | | |
| 14.7 | Error text is red (#E74C3C) | | |
| 14.8 | HP state colors match EmberStates config | | |
| 14.9 | Checkboxes: unchecked=dark ring, checked=amber fill with checkmark | | |
| 14.10 | Font sizes consistent with Typography scale | | |
| 14.11 | Spacing consistent with Spacing scale | | |

---

## 15. Known Limitations (Out of Scope / Blocked)

| Item | Status | Blocked on |
|------|--------|------------|
| HPTrendChart — placeholder only, no chart lib | Deferred | Chart library decision |
| Notification system (banner, scheduling, deep links) | Blocked | Aaron D11/D12 |
| HP snapshot writes | Blocked | Aaron D9 |
| Offline/AsyncStorage fallback | Blocked | Aaron D3/D10 |
| Start date picker on Add Quest | Deferred | DateTimePicker lib |
| Cross-state creature transition animation | Deferred | ADR-001 MVP scope |
| Google Sign-In button on login/signup | Deferred | Google OAuth setup |
| `useAppStore` is not a global store — each call site has isolated state | Bug | Needs Zustand or Context |
| `deleteTask` exported but never called from UI | Unused | No delete task UI exists |
| Quest cadence type mismatch (lowercase Firestore vs capitalized UI) | Fragile | normalizeCadence bridges it |

---

## 16. Expo Go Smoke Test Checklist

Run on a physical device or emulator via Expo Go:

| # | Step | Expected | Pass |
|---|------|----------|------|
| 16.1 | Scan QR code from `npx expo start` | App opens in Expo Go | |
| 16.2 | First load — login screen appears | No crash, login form visible | |
| 16.3 | Create account via signup flow | Account created, redirected to onboarding | |
| 16.4 | Set daily goal on onboarding | Goal saved, tabs appear | |
| 16.5 | Navigate all 4 tabs | Each tab loads without crash | |
| 16.6 | Create a quest via Add Quest tab | Quest appears on Quest Board | |
| 16.7 | Toggle quest completion on Quest Board | Checkbox updates, persists on refresh | |
| 16.8 | Open Quest Detail, mark complete | Button disables, navigates back | |
| 16.9 | Go to Home, check "See All Tasks" | Task list loads | |
| 16.10 | Tap a task, edit and save | Changes persist | |
| 16.11 | Go to Profile, change daily goal | Goal updates | |
| 16.12 | Kill and reopen app | Still logged in, data persists | |
| 16.13 | Logout (if available) then reopen | Login screen appears | |
