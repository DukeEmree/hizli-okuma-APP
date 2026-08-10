# Project Status

> Living documentation of the current application architecture and implementation status.

Last Updated: 2026-08-10
Status: Active Development

## 1. Project Overview
"Hızlı Okuma" (Speed Reading) is a React Native mobile application built with Expo. It provides various reading exercises, progress tracking, gamification (streaks, leaderboards), and premium features via subscriptions. The app supports a guest-first architecture, allowing users to try exercises locally before signing up, and then syncing their progress to the cloud.

## 2. Tech Stack
**Core:**
- React Native (0.86.2)
- Expo (~57.0.11)
- Expo Router (~57.0.11)
- TypeScript

**UI & Styling:**
- Tamagui (^2.7.4)
- Lucide React Native (Icons)
- Victory Native (Charts)

**State Management & Storage:**
- Zustand (^5.0.14)
- React Native MMKV (^4.3.2)

**Backend & Auth:**
- Convex (^1.43.0) - Serverless Database and Functions
- Clerk (@clerk/clerk-expo ^2.19.31) - Authentication

**Monetization & Analytics:**
- RevenueCat (react-native-purchases ^10.7.0) - Subscriptions
- Amplitude (@amplitude/analytics-react-native) - Analytics
- Sentry (@sentry/react-native) - Crash & Error Monitoring

**Device Features:**
- expo-notifications
- expo-audio

**Package Manager:**
- Bun

## 3. Project Structure
```text
/
├── convex/               # Backend database schema, queries, mutations, and actions
├── src/
│   ├── app/              # Expo Router pages and layouts
│   ├── components/       # Reusable UI components
│   ├── constants/        # App-wide constants (e.g., subscription IDs)
│   ├── features/         # Domain-specific logic (exercises, leaderboard, progress, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── i18n/             # Translation files and i18next initialization
│   ├── lib/              # Third-party library initializations (Analytics, Sentry)
│   ├── providers/        # Context providers (RevenueCat, Notifications, Sync)
│   ├── services/         # External API services, push notification setup
│   ├── stores/           # Zustand state management and MMKV persistence
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions
├── package.json          # Dependency list
├── bun.lock              # Bun lockfile
├── app.json              # Expo configuration
├── eas.json              # EAS Build configuration
└── tamagui.config.ts     # Tamagui design system configuration
```

## 4. Navigation (Expo Router)
The app uses a tab-based navigation system with protected routes and an onboarding flow.
- `app/_layout.tsx`: Main root layout. Handles initialization of all providers (Clerk, Convex, Tamagui, RevenueCat, Sentry) and routing logic (redirecting to `/(onboarding)`, `/(auth)`, or `/(app)/(tabs)` based on authentication and onboarding status).
- `app/(auth)/`: Authentication screens (`login.tsx`, `register.tsx`).
- `app/(onboarding)/`: Initial user onboarding flow.
- `app/(app)/(tabs)/`: Main authenticated/guest application screens:
  - `index.tsx`: Home Dashboard
  - `exercises.tsx`: Exercise Selection
  - `statistics.tsx`: User Progress and Charts
  - `settings.tsx`: App Settings and Preferences
- `app/(app)/exercise/`: Specific exercise session screens.
- `app/(app)/paywall.tsx`: RevenueCat paywall screen.

## 5. Authentication
**Status:** COMPLETED
- Handled by Clerk (`@clerk/clerk-expo`).
- **Providers:** Email/Password and Google OAuth (`useSSO`).
- **Flow:** Users can sign in or register via `app/(auth)`.
- **Sync:** The `AuthSync` component listens to Clerk's authentication state. When a user logs in, it triggers a Convex mutation (`api.users.store`) to sync the user profile to the backend database.

## 6. Guest Architecture
**Status:** COMPLETED
- Users can use the app without logging in.
- `src/stores/storage.ts` provides a `userScopedStorageAdapter` for MMKV.
- If a user is not logged in, `activeUserId` is set to `'guest'`, and all local data (progress, streaks) is saved with a `guest_` prefix.
- Upon login, `activeUserId` is updated to the Clerk user ID, isolating data.
- Syncing guest data to an authenticated account is managed via the `syncStore` and Convex mutations (offline-first approach).

## 7. Data & Persistence
**Status:** COMPLETED
- **State Manager:** Zustand.
- **Storage Engine:** React Native MMKV for high-performance synchronous local storage.
- **Stores:**
  - `settingsStore.ts`: Global app settings (theme, language, notifications). Persisted globally.
  - `userProgressStore.ts`: Local progress tracking (WPM, comprehension, session counts). Persisted per-user.
  - `exerciseSessionStore.ts`: Ephemeral state for active exercise sessions (not persisted).
  - `syncStore.ts`: Offline queue for pushing completed exercise sessions to Convex.
  - `streakCacheStore.ts`: Local caching for daily streaks.

## 8. Convex Backend
**Status:** COMPLETED
- Convex is the primary backend, integrated with Clerk (`ConvexProviderWithClerk`).
- **Schema (`convex/schema.ts`):**
  - `users`: Synchronized from Clerk. Contains onboarding preferences and gamification stats.
  - `exerciseSessions`: Immutable logs of every completed exercise.
  - `exerciseProgress`: Aggregated progress per exercise type (best WPM, consecutive successes).
  - `streaks`: Server-side calculated user streaks.
  - `leaderboardEntries`: Scores for global/weekly leaderboards.
  - `userAchievements`: Unlocked badges.

