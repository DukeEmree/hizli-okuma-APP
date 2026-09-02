# Knowledge Graph: hizli-okuma

```mermaid
graph TD
    App[src/app] --> Features[src/features]
    App --> Components[src/components]
    App --> Providers[src/providers]
    App --> Constants[src/constants]
    App --> BuoyDevTools[@buoy-gg/core]
    
    Features --> Components
    Features --> Stores[src/stores]
    Features --> Services[src/services]
    Features --> Hooks[src/hooks]
    Features --> Constants
    
    App --> TabsExercises[src/app/(app)/(tabs)/exercises.tsx]
    App --> TabsSettings[src/app/(app)/(tabs)/settings.tsx]
    App --> TabsIndex[src/app/(app)/(tabs)/index.tsx]
    App --> ExerciseDetail[src/app/(app)/exercise/[exerciseId].tsx]
    
    Features --> OnboardingScreen[src/features/onboarding/OnboardingScreen.tsx]
    Features --> PaywallScreen[src/features/subscription/PaywallScreen.tsx]
    Features --> ComprehensionScreen[src/features/comprehension/ComprehensionScreen.tsx]
    Features --> DailyPlanCard[src/features/dailyPlan/DailyPlanCard.tsx]
    Features --> DailyPlanList[src/features/dailyPlan/DailyPlanListScreen.tsx]
    Features --> DailyPlanComplete[src/features/dailyPlan/DailyPlanCompleteScreen.tsx]
    Features --> WeeklySummary[src/features/weeklySummary/WeeklySummaryScreen.tsx]
    Features --> ComprehensionSpeed[src/features/exercises/comprehension-speed/ComprehensionSpeedExerciseScreen.tsx]
    Features --> PricingTests[src/features/subscription/__tests__/pricing.test.ts]
    Features --> WordRecogTests[src/features/exercises/word-recognition/__tests__/wordRecognition.test.ts]
    Features --> VisualSearchTests[src/features/exercises/visual-search/__tests__/visualSearch.test.ts]
    Features --> NumberScanTests[src/features/exercises/number-scan/__tests__/numberScan.test.ts]
    Features --> PeripheralTests[src/features/exercises/peripheral/__tests__/peripheral.test.ts]
    Features --> CompSpeedTests[src/features/exercises/comprehension-speed/__tests__/comprehensionSpeed.test.ts]
    
    Components --> Stores
    Components --> Hooks
    Components --> Constants
    Components --> SafeCharts[src/components/ui/charts/SafeCharts.tsx]
    
    Hooks --> Stores
    Hooks --> Services
    Hooks --> AdaptiveStartTest[src/hooks/__tests__/useAdaptiveExerciseStart.test.ts]
    
    Providers --> Services
    
    Stores --> Utils[src/utils]
    Stores --> PaywallPromptTest[src/stores/__tests__/paywallPromptStore.test.ts]
    Stores --> ExerciseProgressTest[src/stores/__tests__/exerciseProgressStore.test.ts]
    Stores --> StreakCacheTest[src/stores/__tests__/streakCacheStore.test.ts]
    Stores --> BuoyZustand[@buoy-gg/zustand]
    Services --> Utils
    
    App --> I18n[src/i18n]
    Features --> I18n
    
    Components --> AppCard[src/components/ui/AppCard.tsx]
    Components --> StatisticsDashboard[src/components/ui/StatisticsDashboard.tsx]
    Components --> Track[src/components/ui/track/Track.tsx]
    Components --> AchievementPopup[src/components/gamification/AchievementPopup.tsx]
    
    Constants --> Layout[src/constants/layout.ts]
    Utils --> DifficultyMapper[src/utils/difficultyMapper.ts]
    
    Docs[Documentation] --> REVIEW_FOR_CLAUDE[REVIEW_FOR_CLAUDE.md]
    Docs --> PROJECT_STATUS[PROJECT_STATUS.md]
    Docs --> RELEASE_TODO[RELEASE_TODO.md]
    Docs --> DESIGN[DESIGN.md]
    Docs --> BUGS[BUGS.md]
    Docs --> PRODUCT[PRODUCT.md]
    Docs --> FEATURE_BACKLOG[FEATURE_BACKLOG.md]
    
    Config[Configuration] --> ExpoEnv[expo-env.d.ts]
    Config --> PackageJson[package.json]
    Config --> AppJson[app.json]
    Config --> McpConfig[.mcp.json]
    Config --> TestSetup[test-setup.ts]
```

