# Production Checklist

Status as of the 2026-08-11 second audit pass. `[x]` means verified from the repository or fixed in this pass. `[ ]` means it still needs a decision or an action outside the codebase — those are the release blockers.

Source of detail: `PRODUCTION_AUDIT.md`.

## Code Quality

- [x] `bun run typecheck` clean
- [x] `bun run lint` clean (0 errors, 0 warnings)
- [x] `bun test` green — 134 tests, 20 files
- [x] `bun run i18n:check` passes
- [x] `bunx expo export --platform android` succeeds (production bundle compiles)
- [x] No `TODO`/`FIXME`/`HACK` markers left in `src/` or `convex/`
- [x] No hardcoded hex colours in `src/` — Tamagui tokens throughout
- [x] No stray `console.log` in client code paths (remaining ones are Convex server-side or `__DEV__`-gated)
- [x] Removed the tracked scratch files from the repo root (`test-expo-router.js`, `test-export.ts`, `test-export2.ts`, `scratch/`)
- [ ] Add a `test` script to `package.json` (`bun test` works without it, but `AGENTS.md` documents it)

## Security

- [x] No secrets in source or git history
- [x] `.env`, `.env*.local` gitignored; `android/`, `ios/` untracked
- [x] RevenueCat webhook authenticated with a constant-time header comparison
- [x] Webhook events deduped by event id inside a single transaction
- [x] Anti-cheat bounds enforced server-side on session and progress writes
- [ ] Remove the unused `CLERK_SECRET_KEY` line from your local `.env.local` — a mobile client has no use for it

## Authentication

- [x] Clerk tokens stored in `expo-secure-store`, read/write failures fail soft
- [x] Auth state read from Clerk hooks only, never mirrored into Zustand
- [x] Root routing gate waits for `isLoaded` and for the Convex user query, and no longer flashes onboarding right after sign-in
- [x] Sign-in and SSO failures reported to Sentry
- [ ] **Create a production Clerk instance.** All three EAS environments currently point at a `pk_test_...` key. Create the production instance, then set only the production environment:
  `eas env:set --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_live_..." --scope project --environment production`
- [ ] Re-register the Google OAuth redirect URLs for the `hizliokuma://` scheme on the new production instance

## Convex

- [x] Every public function authorizes server-side against the verified identity
- [x] No client-supplied user id trusted anywhere (no IDOR surface)
- [x] `migrations`, `subscriptions`, `revenuecatEvents`, `expoPush` are all internal-only
- [x] Every query runs through an index; the last unindexed filter was removed this pass
- [x] Daily statistics bucket by the user's timezone, matching streak behaviour
- [ ] Deploy the schema changes (new `by_userId_and_completedAt` index and the optional `streaks.freezesAvailable` field) — both additive, no data migration: `npx convex deploy`
- [ ] Set `CLERK_FRONTEND_API_URL` and `REVENUECAT_WEBHOOK_AUTH_HEADER` on the **production** deployment and confirm with `npx convex env list`
- [ ] Batched deletion for `resetMyStatistics` / `deleteMyAccount` (latent limit risk, not reachable at current volumes — REM-2)

## Performance

- [x] Dashboard "today" query bounded by an index range instead of a full history scan
- [x] Exercise tick updates throttled to ~1/s at the React boundary
- [x] Dead write-only state removed from two exercise engines
- [x] Sentry trace/profile sampling reduced from 100% to 20%
- [x] Local-history model settled: `localHistoryStore` keeps 6 months per user on-device, `syncStore` is a pure upload queue filled only for premium users, and unsynced local sessions are backfilled to Convex on upgrade
- [ ] Render-profile pass on a real low-end Android device (cannot be done statically)

## UI/UX

- [x] Safe-area edges applied per screen
- [x] Loading, empty and error states present on the main flows
- [x] Destructive actions behind confirmation sheets
- [x] Unified on the green brand hue (`#2DBE73`) — splash, notification colour, adaptive-icon background and all 63 `$blue*` token usages
- [x] Free/guest users now see the full statistics dashboard, built from their 6 months of on-device history
- [ ] Fix the "En İyi" badge on the exercises tab (reads a statistics range nothing fetches)
- [ ] Increase `SettingsRow` vertical padding to reach the 48 dp Android touch-target minimum

## Accessibility

- [ ] Verify contrast ratios in both themes (no automated check has been run)
- [ ] Add `accessibilityLabel` to icon-only buttons (the circular start button, `AppIconButton`)
- [ ] Test with the system font scaled up — several stat cards use fixed `fontSize` tokens with `numberOfLines`
- [ ] Screen-reader pass over the exercise runner screens

## Android

