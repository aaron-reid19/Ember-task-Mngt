# Ember — Best Practices
**CPRG-303-C | Group 9 (Shrek Bros) | Kaley Wood · Joshua Couto · Aaron Reid**

> The "how we do things here" reference for the Ember codebase.
> Read this before writing a new file. When in doubt, it's probably answered here.

---

## 1. The Three-Layer Rule

This is the most important rule in the project. Every file belongs to exactly one layer, and layers do not reach into each other.

| Layer | Question it answers | Owner | Where it lives |
|-------|-------------------|-------|----------------|
| UI | "What does it look and feel like?" | Kaley | `app/`, `components/`, `constants/`, `types/` |
| Logic | "Is it true right now?" | Josh | `hooks/` |
| Data | "Where does it live?" | Aaron | `services/`, `store/` |

**The only connection between layers is a prop or a hook call.**

```tsx
// app/(tabs)/index.tsx — correct cross-layer boundary
const { hp, state, isBonfire } = useEmber();   // Kaley calls Josh's hook
const spark = useDailySpark();                  // Kaley calls Josh's hook

<EmberCreature state={state} />   // Kaley passes a value down as a prop
<HPBar value={hp} state={state} />
```

**What this means in practice:**

- Screens never import from `services/` directly — that's Aaron's layer
- Components never run the HP formula or classify Ember states — that's Josh's layer
- If you catch yourself writing `if (hp > 80)` inside a component, stop — that threshold logic belongs in Josh's `useEmber()`
- If you catch yourself importing `FirestoreService` in a screen, stop — route through Josh's hooks

---

## 2. Project Structure

```
app/                              ← Routes ONLY — Expo Router turns these into screens
├── _layout.tsx                   ← Root Stack + NotificationBanner placement
├── index.tsx                     ← Redirect to /(tabs)/index — no UI here
├── (tabs)/
│   ├── _layout.tsx               ← Tab navigator (4 tabs)
│   ├── index.tsx                 ← Home / Ember screen (U1, U2)
│   ├── quests.tsx                ← Quest Board (U4)
│   ├── quests/[id].tsx           ← Quest detail nested stack (U5)
│   ├── tasks/
│   │   ├── _layout.tsx
│   │   ├── index.tsx             ← Task list (U6)
│   │   └── [id].tsx              ← Task edit screen (U7)
│   └── profile.tsx               ← HP chart, streak, evolution log (U8)
└── (onboarding)/
    └── goal-setup.tsx            ← First launch only — no tab bar (U9)

components/
├── ui/          ← Base primitives — Card, Button, Badge, HPBar, NotificationBanner
├── ember/       ← Creature UI — EmberCreature, EmberAnimations, DailySparkCard, BonfireIndicator
├── tasks/       ← TaskListItem, HPCostCalculator
├── quests/      ← QuestCard, QuestFilterTabs
└── profile/     ← HPTrendChart, StreakDisplay, EvolutionLog

constants/       ← Source of truth for all design tokens (Kaley's to create and maintain)
├── Colors.ts
├── Typography.ts
├── Spacing.ts
└── EmberStates.ts

hooks/           ← Josh's layer — do not write or modify
services/        ← Aaron's layer — do not import directly in screens or components
store/           ← Aaron's layer — can READ from useAppStore, cannot modify its structure
types/           ← Shared contract — write these first, before any screen or hook
```

**Key rule:** `app/` is routes only. No components, hooks, utilities, or constants inside it. Expo Router turns every file in `app/` into a screen — anything that isn't a screen does not belong there.

---

## 3. Constants — Never Write Values Inline

All design tokens live in `constants/`. **Never write a raw hex value, font size, or spacing number directly in a component or screen.**

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

### What lives where

| File | Contains |
|------|----------|
| `constants/Colors.ts` | Every colour in the app — one source of truth |
| `constants/Typography.ts` | Font sizes and weights |
| `constants/Spacing.ts` | Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 |
| `constants/EmberStates.ts` | HP thresholds and the color per state (Thriving / Steady / Strained / Flickering) |