## 9. RevenueCat (Subscriptions)
**Status:** COMPLETED
- Configured via `RevenueCatProvider.tsx`.
- Connects to RevenueCat using API keys defined in `SUBSCRIPTION_CONSTANTS`.
- Automatically logs in the user to RevenueCat using their Clerk `userId`.
- Exposes `isPremium` boolean derived from active entitlements.
- Fallback/Anonymous mode is supported for Guest users.

## 10. Exercise System
**Status:** IN PROGRESS
- Managed via `src/features/exercises/registry.ts`.
- **Implemented / Registered Exercises:**
  - `rsvp` (Rapid Serial Visual Presentation)
  - `chunking`
  - `pacer`
  - `schulte` (Schulte Table)
  - `scanning`
- The architecture separates Exercise Definitions, Engine (logic/timer), UI Session, and Result Scoring.

## 11. Progress Tracking
**Status:** COMPLETED
- **Local:** `userProgressStore` tracks `totalTrainingSeconds`, `completedExercises`, `bestWpm`, `bestComprehension`.
- **Cloud:** Sessions are queued in `syncStore` and pushed to Convex table `exerciseSessions`. Convex background processes aggregate this into `exerciseProgress`.

## 12. Streak System
**Status:** COMPLETED
- **Local Cache:** `streakCacheStore` provides immediate UI feedback.
- **Server Truth:** Convex `streaks` table maintains the validated streak logic, calculating `currentStreak` and `longestStreak` based on `lastActivityAt`.

## 13. Notifications
**Status:** COMPLETED
- Uses `expo-notifications`.
- `AppNotificationProvider` initializes channels on app start and listens for deep link responses.
- Reschedules local reminders (e.g., Daily Reminder, Inactivity Reminder) automatically when the app transitions to the background (`AppState` listener).
- User preferences managed via `settingsStore` (Daily Reminder Time, Streak Reminders).

## 14. Audio & Haptics
**Status:** PARTIAL
- `expo-audio` is installed.
- Settings exist for `soundEnabled`, `hapticsEnabled`, and `metronomeEnabled` (with BPM control) in `settingsStore`.
- Full integration into all exercise engines is ongoing.

## 15. Settings & Theming
**Status:** COMPLETED
- **Theme:** Tamagui is used for styling. Supports `light`, `dark`, and `system` appearance.
- Controlled via `settingsStore.ts`.
- Changes instantly reflect across the app using Tamagui's `ThemeProvider`.

## 16. Internationalization (i18n)
**Status:** COMPLETED
- Uses `react-i18next` and `expo-localization`.
- Active Language: Turkish (`tr`).
- Architecture is fully prepared for multi-language support.
- Namespaces: `common`, `auth`, `errors`, `exercises`, `home`, `leaderboard`, `navigation`, `onboarding`, `progress`, `settings`, `subscription`, `notifications`.

## 17. Analytics & Error Monitoring
**Status:** COMPLETED
- **Amplitude:** Initialized in `src/lib/analytics.ts`. Tracks events like `app_opened`, `exercise_completed`, `paywall_viewed`. PII is explicitly filtered out before tracking.
- **Sentry:** Initialized in `src/lib/sentry.ts` for crash reporting and performance monitoring.
- Both are disabled in `__DEV__` mode.

## 18. Build & Deployment
- Uses Expo EAS (`eas.json`).
- Profiles defined for `development` (with development client), `preview`, and `production`.
- Required Environment Variables:
  - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `EXPO_PUBLIC_CONVEX_URL`
  - `EXPO_PUBLIC_AMPLITUDE_API_KEY`
  - `EXPO_PUBLIC_SENTRY_DSN`

## 19. Current Feature Status Summary

### COMPLETED
- Clerk Authentication (Email + Google SSO)
- Convex Backend Schema & Auth Integration
- Guest Mode with Isolated Local Storage (MMKV)
- Offline-First Architecture & Guest Migration (SyncStore, MMKV)
- RevenueCat Subscription Infrastructure
- i18n System (Turkish base)
- Tamagui Theming (Dark/Light/System)
- Local Push Notifications System
- Amplitude & Sentry Integration
- Exercise Architecture (Registry, Engines)
- Adaptive Difficulty System (Dynamic adjustment based on 2-success/2-failure rule)

### IN PROGRESS
- Exercise Implementations (RSVP, Chunking, Pacer, Schulte, Scanning)
- Gamification (Achievements, Leaderboard UI)

### NOT IMPLEMENTED
- Advanced Analytics Dashboards in UI

## 20. Known Issues
- Tamagui v5 typing warnings (minor).
- `expo-notifications` sound configuration occasionally fails on native Android builds if custom sounds are missing from `app.json` plugin config.
- `expo-audio` requires manual native build regeneration (`bun run android` / `bun run ios`) after installation to link the native module properly.

## 21. Next Steps
1. **P0 - Stabilize Native Modules:** Ensure `expo-audio` and `@react-native-community/datetimepicker` are correctly linked and functioning in the development client.
2. **P1 - Complete Exercise Engines:** Finalize the UI and timing logic for all registered exercises in the registry.
3. **P1 - RevenueCat Customer Center:** Integrate native subscription management flows for users to manage and cancel their subscriptions directly.
