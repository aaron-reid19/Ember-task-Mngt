# 🔥 Ember

A creature productivity app. Your virtual companion's appearance reflects how you're following through on tasks — not as punishment, but as an honest mirror.

**Course:** CPRG-303-C · **Group:** 9 (Shrek Bros)  
**Team:** Kaley Wood (UI) · Joshua Couto (Logic) · Aaron Reid (Data)

---

## Getting started
```bash
npm install
npx expo start
```

Press `a` for Android emulator, or scan the QR code with Expo Go.

<<<<<<< HEAD
See Wiki for more information 
=======
---

## How the app works

During onboarding the user picks a daily task goal — say, 5 tasks. That number becomes the denominator in the HP formula:

```
HP = (Completed Tasks ÷ Daily Goal) × 100
```

Every task you add costs HP. Every task you complete gives it back. The goal is to end the day at 100%.

One task each day is randomly picked as the **Daily Spark** — completing it gives bonus HP. If you hit 100% HP *and* complete the Spark, **Bonfire Mode** triggers and Ember goes full celebration mode.

### Ember's four states

| State      | HP       | What it looks like               |
| ---------- | -------- | -------------------------------- |
| Thriving   | 80–100% | Bright, energetic, fully glowing |
| Steady     | 50–79%  | Calm and present                 |
| Strained   | 20–49%  | Dimmer, slower                   |
| Flickering | 0–19%   | Barely lit                       |

> Ember never dies. It reflects where you are, not what you've failed at.

### Notifications

| Name                   | When                | What it does                                |
| ---------------------- | ------------------- | ------------------------------------------- |
| Morning Daily Briefing | Morning             | Shows current HP and any tasks carried over |
| Daily Spark            | Midday (randomised) | Surfaces today's Spark task                 |
| Midnight Reckoning     | Midnight            | Reminds about incomplete tasks              |

---

## Tech stack

| Layer         | What we're using                                        |
| ------------- | ------------------------------------------------------- |
| Framework     | React Native + Expo (managed workflow)                  |
| Language      | TypeScript                                              |
| Navigation    | Expo Router (file-based, works like Next.js App Router) |
| Animations    | react-native-reanimated                                 |
| Local storage | AsyncStorage — holds current HP and visual state only  |
| Cloud storage | Firebase Firestore — tasks, quests, history, streaks   |
| Notifications | expo-notifications                                      |

---

## Folder structure

> The one rule that matters most: `app/` is routes only. Expo Router turns every file inside it into a screen automatically. Components, hooks, services, and constants all live outside `app/`.