If a new value is needed, add it to the appropriate constants file first, then reference it. Never add a one-off value directly in a component.

**HP thresholds specifically:** Both the UI layer and the logic layer import from `constants/EmberStates.ts`. This is the one file that crosses the boundary — it is the shared contract for what each state means numerically. Do not hardcode thresholds anywhere else.

---

## 4. Styles — StyleSheet at the Bottom, Always

Every component and screen defines its styles at the bottom of the file using `StyleSheet.create()`. The styles object is defined outside the component function — never inside it (recreating on every render is a performance issue).

```tsx
// ✅ Correct pattern
export default function HomeScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.screen,
    backgroundColor: Colors.bg,
  },
});

// ❌ Wrong — StyleSheet inside the component
export default function HomeScreen() {
  const styles = StyleSheet.create({ ... }); // recreated every render
  return <View style={styles.container} />;
}
```

**Conditional styles** (e.g., error state on a form input) use an array:

```tsx
<TextInput style={[styles.input, errors.field && styles.inputError]} />
```

---

## 5. The `@/` Path Alias — Always Use It

`tsconfig.json` is configured with `@/` pointing to the project root. Use it everywhere instead of relative paths.

```tsx
// ✅ Correct — works no matter where the file is
import { HPBar } from "@/components/ui/HPBar";
import Colors from "@/constants/Colors";
import { Task } from "@/types";

// ❌ Wrong — fragile, breaks when files move
import { HPBar } from "../../../components/ui/HPBar";
```

---

## 6. Screens — Coordinators Only

Screens call hooks and pass data down as props. That is their entire job.

```tsx
// app/(tabs)/index.tsx — the whole job of a screen
export default function HomeScreen() {
  const { hp, state, isBonfire } = useEmber();
  const spark = useDailySpark();

  return (
    <ScrollView>
      <EmberCreature state={state} />
      <HPBar value={hp} state={state} />
      <DailySparkCard task={spark} />
      {isBonfire && <BonfireIndicator />}
    </ScrollView>
  );
}
```

**Screens never:**
- Animate anything — that's a component's job
- Run calculations — that's Josh's hook
- Read from AsyncStorage or Firestore — that's Aaron's service
- Contain `StyleSheet` logic that belongs in a component

**Screens own:**
- Layout (which components appear and in what order)
- Hook calls
- Navigation calls (`router.push`, `router.replace`)
- Conditional rendering based on data from hooks

---

## 7. Components — Visual Expression Only

Components receive props and render UI. They own their own animations triggered by prop changes. They do not know where their data comes from.

```tsx
// components/ui/HPBar.tsx — gets a number, draws a bar, knows nothing else
export function HPBar({ value, state }: HPBarProps) {
  const width = useSharedValue(value);

  useEffect(() => {
    width.value = withTiming(value); // animation triggered by prop change — this is fine
  }, [value]);

  // Color comes from constants — not hardcoded, not calculated here
  const barColor = EmberStates[state].color;
}
```

**Components own:**
- Reanimated animations driven by a prop change
- `useState` for local interaction state (selected tab, stepper value, open/closed toggle)
- `onPress` handlers that fire a callback prop upward

**Components never:**
- Import from `services/` or `hooks/`
- Run the HP formula or classify Ember states
- Read from `store/useAppStore` (screens do that, then pass the value down as a prop)

### Component hierarchy

`components/ui/` is the base layer. Everything else builds on top of it.

- `Card` is the visual shell used by `DailySparkCard`, `QuestCard`, `TaskListItem` — changing it changes all three
- `Button` is used by `DailySparkCard` (complete the Spark), the task edit screen (save), and onboarding (confirm goal)
- `Badge` is used inside `TaskListItem` for priority and tag labels
- `HPBar` is rendered directly by the Home screen — nothing wraps it
- `NotificationBanner` is rendered by the root layout, not any screen

`EmberAnimations.tsx` is internal to `EmberCreature.tsx`. It is never imported by a screen. If you find yourself importing it outside of `EmberCreature`, stop.

