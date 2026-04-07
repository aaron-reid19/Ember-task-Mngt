# Ember — Commenting Conventions
**CPRG-303-C | Group 9 (Shrek Bros) | Kaley Wood · Joshua Couto · Aaron Reid**

> These conventions apply to all code in the Ember project regardless of layer.
> Two systems work together here: **Status Tags** (emoji) track build state across
> the team, and **Inline Tags** (symbols) annotate meaning within a file.
> Use both — they serve different purposes.

---

## System 1 — Status Tags (Emoji)
*For tracking what is done, what is waiting, and who owns what.*
*Visible at a glance when scanning files or searching the codebase.*

| Emoji | Status | Who Uses It | Meaning |
|-------|--------|-------------|---------|
| 🟢 | **READY** | Anyone | Real implementation — safe to ship |
| 🟡 | **STUB** | Kaley (UI) | Hardcoded placeholder — replace when hook/data is ready |
| 🔴 | **BLOCKED** | Anyone | Cannot proceed — depends on another team member's task |
| 🔵 | **DECISION** | Anyone | Needs a team call before implementation |
| 🟠 | **IN PROGRESS** | Anyone | Being actively worked on right now |
| ⚪ | **DEFERRED** | Anyone | Out of scope for MVP — do not build yet |

---

## System 2 — Inline Tags (Symbols)
*For annotating meaning line-by-line within a file.*
*Adapted for the Ember codebase to work alongside status tags.*

| Tag | Color | Purpose | When to use |
|-----|-------|---------|-------------|
| `// !` | 🔴 Red | Errors, critical warnings, important alerts | Something will break, a constraint must not be violated, a known bug |
| `// ?` | 🔵 Blue | Questions, clarifications, things to revisit | Unsure about an approach, need team input, flagging for review |
| `// *` | 🟢 Green | Positive notes, completed items, good stuff | Something works intentionally, a pattern worth keeping, a deliberate choice |
| `// ^` | 🟡 Yellow | Warnings, caution, potential issues | Won't break now but might later — edge cases, performance, fragile logic |
| `// &` | 🩷 Pink | References, links, related context | Points to a doc, ADR, task ID, or another file this connects to |
| `// ~` | 🟣 Purple | Decorative emphasis, section dividers | Visually separating major sections inside a long file |
| `// TODO` | 🟤 Mustard | Tasks, future work, action items | Something that must be done before ship — searchable at submission time |
| `//` | ⬜ Grey | Commented-out code | Temporarily disabled code — always include a reason on the same line |

### Inline Tag Format

```tsx
// ! this value must never exceed 100 — HP is capped by the formula
// ? should this default to "Steady" or pull from AsyncStorage on mount?
// * Reanimated withSpring here gives the bounce feel we want — keep this
// ^ if goal is 0 this will divide by zero — Josh's L1 needs a guard
// & see ADR-004 for why AsyncStorage is written before Firestore
// ~ ─────────────────────────────────────────────────────────────────
// TODO replace hardcoded task array with useTasks() when Josh's L hook lands
const goal = 5; // was: const goal = await getGoal() — disabled until D3 is ready
```

### Combining Inline Tags with Status Tags

Inline tags and status emoji work together on the same line or as a pair:

```tsx
// 🟡 STUB [L1, L2] — replace with useEmber() when Josh's hooks are done
// ^ if hp stays at 0 longer than expected, check that L3 is restoring on complete
// & see useEmber() in hooks/ — Josh owns this, do not modify

// 🔴 BLOCKED [D3] — waiting on Aaron's AsyncStorage module
// ! do not ship this screen until this blocker is cleared
// const { hp } = useEmber();
```

---

## Status Tag Format Rules

### Stub (🟡)
Use when hardcoding data that will eventually come from a hook or service.

```tsx
// 🟡 STUB [TASK-ID] — replace with [hook/service] when [person]'s [task] is done
// Owner: [your name] | Replaces: [what this will become]
const hp = 72;
const state = "Steady";
```

**Real example:**
```tsx
// 🟡 STUB [L1, L2] — replace with useEmber() when Josh's logic hooks are done
// Owner: Kaley | Replaces: { hp, state, isBonfire } from useEmber()
// ^ hardcoded at 72 — pick a value that exercises the Steady state visually
const hp = 72;
const state: EmberState = "Steady";
const isBonfire = false;
```

---

### Blocked (🔴)
Use when a line of code cannot be written yet because a dependency isn't done.

```tsx
// 🔴 BLOCKED [TASK-ID] — waiting on [person] to complete [task description]
// Unblock: [exactly what needs to exist before this can be written]
// ! do not remove this comment until the dependency is confirmed working
// const { hp, state } = useEmber();
```