```
ember-task-mngt/
│
├── app/                          # Screens only — every file here is a route
│   ├── _layout.tsx               # Root layout: loads fonts, wraps app in SafeAreaProvider
│   ├── +not-found.tsx            # Shown when a route doesn't exist
│   │
│   ├── (onboarding)/             # Shown on first launch only — no tab bar
│   │   └── goal-setup.tsx        # Where the user sets their daily task goal
│   │
│   └── (tabs)/                   # The main app — four-tab layout
│       ├── _layout.tsx           # Sets up the tab bar: icons, labels, colours
│       ├── index.tsx             # Home screen
│       ├── quests.tsx            # Quest Board
│       ├── profile.tsx           # Profile + history
│       │
│       ├── tasks/                # Tasks tab has a nested stack (list + edit)
│       │   ├── _layout.tsx       # Configures the stack navigator
│       │   ├── index.tsx         # Task list screen
│       │   └── [id].tsx          # Task edit screen — dynamic route by task ID
│       │
│       └── quests/               # Quests tab also has a nested stack
│           ├── _layout.tsx
│           └── [id].tsx          # Quest detail screen — dynamic route by quest ID
│
├── components/                   # Everything visual that isn't a screen
│   │
│   ├── ui/                       # Base building blocks — used across the whole app
│   │   ├── Card.tsx              # Styled container: consistent padding + border radius
│   │   ├── Button.tsx            # Tappable button — accepts label, onPress, variant
│   │   ├── Badge.tsx             # Small coloured label — used for priority + tags
│   │   ├── HPBar.tsx             # The animated HP bar — takes a number, draws the fill
│   │   └── NotificationBanner.tsx  # In-app alert shown when notification permission is off
│   │
│   ├── ember/                    # Everything related to the creature
│   │   ├── EmberCreature.tsx     # The creature itself — takes a state, shows the right sprite + animation
│   │   ├── EmberAnimations.tsx   # Reanimated logic used internally by EmberCreature (not used by screens)
│   │   ├── DailySparkCard.tsx    # The card showing today's Spark task — uses Card + Button inside
│   │   └── BonfireIndicator.tsx  # Celebration overlay — only appears when Bonfire Mode is active
│   │
│   ├── tasks/                    # Components that live on the task screens
│   │   ├── TaskListItem.tsx      # One row in the task list — uses Card + Badge inside
│   │   └── HPCostCalculator.tsx  # The + / − stepper on the task edit screen
│   │
│   ├── quests/                   # Components that live on the quest screens
│   │   ├── QuestCard.tsx         # One row in the quest list — uses Card inside
│   │   └── QuestFilterTabs.tsx   # The horizontal tab strip: Today / Daily / Weekly / etc.
│   │
│   └── profile/                  # Components that live on the profile screen
│       ├── HPTrendChart.tsx      # Line chart of HP history — handles weekly/monthly toggle itself
│       ├── StreakDisplay.tsx      # Shows current streak count
│       └── EvolutionLog.tsx      # Timeline of how Ember's state has changed
│
├── constants/                    # Theme values — import from here, never write hex or font sizes inline
│   ├── Colors.ts                 # Every colour in the app
│   ├── Typography.ts             # Font sizes and weights
│   ├── Spacing.ts                # Spacing scale: 4 / 8 / 12 / 16 / 24 / 32
│   └── EmberStates.ts            # HP thresholds and the colour that goes with each state
│
├── hooks/                        # Business logic — Josh's layer
│   ├── useEmber.ts               # Returns current HP, creature state, and Bonfire flag
│   ├── useDailySpark.ts          # Returns today's Spark task and handles completion
│   ├── useTasks.ts               # Returns the full task list from Firestore
│   ├── useTask.ts                # Returns a single task by ID
│   ├── useQuests.ts              # Returns quests filtered by the cadence you pass in
│   ├── useQuest.ts               # Returns a single quest by ID
│   ├── useStreak.ts              # Returns the current streak number
│   └── useHPHistory.ts           # Returns HP snapshot history for the chart
│
├── services/                     # Storage + external integrations — Aaron's layer
│   ├── AsyncStorageService.ts    # Reads and writes current HP and visual state to the device
│   ├── FirestoreService.ts       # All Firestore reads and writes: tasks, quests, HP snapshots
│   ├── NotificationService.ts    # Schedules the three daily notifications
│   └── HPSyncService.ts          # Writes to AsyncStorage first, then syncs to Firestore async
│
├── store/                        # App-wide shared state — Aaron's layer
│   └── useAppStore.ts            # Holds HP value and daily goal so all tabs can read them
│
├── types/                        # TypeScript interfaces — written before anything else
│   ├── index.ts                  # Barrel export: import { Task } from '@/types'
│   ├── ember.ts                  # EmberState, HPData, HPSnapshot
│   ├── task.ts                   # Task, TaskPriority, TaskTag
│   └── quest.ts                  # Quest, QuestCadence
│
└── assets/
    ├── images/                   # Ember sprites for each state, background images
    ├── fonts/
    └── animations/               # Lottie JSON files if used for creature animations
```

---

## Screens

Screens live in `app/` and act as coordinators. They call hooks to get data, then pass that data down to components as props. They never animate, calculate, or read from storage directly.

---

### Home `app/(tabs)/index.tsx`

The first thing the user sees every time they open the app. Ember sits front and centre in its current state, with the HP bar underneath. The Daily Spark card is below that — it shows the one task the user should focus on today for bonus HP. If Bonfire Mode is active, a full-screen indicator replaces the normal background.

This screen calls `useEmber()` to get three things: the HP number, the current state label (e.g. `"Steady"`), and a `isBonfire` boolean. It calls `useDailySpark()` to get today's Spark task. Both come from Josh. The screen just receives those values and passes them down as props.

**What each component does here:**

