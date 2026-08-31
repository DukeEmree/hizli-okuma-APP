# Product

<!-- impeccable:product-schema 1 -->

## Platform

android

iOS is planned but not shipped. `app.json` already carries the iOS bundle
identifier (`com.dukeemree.hizliokuma`); no iOS build, RevenueCat iOS key or
App Store listing exists yet. Design decisions target Android/Material
expectations first but must not foreclose iOS later.

## Users

Primary: **Turkish students preparing for a national exam** — YKS, LGS or
ALES. They are studying under a fixed exam calendar, and reading speed matters
to them for a concrete reason: paragraph questions cost them time they do not
have in the exam. They train in short sessions on their own phone, usually
alone, often in the gaps of a study day.

Secondary audiences exist (adults improving reading speed for personal
development) but they are not who product decisions are made for. When the two
conflict, the exam student wins.

## Product Purpose

A speed-reading trainer that turns "read faster" into a daily, measurable
practice. The user opens the app, runs a short set of exercises, and sees
their WPM, comprehension and streak move. Success is the user coming back
day after day and their reading numbers actually rising — not session length,
not content consumed.

## Positioning

Exercise-based, adaptive, and entirely on-device. Fifteen distinct exercises
across five skills (reading, comprehension, vision, memory, focus), each with
per-exercise adaptive difficulty computed from the user's own history, wrapped
in a four-step daily plan. It is training, not content: there is no article
feed and no course to consume. Positioned explicitly for the Turkish exam-prep
context — the store name leads with YKS/LGS/ALES.

## Operating Context

- Phone-only, portrait, one hand, short sessions.
- Frequently used in study breaks and commutes; must work with no connection.
- The daily plan is the habit ritual: four steps, completed in a day, tracked
  by a streak with earnable freezes.
- Local notifications (daily reminder, streak, inactivity, weekly summary) are
  the only thing that reaches out to the user.
- Turkish exam vocabulary is the user's frame of reference: "paragraf",
  "deneme", "hız", "anlama".

## Capabilities and Constraints

**Confirmed and binding:**

- **No account, no backend, fully offline.** No sign-in, no sync, no cloud
  copy. Every install is one local user; all progress lives in MMKV on the
  device. No design may introduce "create an account", "sync", "log in on
  another device", or any cloud promise.
- **Turkish is the canonical language.** Every user-facing string goes through
  i18n; the architecture is multi-language ready but Turkish is the source of
  truth. No new hardcoded strings.
- **Green brand hue `#2DBE73`.** Splash, app icon, adaptive-icon background
  and notification colour all use it, and the in-app palette is single-hue
  green. This is a binding brand commitment.

**Current implementation, not locked:**

- Monetization is RevenueCat subscriptions (monthly / yearly on Play).
  Today's free tier is *daily-plan-only*: a free user can run an exercise only
  as a step of the current day's four-step plan; picking any exercise
  standalone is premium. The user did **not** mark this as a binding
  constraint, so it is the current model and open to change — do not treat it
  as fixed product truth.
- 15 exercises: rsvp, chunking, pacer, schulte, scanning, peripheral,
  word-recognition, memory, sentence-memory, main-idea, keyword,
  selective-attention, number-scan, visual-search, comprehension-speed.
- Gamification: 10 XP per exercise, 100 XP per achievement, six achievements,
  level derived from total XP. Streaks are timezone-aware with earnable
  freezes (one per 7-day run, max 2).
- Onboarding is a reading test that seeds the daily goal, `bestWpm` /
  `bestComprehension`, and the starting difficulty of the reading exercises.
- Local history retains six months of sessions; statistics and charts read
  from it.
- No server-side validation of any kind exists, by design.

**Decided 2026-08-30 — the exam frame belongs inside the app.** The
positioning is no longer a store-listing device: the interface itself should
speak the exam student's frame of reference ("paragraf", "deneme", "hız",
"anlama"), and a reading-speed number should carry an exam-relevant reference
point rather than standing alone as a raw figure. This resolved a question
that had been open since this file was written; the home screen currently
carries no exam reference at all, which is what forced the decision. Scope and
first implementation live in `.scratch/home-screen/issues/03-today-answer-and-exam-framing.md`.

**Undecided:**

- Android auto-backup behaviour for MMKV progress data.

## Brand Commitments

- **Name:** Hızlı Okuma. Store listing: "Hızlı Okuma: Sınavlara Hazırlık |
  YKS/LGS/ALES".
- **Brand hue:** green `#2DBE73`, taken from the app icon. Single-hue palette
  across the app.
- **Voice:** Turkish, direct, second person, encouraging without being
  childish. No gimmicky mascot exists today.
- **Assets:** app icon, Android adaptive icon (foreground / background /
  monochrome), splash icon, favicon — all under `assets/images/`.
- **Themes:** light, dark and system are all supported and must stay readable.

## Evidence on Hand

- The app itself: 15 working exercises, real adaptive difficulty, real local
  statistics — all verifiable in this tree.
- Legal pages (Privacy Policy, Terms), Turkish and English, live at
  `hizliokuma.dukeemree.xyz`; source in `legal/`.
- A production Android build exists and RevenueCat's Play products are wired
  and verified.

**Absent — never fabricate these:** there are no user testimonials, no
download counts, no ratings, no case studies, no press, no efficacy research,
no "students improved X%" claims, and no third-party endorsements. The app has
not shipped publicly yet.

## Product Principles

1. **The exam student's minute is the unit of value.** Every screen is judged
   by whether it gets them into training faster and shows them movement.
2. **Training, not content.** The product's job is reps and measurable
   progress, not material to read.
3. **The device is the whole product.** Offline-first, account-free, instant.
   Nothing may depend on a network round trip.
4. **Progress must be visible every session.** Numbers, streak, level — the
   user should never finish a session unsure whether it counted.
5. **Turkish exam context is the frame**, not a translation layer laid over a
   generic app.

## Accessibility & Inclusion

No formal standard has been mandated. Known product-specific needs:

- Light, dark and system themes must all remain readable — exercises are
  frequently run at night.
- Exercise runner screens are timed and text-dense; icon-only controls
  (exit, play/pause) already carry `accessibilityLabel` and
  `accessibilityRole` and must keep them.
- A contrast and dynamic-type pass has not been done yet and is an open item.