## Entities

| Entity | Type | Description | Source |
|---|---|---|---|
| src/app | Code | Expo Router routes and entry points | `src/app` |
| src/app/(app)/(tabs)/exercises.tsx | Code | Exercises tab screen with TAB_BAR_INSET bottom padding | `src/app/(app)/(tabs)/exercises.tsx` |
| src/app/(app)/(tabs)/settings.tsx | Code | Settings tab screen with TAB_BAR_INSET and comprehensive reset | `src/app/(app)/(tabs)/settings.tsx` |
| src/app/(app)/(tabs)/index.tsx | Code | Home tab screen with daily plan and streak highlights | `src/app/(app)/(tabs)/index.tsx` |
| src/app/(app)/exercise/[exerciseId].tsx | Code | Exercise details screen with header back navigation and SafeLineChart | `src/app/(app)/exercise/[exerciseId].tsx` |
| src/components | Code | Reusable UI components (Tamagui, etc.) | `src/components` |
| src/components/ui/charts/SafeCharts.tsx | Code | Resilient line and bar chart wrapper with Skia detection and SVG fallback | `src/components/ui/charts/SafeCharts.tsx` |
| src/constants/layout.ts | Code | Global layout constants including TAB_BAR_INSET & contentColumn | `src/constants/layout.ts` |
| src/features | Code | Domain-specific features and exercise engine | `src/features` |
| src/features/onboarding/OnboardingScreen.tsx | Code | Onboarding assessment flow with responsive scroll views | `src/features/onboarding/OnboardingScreen.tsx` |
| src/features/subscription/PaywallScreen.tsx | Code | Custom paywall UI with 44dp hitSlop touch targets | `src/features/subscription/PaywallScreen.tsx` |
| src/features/dailyPlan/DailyPlanCard.tsx | Code | Daily plan card with accessibility roles and progress indicators | `src/features/dailyPlan/DailyPlanCard.tsx` |
| src/features/dailyPlan/DailyPlanListScreen.tsx | Code | Daily plan exercise list with responsive scroll wrapper | `src/features/dailyPlan/DailyPlanListScreen.tsx` |
| src/features/dailyPlan/DailyPlanCompleteScreen.tsx | Code | Daily plan completion celebrating screen with SafeArea and ScrollView | `src/features/dailyPlan/DailyPlanCompleteScreen.tsx` |
| src/features/weeklySummary/WeeklySummaryScreen.tsx | Code | Weekly training summary screen with ScrollView resilience | `src/features/weeklySummary/WeeklySummaryScreen.tsx` |
| src/features/exercises/comprehension-speed/ComprehensionSpeedExerciseScreen.tsx | Code | Speed comprehension exercise screen with tactile haptic feedback | `src/features/exercises/comprehension-speed/ComprehensionSpeedExerciseScreen.tsx` |
| src/features/comprehension/ComprehensionScreen.tsx | Code | Reading comprehension assessment test and actions | `src/features/comprehension/ComprehensionScreen.tsx` |
| src/features/subscription/__tests__/pricing.test.ts | Code | Unit tests for package sorting and annual saving percent | `src/features/subscription/__tests__/pricing.test.ts` |
| src/features/exercises/word-recognition/__tests__/wordRecognition.test.ts | Code | Unit tests for WordRecognitionEngine target and selection logic | `src/features/exercises/word-recognition/__tests__/wordRecognition.test.ts` |
| src/features/exercises/visual-search/__tests__/visualSearch.test.ts | Code | Unit tests for VisualSearchEngine grid words and response times | `src/features/exercises/visual-search/__tests__/visualSearch.test.ts` |
| src/features/exercises/number-scan/__tests__/numberScan.test.ts | Code | Unit tests for NumberScanEngine grid generation and target selection | `src/features/exercises/number-scan/__tests__/numberScan.test.ts` |
| src/features/exercises/peripheral/__tests__/peripheral.test.ts | Code | Unit tests for PeripheralEngine directional targets and distances | `src/features/exercises/peripheral/__tests__/peripheral.test.ts` |
| src/features/exercises/comprehension-speed/__tests__/comprehensionSpeed.test.ts | Code | Unit tests for ComprehensionSpeedEngine reading WPM and Q&A | `src/features/exercises/comprehension-speed/__tests__/comprehensionSpeed.test.ts` |
| src/hooks | Code | Custom React hooks | `src/hooks` |
| src/hooks/__tests__/useAdaptiveExerciseStart.test.ts | Code | Unit tests for adaptive exercise initialization using real store state | `src/hooks/__tests__/useAdaptiveExerciseStart.test.ts` |
| src/stores | Code | Zustand + MMKV local state stores | `src/stores` |
| src/stores/__tests__/paywallPromptStore.test.ts | Code | Unit tests for paywall prompt tracking and reset state | `src/stores/__tests__/paywallPromptStore.test.ts` |
| src/stores/__tests__/exerciseProgressStore.test.ts | Code | Unit tests for exercise progress best score / WPM tracking | `src/stores/__tests__/exerciseProgressStore.test.ts` |
| src/stores/__tests__/streakCacheStore.test.ts | Code | Unit tests for streak cache, freezes and reset mechanics | `src/stores/__tests__/streakCacheStore.test.ts` |
| src/services | Code | External services (RevenueCat, Sentry, Amplitude) | `src/services` |
| src/providers | Code | Global context providers | `src/providers` |
| src/utils | Code | Helper utilities | `src/utils` |
| src/utils/difficultyMapper.ts | Code | Maps exercise difficulty levels to engine configurations | `src/utils/difficultyMapper.ts` |
| src/i18n | Code | i18next configuration and translations | `src/i18n` |
| src/components/ui/AppCard.tsx | Code | Reusable card UI component | `src/components/ui/AppCard.tsx` |
| src/components/ui/StatisticsDashboard.tsx | Code | Reading statistics dashboard with SafeCharts | `src/components/ui/StatisticsDashboard.tsx` |
| src/components/ui/track/Track.tsx | Code | Pure React Native two-tone track UI component | `src/components/ui/track/Track.tsx` |
| src/components/gamification/AchievementPopup.tsx | Code | Achievement notification popup with Reanimated unmount cancel cleanup | `src/components/gamification/AchievementPopup.tsx` |
| REVIEW_FOR_CLAUDE.md | Doc | Comprehensive audit, root causes, fixes and verification guide | `REVIEW_FOR_CLAUDE.md` |
| PROJECT_STATUS.md | Doc | Current architecture and implementation status | `PROJECT_STATUS.md` |
| RELEASE_TODO.md | Doc | Remaining release checklist and store deployment steps | `RELEASE_TODO.md` |
| DESIGN.md | Doc | Design specifications and UI/UX plans | `DESIGN.md` |
| BUGS.md | Doc | Known bugs and issues | `BUGS.md` |
| PRODUCT.md | Doc | Product requirements and goals | `PRODUCT.md` |
| FEATURE_BACKLOG.md | Doc | Backlog of planned features | `FEATURE_BACKLOG.md` |
| expo-env.d.ts | Config | TypeScript types for Expo environment | `expo-env.d.ts` |
| package.json | Config | NPM dependencies and scripts | `package.json` |
| app.json | Config | Expo configuration | `app.json` |
| .mcp.json | Config | MCP Server declarations including Buoy, Sentry, Context7 | `.mcp.json` |
| test-setup.ts | Config | Global test runner setup and native mocks | `test-setup.ts` |

> Note: The full AST-level knowledge graph is maintained in `graphify-out/` via the `graphify update .` CLI. This `.graphify/graph.md` represents the high-level domain structure of the target (`.`).

<!-- Updated incrementally by agent for changed files -->