- `EmberCreature` gets the state label, picks the right sprite, and drives its own Reanimated animation. `EmberAnimations` runs inside it — the screen never touches it directly.
- `HPBar` gets the HP number and animates the bar width. That's all it does — it has no idea the number came from AsyncStorage.
- `DailySparkCard` gets the spark task object and renders the task name with a completion button. It uses `Card` and `Button` internally.
- `BonfireIndicator` only renders when `isBonfire` is `true`. It has no sub-components.

---

### Quests `app/(tabs)/quests.tsx`

The Quest Board. Today's quests appear at the top. Below that, recurring quests are grouped by cadence — the user taps a filter tab to switch between Today, Daily, Weekly, Biweekly, Monthly, and Custom. Tapping any quest card pushes into the detail screen.

The selected filter tab is held in local `useState` on this screen — that's a UI decision, not a data one. The screen passes the selected filter into `useQuests(filter)` which returns the matching list from Firestore.

**What each component does here:**

- `QuestFilterTabs` gets the currently selected filter and an `onSelect` callback. It renders the tab strip and fires the callback when the user taps. It doesn't decide which quests to show — it just tells the screen what was tapped.
- `QuestCard` gets a single quest object and renders one row. It uses `Card` as its container internally. It fires an `onPress` callback up to the screen, which handles the navigation push.

---

### Quest detail `app/(tabs)/quests/[id].tsx`

Pushed onto the stack when the user taps a quest card. Shows the full quest: name, description, HP value, recurrence settings, and a completion button. The back button returns to the Quest Board without leaving the Quests tab — that's what the nested stack is for.

Calls `useQuest(id)` to fetch the specific quest. When the user marks it complete, the screen calls `FirestoreService.completeQuest()` which writes the HP restoration.

---

### Tasks `app/(tabs)/tasks/index.tsx`

The full task list. Each row shows the task name, priority level, any tags, and a preview of the HP cost. Tapping a row pushes into the edit screen.

Calls `useTasks()` for the list and `useEmber()` for current HP — the live HP number is shown alongside the task list so the user can see how their current state connects to what's pending.

**What each component does here:**

- `TaskListItem` gets a single task object and renders the full row including priority, tags, and HP cost. It uses `Card` as its container and `Badge` for the priority and tag labels. It fires `onPress` up to the screen for navigation.
- `Badge` is used inside `TaskListItem` — the screen doesn't render `Badge` directly here.

---

### Task edit `app/(tabs)/tasks/[id].tsx`

Pushed when the user taps a task. The user can edit the name, priority, tags, and HP cost. All form values are held in local `useState` on this screen. When the user saves, the screen calls `FirestoreService.updateTask()` with the updated values — Aaron's service handles the actual write.

**What each component does here:**

- `HPCostCalculator` gets the current cost value and an `onCostChange` callback. It owns the + / − interaction entirely — the screen just holds the number in state and updates it when the callback fires.
- `Badge` is used here for the priority selector.
- `Button` triggers the save action.

---

### Profile `app/(tabs)/profile.tsx`

The long-term view. HP trend chart with a weekly/monthly toggle, current streak count, and the evolution log showing how Ember's state has shifted over time.

This is the one screen that can't show real content until Aaron's `D9` task (daily HP snapshot writes) is working. Calls `useStreak()` for the streak count and `useHPHistory(range)` for the chart data.

**What each component does here:**

- `HPTrendChart` gets an array of `HPSnapshot` objects. It handles the weekly/monthly toggle itself with internal `useState` — the screen just passes the full history and doesn't need to know which range is active.
- `StreakDisplay` gets the streak number from `useStreak()` and renders it.
- `EvolutionLog` gets the HP history and renders a timeline of creature state changes.

---

### Notification banner `app/_layout.tsx` (root level)

`NotificationBanner` is not tied to any single screen. It lives in the root layout and floats above all tabs when notification permission has been denied. The root layout checks permission status on mount and conditionally renders the banner.

---

### Onboarding `app/(onboarding)/goal-setup.tsx`

Shown once, on first launch. The user picks their daily task goal using a stepper and confirms it. That number gets saved as the denominator in the HP formula.

On save, the screen calls `router.replace('/(tabs)')` — this replaces the navigation stack entirely so the user lands on Home and the back button no longer goes back to onboarding.

This screen has no tab bar because `(onboarding)` has its own layout file separate from `(tabs)`.

---

## How components connect to each other

The folder tree shows what files exist. This maps how they actually relate.

### `components/ui/` is the base layer

Everything else builds on top of these four primitives.