---

## 8. Navigation

### Route structure

| Tab | Root screen | Has nested stack? |
|-----|------------|------------------|
| Home | `(tabs)/index.tsx` | No |
| Quests | `(tabs)/quests.tsx` | Yes — `quests/[id].tsx` |
| Tasks | `(tabs)/tasks/index.tsx` | Yes — `tasks/[id].tsx` |
| Profile | `(tabs)/profile.tsx` | No |

Onboarding (`(onboarding)/goal-setup.tsx`) has its own layout, separate from tabs. On completion it calls `router.replace('/(tabs)')` — this replaces the stack so the user cannot back-navigate into onboarding.

### Navigation calls

```tsx
// Push to a new screen (adds to stack — back button appears)
router.push("/(tabs)/tasks/task-abc-123");

// Replace current screen (no back button — used for onboarding exit)
router.replace("/(tabs)");

// Read a dynamic route param
const { id } = useLocalSearchParams<{ id: string }>();
```

Always use full absolute paths. Relative strings are fragile.

```tsx
// ✅ Correct
router.push("/(tabs)/tasks/task-abc-123");

// ❌ Fragile
router.push("../tasks/task-abc-123");
```

### Tabs vs Stack

| Use Tabs | Use Stack (nested folder) |
|----------|--------------------------|
| Switching between Home, Quests, Tasks, Profile | Drilling into a detail screen (list → detail) |
| Navigation is parallel / horizontal | Navigation is hierarchical — back button makes sense |

---

## 9. TypeScript — Types First

Types are written before any screen or hook. They are the shared contract that makes parallel development possible. All types live in `types/` and are exported from `types/index.ts`.

```tsx
// ✅ Import from the barrel
import { Task, EmberState, Quest } from "@/types";

// ❌ Deep-importing individual type files
import { Task } from "@/types/task";
```

**Key types:**

| File | Contains |
|------|----------|
| `types/ember.ts` | `EmberState`, `HPData`, `HPSnapshot` |
| `types/task.ts` | `Task`, `TaskPriority`, `TaskTag` |
| `types/quest.ts` | `Quest`, `QuestCadence` |

**Other TypeScript rules:**
- Type component props explicitly with a `type Props = { ... }` block above the component
- Use `useLocalSearchParams<{ id: string }>()` — always provide the generic, never cast
- Avoid `any` — use `unknown` and narrow it if you need to escape the type system temporarily
- Do not write a separate interface that mirrors a Zod schema — use `z.infer<typeof schema>`

---

## 10. Forms — React Hook Form + Zod

All forms use React Hook Form with a Zod resolver. No plain `useState` for form field management.

```tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. Schema — validation rules defined once here
const schema = z.object({
  name: z.string().trim().min(1, "Task name is required."),
});

// 2. Type derived from schema — do not write a separate interface
type FormData = z.infer<typeof schema>;

// 3. Hook
const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});

// 4. Submit — only called if validation passes
function onSubmit(data: FormData) { ... }
```

**Always wrap submit with `handleSubmit`:**

```tsx
// ✅ Correct — validates before calling onSubmit
<Pressable onPress={handleSubmit(onSubmit)}>

// ❌ Wrong — skips validation entirely
<Pressable onPress={onSubmit}>
```

**Always use `Controller` with `onChangeText` for React Native inputs:**

```tsx
<Controller
  control={control}
  name="name"
  render={({ field: { onChange, value } }) => (
    <TextInput
      value={value}
      onChangeText={onChange}   // ← onChangeText, not onChange
      style={[styles.input, errors.name && styles.inputError]}
    />
  )}
/>
{errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
```

---

## 11. FlatList — the Standard for Lists

Use `FlatList` for any list that could grow. Never `.map()` inside a `ScrollView` when data length is unknown.

```tsx
<FlatList
  data={tasks}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <Pressable onPress={() => router.push(`/(tabs)/tasks/${item.id}`)}>
      <TaskListItem task={item} />
    </Pressable>
  )}
/>
```