**Real example:**
```tsx
// 🔴 BLOCKED [D3] — waiting on Aaron to complete AsyncStorage read/write module
// Unblock: AsyncStorageService.ts must exist with getHP() and getState() exports
// & see D3 in the build plan — Aaron's Wave 2 task
// const { hp, state } = useEmber();
```

---

### Decision Needed (🔵)
Use when the implementation requires a team decision that hasn't been made.

```tsx
// 🔵 DECISION — does the HP bar animate on mount or only on value change?
// ? raise in next standup before implementing HPBar animation logic
```

---

### In Progress (🟠)
Use at the top of a file you are actively working on so teammates don't start
duplicate work.

```tsx
// 🟠 IN PROGRESS — Kaley | Started: Apr 6 | ETA: Apr 7
// ! do not review until this comment is removed
```

---

### Deferred (⚪)
Use for features that are designed but explicitly out of MVP scope.

```tsx
// ⚪ DEFERRED — evolution animation between states
// Reason: out of MVP scope per ADR-001 sprint constraints
// & see ADR-001 for sprint boundary decisions
// Do not implement until Wave 4 sign-off
```

---

## File Header Standard

Every file in the project must start with this block:

```tsx
/**
 * Ember — [Screen or Component Name]
 * Layer: [UI | Logic | Data]
 * Owner: [Kaley | Josh | Aaron]
 * Task IDs: [e.g. U1, U3]
 * Status: 🟡 STUB | 🟢 READY | 🟠 IN PROGRESS
 *
 * Dependencies:
 *   - [Task ID]: [Description of what this file needs] — [Owner] — [Status]
 *
 * Notes:
 *   [Any context the rest of the team needs to understand this file]
 */
```

**Real example:**
```tsx
/**
 * Ember — Home Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U1, U2
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L1, L2: useEmber() hook returning { hp, state, isBonfire } — Josh — PENDING
 *   - L4: useDailySpark() hook returning spark task — Josh — PENDING
 *   - D3: AsyncStorage HP read on mount — Aaron — PENDING
 *
 * Notes:
 *   All data is hardcoded. Screen is visually complete.
 *   Replace stubs top-to-bottom when Josh's Wave 2 hooks land.
 */
```

---

## Inline Handoff Tags

Use these when marking exactly where another person's work plugs in:

```tsx
// ← JOSH: plug useEmber() return value here
// ← AARON: plug FirestoreService.getTasks() here
// ← KALEY: wire onPress to router.push once nav is confirmed
```

Combine with inline tags when the handoff has a risk attached:

```tsx
// ← JOSH: plug useEmber() here
// ^ if this hook isn't ready by Apr 9, Home screen stays on stub data into Wave 3
// TODO confirm with Josh whether stub shape matches final hook return type
```

---

## Searching the Codebase

At submission time, run these searches in VS Code to find anything unresolved:

| Search term | Finds |
|-------------|-------|
| `🟡 STUB` | All hardcoded placeholders — must all be reviewed |
| `🔴 BLOCKED` | All unresolved blockers — must all be cleared |
| `🔵 DECISION` | All open decisions — must all be resolved |
| `🟠 IN PROGRESS` | Any file still being actively edited |
| `⚪ DEFERRED` | Intentionally skipped features — confirm scope |
| `// TODO` | All outstanding action items — resolve or formally defer |
| `// !` | All critical warnings — review every single one |
| `// ?` | All open questions — resolve or convert to 🔵 DECISION |

> **Before submission:** zero `🔴 BLOCKED`, zero `🟠 IN PROGRESS`, zero unresolved
> `// !` warnings, and zero `// ?` questions should remain. Stubs (🟡) are acceptable
> if the stub data is realistic and the screen renders correctly.

---

## Quick Reference Card

```
── Status Tags (build state) ──────────────────────────
🟢 READY         — real code, ship it
🟡 STUB          — hardcoded, replace later
🔴 BLOCKED       — waiting on someone else
🔵 DECISION      — needs team discussion
🟠 IN PROGRESS   — being worked on now
⚪ DEFERRED      — not in MVP scope

── Inline Tags (line-level meaning) ───────────────────
// !    red      — error, critical, do not ignore
// ?    blue     — question, needs answer or team call
// *    green    — good, intentional, keep this
// ^    yellow   — caution, watch this later
// &    pink     — reference, link, related doc or ADR
// ~    purple   — section divider, visual emphasis
// TODO mustard  — action item, must be resolved before ship
//      grey     — commented-out code (always explain why inline)
```