`Card` is a styled container: consistent padding, background colour, and border radius. Screens don't render `Card` directly — `DailySparkCard`, `QuestCard`, and `TaskListItem` all use it internally as their visual shell. Changing `Card` changes the look of all three at once.

`Button` is used by `DailySparkCard` (complete the Spark), the task edit screen (save), and the onboarding screen (confirm goal). It accepts a `label`, an `onPress` callback, and an optional `variant` prop for primary vs secondary styling.

`Badge` is used inside `TaskListItem` for priority and tag labels, and in the task edit screen for the priority selector. It takes a `label` and a `color` from `constants/Colors.ts`.

`HPBar` is rendered directly by the Home screen. Nothing wraps it.

`NotificationBanner` is rendered by the root layout, not any screen.

---

### `components/ember/` — how the creature works

`EmberCreature` is what the Home screen renders. It takes a `state` prop and internally calls `EmberAnimations` to drive the Reanimated transitions. `EmberAnimations` is never imported by a screen — it only exists inside `EmberCreature`. Think of it as the engine, not a component you place yourself.

`DailySparkCard` uses `Card` as its outer shell and `Button` for the completion action. The Home screen renders it alongside `EmberCreature`.

`BonfireIndicator` renders only when `isBonfire` is `true`. It has no sub-components and the Home screen renders it conditionally.

---

### `components/tasks/` and `components/quests/`

`TaskListItem` uses `Card` as its container and `Badge` for labels. The task list screen renders these inside a `FlatList` — one per task.

`HPCostCalculator` is self-contained. No sub-components. The task edit screen renders it, passes in the current value, and listens to `onCostChange`.

`QuestCard` uses `Card` as its container. The quests screen renders these inside a `FlatList`. It fires `onPress` up to the screen, which calls `router.push`.

`QuestFilterTabs` is self-contained. Rendered at the top of the quests screen. Fires `onSelect` up to the screen.

---

### `components/profile/`

All three profile components get their data as props from the Profile screen. None of them read from Firestore directly.

`HPTrendChart` handles its own weekly/monthly toggle with internal `useState`. The screen passes the full history array and doesn't track the active range.

`StreakDisplay` and `EvolutionLog` are purely display — they receive data and render it.

---

### How hooks connect to each other

`useEmber` reads the daily goal from `useAppStore` (set during onboarding, stored by Aaron) and reads current HP from `AsyncStorageService` on mount. It then runs the HP ratio formula and classifies the state.

`useDailySpark` depends on `useEmber` — it needs to know whether HP is at 100 to decide if completing the Spark triggers Bonfire Mode.

`useQuests`, `useTask`, and `useQuest` are independent — they read from Firestore via `FirestoreService`.

`useStreak` and `useHPHistory` both depend on Aaron's `D9` task. Until HP snapshots are being written to Firestore, these hooks can't return real data. Build the Profile screen against stub data first.

---

## Build timeline — target: April 10

16 days. Structured in four waves so each layer unblocks the next. Tasks marked with `needs:` cannot start until those dependencies exist.

---

### Wave 1 — Foundation · Mar 25–27

> The shared contracts. Everything else depends on this wave being done first.

**Aaron**

- [X] `D1` Init Expo project, install all dependencies, verify Android build runs
- [X] `D2` Scaffold folder structure — create all screen files as empty stubs
- [ ] `D4` Firebase init: Firestore config, environment variables, security rules
- [ ] `D5` Firestore schema: tasks, quests, HP history, streaks, evolution state

**Kaley**

- [ ] Write `types/ember.ts`, `types/task.ts`, `types/quest.ts`, `types/index.ts`
- [ ] Write `constants/Colors.ts`, `constants/Typography.ts`, `constants/Spacing.ts`, `constants/EmberStates.ts`

**Josh**

- [ ] Write stub versions of all hooks returning hardcoded data so Kaley can build screens without waiting

---

### Wave 2 — Core data + independent UI · Mar 28–Apr 1

> Aaron builds storage. Josh builds core logic. Kaley builds all screens that don't need live data.

**Aaron**

