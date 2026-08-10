# AGENTS.md

## Project

Hızlı Okuma; React Native + Expo ile geliştirilen, exercise tabanlı bir speed-reading / reading-skills uygulamasıdır.

Goals:

- Hızlı ve akıcı UX
- Exercise tabanlı öğrenme
- İlerleme, istatistik ve gamification
- Guest-first kullanım
- Clerk authentication
- Convex cloud sync
- RevenueCat subscriptions

---

## Tech Stack

- React Native
- Expo SDK 57
- Expo Router
- TypeScript
- Bun
- Tamagui
- Lucide React Native
- Victory Native
- Zustand + react-native-mmkv
- Convex + Clerk
- RevenueCat
- Amplitude + Sentry
- expo-notifications
- expo-audio
- React Native Reanimated
- i18next + react-i18next + expo-localization

---

## Package Manager

Only Bun is allowed.

Use:

bun install
bun add <package>
bun remove <package>
bun run <script>
bun expo install <package>

Never use npm, yarn or pnpm.

Only bun.lock should be used.

---

## Core Rules

### Inspect Before Editing

Before changing code:

1. Read the relevant files.
2. Understand the existing architecture.
3. Check related stores, hooks, services and components.
4. Make the smallest safe change.

Do not rewrite working code without a concrete reason.

### Minimal Changes

Avoid:

- unrelated refactors
- unnecessary abstractions
- dependency upgrades
- large architectural changes
- speculative optimizations

Only modify files relevant to the task.

### TypeScript

Prefer strict typing.

Avoid:

- any
- as any
- unsafe casts
- unnecessary non-null assertions
- duplicated types

Never silence errors with type hacks.

### Imports

Use the @/ alias.

Prefer:

@/components
@/features
@/hooks
@/stores
@/services
@/convex
@/lib
@/utils

Avoid deep relative imports such as ../../ or ../../../.

Fix deep relative imports when touching the affected file.

---

## Architecture

Main structure:

src/
├── app/ # Expo Router routes
├── components/ # Reusable UI
├── features/ # Domain features
├── hooks/ # Custom hooks
├── stores/ # Zustand + MMKV
├── services/ # External services
├── providers/ # Global providers
├── lib/ # Library initialization
├── constants/
├── types/
├── utils/
└── i18n/

convex/ # Backend queries, mutations and actions

Keep business logic in appropriate feature, service or store layers instead of screens.

---

## Sources of Truth

- Authentication: Clerk
- Authenticated cloud data: Convex
- Subscriptions / entitlements: RevenueCat
- Guest/local data: Zustand + MMKV

Guest users must be able to use exercises without authentication.

Never mix data between users.

Never trust a client-provided user ID for authorization.

---

## State & Sync

Use Zustand for client state.

Prefer selectors:

const value = useStore(state => state.value)

Do not subscribe to the entire store unnecessarily.

Do not put temporary component state into global stores without a reason.

Persist only data that needs persistence.

Do not persist derived state unnecessarily.

### Guest → Auth

After Clerk login, guest data may be migrated to the authenticated Convex account.

Migration must protect against:

- data loss
- duplicate sync
- repeated migration
- partial failures
- cross-user data leakage

Logout must never expose another user's data.

---

## Exercise Engine

Exercise lifecycle:

idle
→ preparing
→ running
→ paused
→ completed / cancelled

Handle:

- start
- pause
- resume
- completion
- cancellation
- restart
- rapid navigation
- app backgrounding

Exercise completion must be idempotent and execute only once.

Protect important async operations against:

- race conditions
- stale state
- duplicate requests
- double taps
- duplicate submissions
- unmounted components

---

## Resources & Cleanup

Every resource with a lifecycle must be cleaned up.

Check:

- timers
- intervals
- event listeners
- subscriptions
- notification listeners
- audio players
- animations
- AppState listeners
- navigation listeners
- async callbacks

Exercise screens must release timers, audio, animations and listeners when:

- exercise completes
- exercise is cancelled
- user navigates away
- component unmounts

Prevent duplicate listeners, timers, audio players and subscriptions.

---

## Performance

Performance matters.

Avoid:

- unnecessary renders
- unnecessary effects
- unnecessary state
- duplicate requests
- large synchronous operations
- expensive calculations during render
- unnecessary serialization
- unnecessary persistence

Do not blindly add useMemo, useCallback or React.memo.

Use them only when they solve a real performance problem.

---

## Audio & Notifications

### Audio

Use expo-audio.

Prevent:

- duplicate players
- duplicate playback
- leaked audio resources
- playback continuing after leaving an exercise

Stop and clean up audio when an exercise ends or unmounts.

### Notifications

Use expo-notifications.

Respect user notification preferences.

Avoid duplicate scheduled notifications and listeners.

Clean up listeners correctly.

Notification deep links must not break navigation.

---

## RevenueCat

RevenueCat is the subscription source of truth.

Use it for:

- offerings
- paywalls
- purchases
- restore purchases
- entitlements
- subscription state

Do not create a separate fake/local subscription source of truth.

Avoid duplicate RevenueCat listeners.

Never expose RevenueCat secrets in client code.

---

## Clerk & Convex

Use APIs compatible with the installed versions.

Authentication state should not be duplicated unnecessarily in Zustand.

Convex authorization must always be enforced server-side.

Never trust client-provided user IDs for authorization.

Keep backend business logic inside convex/.

Avoid unnecessary queries, mutations and duplicate requests.

---

## UI

Use Tamagui components and theme tokens.

Support:

- light
- dark
- system

Avoid unnecessary hardcoded colors.

Ensure text, backgrounds and controls remain readable in all themes.

Use Safe Area handling where required.

---

## i18n

All user-facing text must use i18n.

Do not add new hardcoded user-facing strings.

Primary language: Turkish.

Keep the architecture ready for additional languages.

---

## Analytics & Monitoring

### Amplitude

Track meaningful user actions.

Do not fire analytics events on every render.

Avoid duplicate events.

### Sentry

Report meaningful errors.

Never send secrets, passwords or tokens.

Remove unnecessary production console.log statements.

---

## Dependencies

Before adding a package:

1. Check whether an existing dependency solves the problem.
2. Check Expo SDK compatibility.
3. Prefer Expo-supported libraries where appropriate.
4. Add dependencies only when justified.

Do not upgrade dependencies unless required for the task.

---

## Code Quality

Remove confirmed unused:

- imports
- variables
- functions
- hooks
- components
- types
- constants
- translations
- utilities

Do not delete files without verifying they are unused.

Avoid duplicate implementations.

---

## Validation

After meaningful changes run:

bun run typecheck
bun run lint

Run relevant tests when they exist.

Do not claim completion if verification fails.

---

## Documentation

Keep project history and detailed status out of AGENTS.md.

Use:

- PROJECT_STATUS.md → current architecture and implementation status
- walkthrough.md → completed work and important changes
- task.md → current task and TODOs

AGENTS.md contains rules, not project history.

---

## Agent Workflow

For every task:

1. Understand the request.
2. Identify relevant files.
3. Read only those files.
4. Make minimal changes.
5. Run validation.
6. Fix resulting errors.
7. Update documentation only when necessary.

Do not repeatedly scan the entire repository.

Do not analyze unrelated areas.

Do not make speculative optimizations.

### Priority

P0 → crashes, data loss, security, cross-user leaks, resource leaks

P1 → major bugs, race conditions, broken flows

P2 → performance and maintainability

P3 → cosmetic improvements and refactoring

When in doubt, preserve existing behavior.
