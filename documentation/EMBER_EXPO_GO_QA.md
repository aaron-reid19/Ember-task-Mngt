# 🔥 Ember — Expo Go Compiler & Render QA
**CPRG-303-C | Group 9 (Shrek Bros) | Kaley's UI Layer Only**
**Kaley Wood · Apr 2026**

> **Scope:** This QA is for running Kaley's completed UI files in Expo Go with stub data only.
> Josh's hooks and Aaron's services are NOT expected to be wired. All data should be hardcoded stubs.
> Goal: confirm every screen and component **renders without error** and **looks right**.

---

### Status Legend
| Symbol | Meaning |
|--------|---------|
| ✅ PASS | Renders correctly — no issues |
| ⚠️ WARN | Visible but needs styling adjustment |
| ❌ FAIL | Crash, blank screen, or render error |
| ⬜ SKIP | Not yet built — skip this check |

---

## Contents
1. [Pre-Flight — Get the App Running](#1-pre-flight--get-the-app-running)
2. [Compiler Errors — Clear These First](#2-compiler-errors--clear-these-first)
3. [Screen Render Checks](#3-screen-render-checks)
4. [Component Render Checks](#4-component-render-checks)
5. [Styling Spot Checks](#5-styling-spot-checks)
6. [Common Render Error Fixes](#6-common-render-error-fixes)
7. [QA Results Table](#7-qa-results-table)

---

## 1. Pre-Flight — Get the App Running

Run these commands before anything else. Don't start ticking boxes until the app is on-screen.

```bash
# 1. Install dependencies (always run after any pull)
npm install

# 2. Clear the Metro cache — fixes most phantom errors
npx expo start --clear

# 3. On your device, open Expo Go and scan the QR code
# OR press 'a' for Android emulator if it's running
```

**If the app won't start at all, check these first:**

| Check | Command | Expected |
|-------|---------|----------|
| No missing packages | `npm install` | No unresolved peer deps |
| TypeScript compiles | `npx tsc --noEmit` | Zero errors |
| No broken imports | `npx expo start --clear` | Metro bundles without red box |

---

## 2. Compiler Errors — Clear These First

Before looking at the screen, clear the red box. Work top-down — fix the first error, re-bundle, repeat.

### 2a. Most Common Red Box Causes in Ember

| Error Message | Most Likely Cause | Fix |
|---------------|-------------------|-----|
| `Text strings must be rendered within a <Text> component` | Raw string or whitespace outside `<Text>` | Wrap the offending string in `<Text>` |
| `Cannot read property 'X' of undefined` | Stub hook returning `undefined` instead of a default value | Add fallback: `const hp = useEmber()?.hp ?? 0` |
| `Element type is invalid` | Named export used as default, or wrong import path | Check `import` — is it `{ Card }` or `import Card`? |
| `Invariant Violation: requireNativeComponent` | Reanimated not rebuilt after install | Run `npx expo start --clear` |
| `Unable to resolve module @/...` | `@/` alias not configured in tsconfig | Check `tsconfig.json` has `"paths": { "@/*": ["./*"] }` |
| `Each child in a list should have a unique "key" prop` | `.map()` without `key` | Add `key={item.id}` to mapped elements |
| `Warning: A component is changing an uncontrolled input` | TextInput missing `value` prop | Add `value={text}` to every `<TextInput>` |
| `StyleSheet.create is not a function` | Wrong import — `StyleSheet` comes from `react-native` | `import { StyleSheet } from 'react-native'` |

### 2b. Reanimated-Specific Errors

| Error | Fix |
|-------|-----|
| `Reanimated 2 failed to create a worklet` | Babel plugin not installed — check `babel.config.js` has `react-native-reanimated/plugin` |
| HPBar animation not running | Check `useSharedValue` and `useAnimatedStyle` are imported from `react-native-reanimated`, not `react-native` |
| Animation runs once then freezes | Ensure `withTiming` or `withSpring` is inside `useAnimatedStyle`, not in a `useEffect` |

### 2c. tsconfig Path Alias Check

Open `tsconfig.json` and confirm this exists:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

If `@/` imports are failing and tsconfig looks right, try: `npx expo start --clear` — Metro sometimes needs a full cache clear to pick up path changes.

---

## 3. Screen Render Checks

Test each screen by navigating to it in Expo Go. Note the result in the QA Results table at the end.

### 3a. Home Screen — `app/(tabs)/index.tsx`

Navigate to: **Home tab (first tab)**

| ID | What to check | Expected |
|----|---------------|----------|
| SCR-01 | Screen loads without red box | ✅ No crash |
| SCR-02 | EmberCreature renders visually | Creature visible at default/stub HP state |
| SCR-03 | HPBar renders with a fill | Bar shows some fill — even if stub value is hardcoded |
| SCR-04 | DailySparkCard renders | Card visible with stub task text |
| SCR-05 | BonfireIndicator is NOT visible | Should be hidden when `isBonfire` is false |
| SCR-06 | No raw text strings outside `<Text>` | Check console — no "Text strings must be rendered" warning |
| SCR-07 | Colors come from constants | No inline hex values (`#FF...`) visible in the JSX |

### 3b. Quests Screen — `app/(tabs)/quests.tsx`

Navigate to: **Quests tab**

| ID | What to check | Expected |
|----|---------------|----------|
| SCR-08 | Screen loads without red box | ✅ No crash |
| SCR-09 | QuestFilterTabs renders horizontally | Filter strip visible across the top |
| SCR-10 | QuestCard list renders with stub data | At least one card visible (even hardcoded) |
| SCR-11 | Tapping a filter tab doesn't crash | Tab switches highlight state — no error |
| SCR-12 | Tapping a quest card navigates to detail | Goes to `quests/[id].tsx` — no crash |

### 3c. Quest Detail Screen — `app/(tabs)/quests/[id].tsx`

Navigate to: **Tap any quest card from the Quests screen**

| ID | What to check | Expected |
|----|---------------|----------|
| SCR-13 | Screen loads without red box | ✅ No crash |
| SCR-14 | Quest detail content renders | Title and description visible with stub data |
| SCR-15 | Back navigation works | Back button / gesture returns to Quests screen |

### 3d. Task List Screen — `app/(tabs)/tasks/index.tsx`

Navigate to: **Tasks tab**

| ID | What to check | Expected |
|----|---------------|----------|
| SCR-16 | Screen loads without red box | ✅ No crash |
| SCR-17 | TaskListItem renders with stub data | At least one task row visible |
| SCR-18 | HP cost preview renders | Cost indicator visible on each task row |
| SCR-19 | Add task button is tappable | No crash on press (can be a stub action) |
| SCR-20 | Tapping a task navigates to edit screen | Goes to `tasks/[id].tsx` — no crash |

### 3e. Task Edit Screen — `app/(tabs)/tasks/[id].tsx`

Navigate to: **Tap any task from the Tasks screen**

| ID | What to check | Expected |
|----|---------------|----------|
| SCR-21 | Screen loads without red box | ✅ No crash |
| SCR-22 | HPCostCalculator renders | + / − stepper visible |
| SCR-23 | Stepper increments/decrements without crash | Tapping + and − updates displayed value |
| SCR-24 | Back navigation works | Returns to Task List |

### 3f. Profile Screen — `app/(tabs)/profile.tsx`

Navigate to: **Profile tab**

| ID | What to check | Expected |
|----|---------------|----------|
| SCR-25 | Screen loads without red box | ✅ No crash |
| SCR-26 | HPTrendChart renders | Chart visible — even with flat/stub data |
| SCR-27 | StreakDisplay renders | Streak count visible |
| SCR-28 | EvolutionLog renders | At least one log entry visible (stub) |
| SCR-29 | Weekly/Monthly toggle switches chart view | No crash on toggle |

### 3g. Onboarding Screen — `app/(onboarding)/goal-setup.tsx`

Navigate to: **Only accessible on first launch OR via direct navigation in development**

> To test in dev: temporarily add a button on the Home screen with `router.push('/(onboarding)/goal-setup')`, or check if Expo Router exposes it via URL bar.

| ID | What to check | Expected |
|----|---------------|----------|
| SCR-30 | Screen loads without red box | ✅ No crash |
| SCR-31 | Goal input renders | Numeric input or stepper visible |
| SCR-32 | Submit button is visible and tappable | No crash — stub action is fine |

---

## 4. Component Render Checks

These are isolated component checks. If a screen crashed, use these to narrow down *which component* is the culprit.

### 4a. UI Primitives — `components/ui/`

| ID | Component | What to check | Expected |
|----|-----------|---------------|----------|
| CMP-01 | `Card.tsx` | Renders with children | Children visible, correct padding and radius |
| CMP-02 | `Button.tsx` | Renders all variants | `primary` and `secondary` both styled differently |
| CMP-03 | `Button.tsx` | `onPress` fires | No crash on tap |
| CMP-04 | `Badge.tsx` | Renders with label + color prop | Label text visible, background matches color prop |
| CMP-05 | `HPBar.tsx` | Renders with `value={50}` | Bar half-filled |
| CMP-06 | `HPBar.tsx` | Renders with `value={0}` | Bar empty — no crash, no negative fill |
| CMP-07 | `HPBar.tsx` | Renders with `value={100}` | Bar full — no overflow |
| CMP-08 | `HPBar.tsx` | Color matches EmberState | Uses `EmberStates.ts` color for given state |
| CMP-09 | `NotificationBanner.tsx` | Hidden when `visible={false}` | Nothing renders — not just invisible |
| CMP-10 | `NotificationBanner.tsx` | Visible when `visible={true}` | Banner floats above content |

### 4b. Ember Creature — `components/ember/`

| ID | Component | What to check | Expected |
|----|-----------|---------------|----------|
| CMP-11 | `EmberCreature.tsx` | Renders for each state | All four states: Thriving / Steady / Strained / Flickering |
| CMP-12 | `EmberCreature.tsx` | No crash with undefined state | Falls back gracefully to a default state |
| CMP-13 | `DailySparkCard.tsx` | Renders with stub task | Task text visible, complete button present |
| CMP-14 | `BonfireIndicator.tsx` | Hidden when `isBonfire={false}` | Nothing visible |
| CMP-15 | `BonfireIndicator.tsx` | Visible when `isBonfire={true}` | Celebration overlay renders |

### 4c. Task Components — `components/tasks/`

| ID | Component | What to check | Expected |
|----|-----------|---------------|----------|
| CMP-16 | `TaskListItem.tsx` | Renders with stub task | Task title and badge visible |
| CMP-17 | `TaskListItem.tsx` | Priority badge color correct | Badge color matches priority level |
| CMP-18 | `HPCostCalculator.tsx` | Renders + and − buttons | Both controls visible |
| CMP-19 | `HPCostCalculator.tsx` | `onCostChange` fires on press | Callback triggered — verify with console.log stub |

### 4d. Quest Components — `components/quests/`

| ID | Component | What to check | Expected |
|----|-----------|---------------|----------|
| CMP-20 | `QuestCard.tsx` | Renders with stub quest | Quest name and cadence visible |
| CMP-21 | `QuestFilterTabs.tsx` | All filter options render | All cadence options visible in strip |
| CMP-22 | `QuestFilterTabs.tsx` | `onSelect` fires on tap | Active tab highlights — no crash |

### 4e. Profile Components — `components/profile/`

| ID | Component | What to check | Expected |
|----|-----------|---------------|----------|
| CMP-23 | `HPTrendChart.tsx` | Renders with stub data array | Chart visible — no crash with flat data |
| CMP-24 | `StreakDisplay.tsx` | Renders with stub streak count | Number visible |
| CMP-25 | `EvolutionLog.tsx` | Renders with stub log entries | At least one entry visible |

---

## 5. Styling Spot Checks

Walk every screen and run this visual checklist. You're looking for anything that looks "off."

| ID | Check | Expected |
|----|-------|----------|
| STY-01 | Colors match Figma / EmberStates | No unexpected greys or defaults |
| STY-02 | No inline hex values visible in any component | All colors imported from `constants/Colors.ts` |
| STY-03 | Safe area padding on all screens | Content not cut off by notch or home bar |
| STY-04 | Typography is consistent | Font sizes from `constants/Typography.ts` — no magic numbers |
| STY-05 | Spacing is consistent | Padding/margin from `constants/Spacing.ts` — no magic numbers |
| STY-06 | Card padding consistent across all cards | QuestCard, TaskListItem, DailySparkCard all feel the same weight |
| STY-07 | Buttons have correct tap target size | At least 44×44pt — nothing too small to tap |
| STY-08 | Tab bar renders correctly | All 4 tabs visible and labeled |
| STY-09 | Active tab is visually distinct | Selected tab clearly highlighted |
| STY-10 | HP bar doesn't overflow its container | Bar fills within bounds at value={100} |
| STY-11 | Android: no shadow rendering issues | Cards have `elevation` instead of iOS shadow props |
| STY-12 | No text overflow / truncation issues | Long task names handled gracefully (ellipsis or wrap) |
| STY-13 | All screens scroll if content overflows | Nothing cut off below the fold |
| STY-14 | Onboarding has no tab bar | `(onboarding)` group should not show the bottom tabs |

---

## 6. Common Render Error Fixes

### "Text strings must be rendered within a `<Text>` component"

```tsx
// ❌ Causes crash — raw string in View
<View>
  Hello world
</View>

// ✅ Fix — wrap in Text
<View>
  <Text>Hello world</Text>
</View>

// ❌ Also causes crash — ternary rendering a string, not a component
<View>
  {isLoading ? "Loading..." : <TaskListItem />}
</View>

// ✅ Fix
<View>
  {isLoading ? <Text>Loading...</Text> : <TaskListItem />}
</View>
```

### Blank screen with no red box (silent render failure)

```tsx
// Most common cause: component returning null unexpectedly
// Add a temp log to confirm the component is mounting:
export default function QuestsScreen() {
  console.log('QuestsScreen mounted'); // remove after confirming
  // ...
}

// Check: are stub hooks returning undefined?
// Fix: add default values to every stub hook return
const useEmber = () => ({
  hp: 75,          // ← always return a value
  state: 'Steady', // ← never return undefined
  isBonfire: false,
});
```

### Safe area content clipping

```tsx
// ❌ Content hides behind notch
<View style={{ flex: 1 }}>
  ...
</View>

// ✅ Fix — wrap with SafeAreaView
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1 }}>
  ...
</SafeAreaView>
```

### HPBar animation not working on first render

```tsx
// ❌ Animates to 0 on mount if initial value not set
const fillWidth = useSharedValue(0);

// ✅ Set initial value to match the prop
const fillWidth = useSharedValue(value); // pass the hp prop here

useEffect(() => {
  fillWidth.value = withTiming(value, { duration: 600 });
}, [value]);
```

### `@/` import resolving incorrectly

```bash
# Clear Metro cache — this fixes most path alias issues
npx expo start --clear
```

---

## 7. QA Results Table

Fill this in as you test. One row per item that fails or warns.

| ID | Screen / Component | Issue Found | Fix Applied | Status |
|----|--------------------|-------------|-------------|--------|
| | | | | |
| | | | | |
| | | | | |

---

*Ember Expo Go Compiler & Render QA · Kaley Wood · CPRG-303-C Group 9 · Apr 2026*