- [ ] `D3` AsyncStorage module: read/write HP and visual state · `needs: D1`
- [ ] `D6` HP sync contract: AsyncStorage first, Firestore async · `needs: D3, D4`
- [ ] `D7` Task CRUD in Firestore · `needs: D4, D5`
- [ ] `D8` Quest CRUD in Firestore · `needs: D4, D5`
- [ ] `D11` Android notification channels · `needs: D1`
- [ ] `D12` Notification permission request + denial fallback · `needs: D11`

**Josh**

- [ ] `L1` HP ratio engine: `(completed / goal) × 100` · `needs: types/ember.ts`
- [ ] `L2` HP state classifier: maps HP % to a state label · `needs: L1, EmberStates.ts`
- [ ] `L3` Task cost logic: add subtracts HP, complete restores · `needs: L1`
- [ ] `L7` Quest recurrence logic: all cadence types · `needs: types/quest.ts`

**Kaley**

- [ ] `U9` Onboarding screen · `needs: D2, types, constants`
- [ ] `U6` Task list screen · `needs: D2, stub hooks`
- [ ] `U4` Quest Board screen · `needs: D2, stub hooks`
- [ ] `U5` Quest detail screen · `needs: D2`
- [ ] `U10` Notification banner · `needs: D2, D12`
- [ ] Build `components/ui/` primitives: `Card`, `Button`, `Badge`, `HPBar`, `NotificationBanner`

---

### Wave 3 — Integration · Apr 2–6

> Real hooks replace stubs. Screens wire to live data. Creature comes together.

**Aaron**

- [ ] `D9` Daily HP snapshot writes · `needs: D6, D7`
- [ ] `D10` Offline degradation: AsyncStorage-only fallback · `needs: D3, D6`

**Josh**

- [ ] `L4` Daily Spark selection algorithm · `needs: L1, D7`
- [ ] `L5` Bonfire Mode trigger · `needs: L1, L4`
- [ ] `L6` Streak calculation · `needs: D9`
- [ ] `L8` Notification scheduling · `needs: D11, D12`
- [ ] `L9` Deep link routing: notification tap goes to correct screen · `needs: L8, D2`
- [ ] Replace all stub hooks with real implementations · `needs: L1–L7, D3, D6`

**Kaley**

- [ ] `U3` Creature state animations with Reanimated · `needs: types/ember.ts, EmberStates.ts`
- [ ] `U1` Home screen wired to `useEmber()` · `needs: U3, L2 stub or real`
- [ ] `U2` Daily Spark card + Bonfire indicator · `needs: U1, L4 stub or real`
- [ ] `U7` Task edit screen + HP cost calculator · `needs: D2, D7`
- [ ] Build remaining feature components: `EmberCreature`, `DailySparkCard`, `BonfireIndicator`, `TaskListItem`, `HPCostCalculator`, `QuestCard`, `QuestFilterTabs`

---

### Wave 4 — Completion + polish · Apr 7–9

> Profile screen, final wiring, consistency pass.

**Aaron**

- [ ] End-to-end test: offline mode, HP sync, Firestore reads on fresh install

**Josh**

- [ ] End-to-end test: HP formula, state transitions, Bonfire trigger, notifications

**Kaley**

- [ ] `U8` Profile screen · `needs: D9, L6`
- [ ] Build profile components: `HPTrendChart`, `StreakDisplay`, `EvolutionLog`
- [ ] Swap all stub hooks for real implementations · `needs: Wave 3 complete`
- [ ] Navigation polish: tab persistence, back button behaviour, deep links
- [ ] Visual consistency pass across all screens

---

### Apr 10 — Submission day

- [ ] Final Android build verified on emulator
- [ ] All screens reachable, no crashes on main flows
- [ ] README updated

---

## Component model

Two kinds of logic. They don't overlap.

**Business logic (Josh)** — app rules that exist whether or not there's a UI. The HP formula. Which state Ember is in. Whether Bonfire triggers.

**Interaction logic (Kaley)** — behaviour that only exists because there's a UI. What Thriving looks like. How the HP bar animates. Which tab is selected.

> Josh answers: *"Is Ember Thriving right now?"*
> Kaley answers: *"What does Thriving look and feel like?"*

The only connection between the two is a prop. The screen calls Josh's hook, gets a value back, and passes it down to the component as a prop. That's the entire handoff.

### What lives where