---

## 12. Pressable — Not TouchableOpacity

`Pressable` is the current React Native standard. `TouchableOpacity` is legacy.

```tsx
// ✅
<Pressable onPress={handlePress}>...</Pressable>

// ❌
<TouchableOpacity onPress={handlePress}>...</TouchableOpacity>
```

---

## 13. Comment Conventions

The project uses two comment systems defined in `COMMENTING_CONVENTIONS.md`. Both are required.

### Status Tags (emoji) — build state

```tsx
// 🟢 READY         — real implementation, safe to ship
// 🟡 STUB          — hardcoded placeholder, will be replaced
// 🔴 BLOCKED       — cannot proceed, waiting on a dependency
// 🔵 DECISION      — needs a team call before implementing
// 🟠 IN PROGRESS   — being actively worked on right now
// ⚪ DEFERRED      — out of MVP scope, do not build yet
```

### Inline Tags (symbols) — line-level meaning

```tsx
// !   red      — error or critical constraint — do not ignore
// ?   blue     — question or decision needed
// *   green    — intentional, good, keep this
// ^   yellow   — caution, watch later, potential edge case
// &   pink     — reference to a doc, ADR, task ID, or another file
// ~   purple   — section divider
// TODO mustard — action item, must resolve before submission
```

### Stub pattern

```tsx
// 🟡 STUB [L1, L2] — replace with useEmber() when Josh's logic hooks are done
// Owner: Kaley | Replaces: { hp, state, isBonfire } from useEmber()
// ^ hardcoded at 72 — exercises the Steady state visually
const hp = 72;
const state: EmberState = "Steady";
const isBonfire = false;
```

### Blocked pattern

```tsx
// 🔴 BLOCKED [D3] — waiting on Aaron to complete AsyncStorage read/write module
// Unblock: AsyncStorageService.ts must export saveGoal()
// ! do not ship this screen until this line is unblocked
// await AsyncStorageService.saveGoal(goal);
```

### Handoff tags — where another layer plugs in

```tsx
// ← JOSH: plug useEmber() return value here — needs { hp, state, isBonfire }
// ← AARON: plug FirestoreService.getTasks() here
```

### File header — required on every file

```tsx
/**
 * Ember — [Screen or Component Name]
 * Layer: [UI | Logic | Data]
 * Owner: [Kaley | Josh | Aaron]
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

---

## Quick Reference Checklist

Before committing a new file, verify:

- [ ] No raw hex values, font sizes, or spacing numbers — everything references `constants/`
- [ ] No HP thresholds hardcoded anywhere — they come from `constants/EmberStates.ts`
- [ ] `StyleSheet.create()` defined outside the component function, at the bottom of the file
- [ ] All imports use `@/` alias, not relative paths
- [ ] Props typed with `type Props = { ... }`
- [ ] No `services/` imports in screens or components — route through Josh's hooks
- [ ] No HP formula or state classification in UI files — that's Josh's layer
- [ ] Forms use `Controller` + Zod schema, not plain `useState`
- [ ] `onChangeText` (not `onChange`) on all `TextInput` fields
- [ ] `handleSubmit(onSubmit)` — never `onSubmit` directly on `onPress`
- [ ] Navigation uses full absolute paths (`/(tabs)/...`)
- [ ] File header comment at the top of every file
- [ ] Every stub has a `🟡 STUB` comment with the task ID it replaces
- [ ] Every blocked line has a `🔴 BLOCKED` comment with an unblock condition

### Pre-submission codebase search

| Search term | What to do with results |
|-------------|------------------------|
| `🔴 BLOCKED` | Resolve every one or escalate to team |
| `🟠 IN PROGRESS` | Remove — nothing should still be in progress |
| `🟡 STUB` | Review each — real data or confirm stub is acceptable |
| `// TODO` | Resolve or convert to `⚪ DEFERRED` with a reason |
| `// !` | Read every one — if unresolved, fix before ship |
| `// ?` | Resolve or escalate to `🔵 DECISION` |