- [x] `POST_NOTIFICATIONS` declared in `app.json`
- [x] `RECORD_AUDIO`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MEDIA_PLAYBACK`, `SYSTEM_ALERT_WINDOW` blocked — none are used by the app
- [x] `package`, `versionCode` and `version` consistent across `app.json`
- [ ] Run `npx expo prebuild --clean` and confirm the merged manifest matches the permissions above
- [ ] **Verify release signing:** `eas credentials -p android`, `production` profile — confirm a real release keystore exists (or let EAS generate one). The local `android/` folder is a gitignored prebuild artifact and is not what produces the Play build
- [ ] Test a release build on a physical device before submitting

## iOS

- [x] `bundleIdentifier` set
- [ ] `EXPO_PUBLIC_RC_IOS_KEY` is not set in any EAS environment — required before an iOS release
- [ ] App Store Connect app record, provisioning and TestFlight pass
- [ ] Not a blocker if Android ships first

## Notifications

- [x] Android channels created; permission requested with an explanatory alert on denial
- [x] Response listener and AppState listener both cleaned up
- [x] Cold-start deep link handled via `getLastNotificationResponseAsync()`
- [x] Push tokens released on logout and when notifications are disabled; reassigned rather than duplicated on account switch
- [x] Server-side push preference (`users.pushNotificationsEnabled`) kept in sync with the local setting
- [ ] Manually verify the permission-priming copy and timing on a device
- [ ] Optional: set `EXPO_ACCESS_TOKEN` on the Convex deployment for Expo's enhanced push security

## Analytics

- [x] Amplitude is now actually initialised (it was not — every event was dropped)
- [x] Event property keys sanitised for PII before sending
- [x] Disabled in `__DEV__`
- [ ] Confirm the production Amplitude project/key is separate from any test project
- [ ] Confirm the tracked event set covers the funnel you actually want to measure

## RevenueCat / Subscription

- [x] RevenueCat is the sole entitlement source of truth; no local fake subscription state
- [x] Identity keyed to the Clerk user id, race-guarded against rapid account switches
- [x] Log level gated by `__DEV__`
- [x] Account deletion blocked server-side while a subscription is active
- [ ] **Set the production RevenueCat key** — all environments currently use a `test_...` key:
  `eas env:set --name EXPO_PUBLIC_RC_ANDROID_KEY --value "goog_..." --scope project --environment production`
- [ ] Production products created, attached to the `hizli-okuma Pro` entitlement, and linked to Play Store products
- [ ] Webhook pointed at the production Convex HTTP action URL with a matching `Authorization` header
- [ ] Confirm "Restore Purchases" is enabled in the Customer Center configuration (the app has no separate restore button)

## Error Monitoring

- [x] Sentry initialised in production only, disabled in `__DEV__`
- [x] `captureException` used across sync, auth, migration, push and onboarding paths
- [x] User id set/cleared on sign-in and sign-out; no secrets sent
- [x] Trace and profile sampling reduced to 20%
- [ ] Add `environment` and `release` tags to `Sentry.init()` so production events are separable
- [ ] Confirm source-map upload works for a production build (the `@sentry/react-native/expo` plugin is configured with org and project)

## Environment Variables

- [x] `.env.example` rewritten with every variable the code reads, placeholder values and per-variable notes
- [x] Public vs deployment-side variables clearly separated (`EXPO_PUBLIC_*` is bundled and therefore public)
- [ ] Confirm all five client variables are set for the EAS **production** environment: `EXPO_PUBLIC_CONVEX_URL`, `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, `EXPO_PUBLIC_RC_ANDROID_KEY`, `EXPO_PUBLIC_AMPLITUDE_API_KEY`, `EXPO_PUBLIC_SENTRY_DSN`

## App Icon

- [x] Adaptive icon (foreground, background, monochrome) and favicon configured in `app.json`
- [x] App icon is already green; the adaptive-icon background layer was regenerated to match (`#E4F8EE`)
- [ ] Check the monochrome icon variant in the Android 13+ themed-icon style on a device

## Splash Screen

- [x] `expo-splash-screen` configured; auto-hide prevented until fonts load
- [x] Splash background is the green brand colour (`#2DBE73`)

## App Store Metadata

- [x] App name set: "Hızlı Okuma: Egzersizler ve Gelişim"
- [ ] Short and full description, screenshots, feature graphic
- [ ] Category, content rating questionnaire, target audience
- [ ] Localised listing (Turkish)

## Privacy Policy

- [ ] Write and host the policy — must cover Clerk (identity), Convex (app data), RevenueCat (purchases), Sentry (diagnostics), Amplitude (analytics)
- [ ] Add the URL to the Play Console listing
- [ ] Add an in-app link in Settings (tell me when the URL exists and I will add the row)

## Terms

- [ ] Write and host the terms of service
- [ ] Link from Settings alongside the privacy policy

## Release Build

- [ ] `eas build --profile production --platform android`
- [ ] Install the resulting AAB/APK on a physical device and smoke-test: onboarding → exercise → completion → statistics → paywall → purchase (sandbox) → settings
- [ ] Confirm the release build's Sentry, Amplitude and Convex traffic actually arrives

## Testing

- [x] 113 unit tests across scoring, streak, adaptive difficulty, content selection, exercise engines, and the Convex webhook/push helpers
- [ ] No integration test covers the guest → sign-in → migration path (the highest-risk flow)
- [ ] Manual pass: background the app mid-exercise, rapid double-tap completion, airplane mode during sync, account switch, account deletion
- [ ] Manual pass on a small screen (≤ 5") and with the system font enlarged

## Backup / Recovery

- [x] Convex holds server-side data for premium users and is point-in-time recoverable through the Convex dashboard
- [ ] **Free-tier history exists only on the device** — a reinstall or lost phone loses it permanently. Confirm this matches product intent, and consider saying so in the app
- [ ] Decide on Android auto-backup: `allowBackup` currently defaults to true with no `dataExtractionRules` file, so MMKV progress data may be included in device backups
- [ ] Take a Convex snapshot before the first production deploy