| Work                                      | File                                      | Who   |
| ----------------------------------------- | ----------------------------------------- | ----- |
| Read HP from AsyncStorage                 | `services/AsyncStorageService.ts`       | Aaron |
| Calculate HP ratio                        | `hooks/useEmber.ts`                     | Josh  |
| Classify HP into a creature state         | `hooks/useEmber.ts`                     | Josh  |
| Determine if Bonfire should trigger       | `hooks/useEmber.ts`                     | Josh  |
| Write a completed task to Firestore       | `services/FirestoreService.ts`          | Aaron |
| Animate the HP bar when the value changes | `components/ui/HPBar.tsx`               | Kaley |
| Decide what Thriving looks and feels like | `components/ember/EmberCreature.tsx`    | Kaley |
| Track which filter tab is active          | `components/quests/QuestFilterTabs.tsx` | Kaley |
| Handle the + / − on the HP cost stepper  | `components/tasks/HPCostCalculator.tsx` | Kaley |

**Stays inside components:**

- Reanimated animations triggered by a prop change
- `useState` for local interaction: selected tab, stepper value, open/closed toggles
- `onPress` handlers that fire a callback prop up to the screen

**Never inside components:**

- Reading from AsyncStorage or Firestore
- Running the HP formula or classifying states
- Scheduling notifications

---

## Data flow — Home screen end to end

```
Aaron                           Josh                            Kaley
──────────────────────          ──────────────────────          ──────────────────────
AsyncStorageService             useEmber()                      HomeScreen
  reads HP from device    ───►    runs HP formula (L1)    ───►    calls useEmber()
                                  classifies state (L2)           calls useDailySpark()
                                  checks Bonfire (L5)             passes values down as props
                                  returns:                              │
                                  { hp: 72,                            ├─► <EmberCreature state="Steady" />
                                    state: "Steady",                   ├─► <HPBar value={72} state="Steady" />
                                    isBonfire: false }                 ├─► <DailySparkCard task={spark} />
                                                                       └─► {isBonfire && <BonfireIndicator />}
```

```tsx
// app/(tabs)/index.tsx
// Calls hooks, gets data, passes it down. That's the whole job of a screen.
export default function HomeScreen() {
  const { hp, state, isBonfire } = useEmber();  // Josh's hook
  const spark = useDailySpark();                 // Josh's hook

  return (
    <ScrollView>
      <EmberCreature state={state} />            {/* drives its own animation */}
      <HPBar value={hp} state={state} />         {/* animates its own bar width */}
      <DailySparkCard task={spark} />            {/* renders the spark task */}
      {isBonfire && <BonfireIndicator />}        {/* only shows when Josh says so */}
    </ScrollView>
  );
}
```

```tsx
// components/ui/HPBar.tsx
// Gets a number. Animates a bar. Knows nothing about where the number came from.
export function HPBar({ value, state }: HPBarProps) {
  const width = useSharedValue(value);
  useEffect(() => { width.value = withTiming(value); }, [value]);
}
```

```tsx
// components/ember/EmberCreature.tsx
// Gets a state label. Decides what it looks and feels like.
// Josh classifies the state. This component expresses it.
const STATE_CONFIG = {
  Thriving:   { scale: 1.1, opacity: 1.0 },
  Steady:     { scale: 1.0, opacity: 0.9 },
  Strained:   { scale: 0.95, opacity: 0.7 },
  Flickering: { scale: 0.9, opacity: 0.45 },
};

export function EmberCreature({ state }: EmberCreatureProps) {
  const scale   = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value   = withSpring(STATE_CONFIG[state].scale);
    opacity.value = withTiming(STATE_CONFIG[state].opacity);
  }, [state]);

  return <Animated.Image source={EMBER_SPRITES[state]} style={animStyle} />;
}
```

---

## Key rules

- `app/` is routes only — no components, hooks, or utilities inside it
- `StyleSheet.create()` must be defined outside the component function, not inside
- All colours come from `constants/Colors.ts` — never write a hex value inline
- HP thresholds come from `constants/EmberStates.ts` — both UI and logic import from the same place
- `types/` gets written before any screen or hook — it is the shared contract that makes parallel work possible

---

## Path alias

`tsconfig.json` is set up with `@/` pointing to the project root:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

Write `@/components/ui/HPBar` instead of `../../../components/ui/HPBar` everywhere. Move a file anywhere and imports still work.
>>>>>>> 3597e9bbcd7b7362361101408937f8aac9f849e8
