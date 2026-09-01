---
name: buoy-optimize
description: Use when the user wants to optimize a laggy/slow screen or find the most performant way to build something render-heavy (lists, animations, LED grids, canvases, maps) in a React Native app — and the Buoy MCP server is connected. Runs a guided, branching performance R&D loop: scaffold param-driven test variants, benchmark them on a real device with the Buoy perf-monitor, analyze trade-offs holistically (never one metric), prune, fork the winners, and cross-pollinate until distilled. Triggers on phrases like "buoy optimize", "optimize this screen", "find the fastest way to render X", "why is this laggy".
---

# Buoy Optimize — guided performance R&D

You drive the **Buoy MCP** perf-monitor tools to run a disciplined experiment loop: build many variants of a render-heavy feature, measure each on a real device, and **distill toward the best-looking + most performant + best-balanced** implementation. This is empirical: you propose, you measure, the user verifies it looks right, you analyze trade-offs, then you iterate.

## Before you start
- Confirm a device is connected: call **`list_devices`** — you need at least one device exposing `perf-monitor`. If none, ask the user to open the app with Buoy running.
- This works on a **real device or simulator**. Measurements are most stable on a simulator or a device on a cooling pad (heat skews runs) — the user's saved benchmark settings already encode their speed/thermal preference; don't re-ask.

## The non-negotiable principles (read these first)
1. **Visual correctness is a human gate, every round.** A fast variant that renders wrong is worthless. After every benchmark, have the user open each variant and confirm it looks right *before* you analyze.
2. **Never declare a winner on one metric.** Read every axis together (UI FPS, JS FPS, CPU, memory, JS/UI jank). The tools deliberately do NOT crown a single 🏆 — they give per-metric leaders + at-risk flags + "balanced" picks. **UI-thread health outranks raw averages:** a cheap run that drops UI frames (low UI FPS / UI jank) is *worse* than a pricier one that holds them. You cannot compare 10% vs 50% CPU in a vacuum.
3. **Explain trade-offs in plain language; learn across runs.** "A is cheapest but caps the UI thread → jank risk under load; B costs more CPU but caps nothing → safer." Then combine the best tricks from complementary runs into a new candidate.
4. **A simulator is a baseline, not the verdict.** A variant that wins on a sim is *likely* better on real hardware — but real devices differ (thermal throttling, real GPU/RAM), so results can shift. Always plan to confirm on a real device, and surface that to the user.

## The test ladder (iOS first, real devices confirm)
Run the **whole loop per tier**, in this order — and tell the user where you are on the ladder:

**iOS simulator → real iOS device → Android simulator → real Android device.**

- **iOS always comes first.** iOS is fast and stable — the cleanest baseline to get an approach genuinely solid before anything else.
- **Then confirm on a real iOS device.** The sim ranking is a strong signal, but **bulk-test the surviving candidates on a real device** to verify the ranking holds and catch device-specific surprises (thermal, GPU, true memory pressure).
- **Then Android — expect different, usually worse, results.** Android devices are slower, have less RAM, and the same code often needs extra hacks/tricks to match iOS. Re-run the loop on Android (sim → real device); a variant that won on iOS may need Android-specific work or a different approach entirely. Don't assume iOS wins carry over.
- **Note the current platform** from `list_devices` (`platform: ios | android`) so you know which rung you're on, and **surface the next rung when one is solid** (see Step 10).

## Step 1 — Kickoff wizard (infer first, ask only the gaps)
First **state what you can already infer** (target feature from the open file/conversation; whether a test harness exists — scan the repo; render tech from imports; device refresh rate from a perf snapshot). Then ask **only these three** (use multiple-choice; pre-fill your best guess; let "Other" cover the rest):

1. **Workload / scale** — what load should each approach hold up at? (e.g. 100 / 1k / 12k items, or a scaling sweep). This sets the benchmark intensity and the baseline.
2. **Approaches** — do you have specific ideas, or should I propose a set, and how wide? (your list · ~5 focused · ~10–20 wide net, prune hard).
3. **What "best" means** — balanced/never cap a thread *(recommend)* · smoothness first (hold the refresh rate, UI thread sacred) · lowest CPU/battery · lowest memory — plus any hard limit ("<150MB", "must stay 120fps").

Then **show the saved benchmark settings, don't ask about speed.** Call **`get_benchmark_settings`** (pass `pages` = baseline + variant count) and read its plain-English line + time estimate back to the user, e.g. *"Using your saved profile: 5s/page, 3 runs each, reload between, ~4 min total."* Then proceed unless they want to change it.
- One-off speed/runs change for *this* run → pass overrides to `run_benchmark_batch`.
- "Always / save this" → call **`set_benchmark_settings`** to persist. Never silently overwrite their saved profile.

## Step 2 — Scaffold the dev-only test harness
- One **params-driven test route**: a query param selects which variant renders. **Default / no params = the baseline = nothing (or the minimal current impl) rendered** — the control that tells you the page's own floor.
- A **dev-only "test pages" hub** (create it if missing), linked from a sensible spot (e.g. the profile/settings screen), listing every test route so the user can open and eyeball each. Add this route's link to it.
- Gate it all behind `__DEV__` so it never ships.
- Each variant is real code you build behind a param value. Keep variants isolated so a remount fully resets them (the benchmark bounces between pages to force this).

## Step 3 — Breadth: benchmark the wide net
Call **`run_benchmark_batch`** with `targetRoute` = the test route and `cases` = baseline + one case per idea (each a `{ name, params }`). It inherits the saved settings; pass overrides only if the user asked. It navigates, records, ranks, and returns you to the origin screen when done.

## Step 4 — Visual gate (mandatory)
Before trusting any numbers, tell the user: *"Open these → [hub link] + the routes. Which render correctly? Which to disqualify regardless of perf?"* Drop any variant that's visually wrong, no matter how fast.

## Step 5 — Holistic analysis
Read the `run_benchmark_batch` / `get_batch_report` output: the **Flags** column (⚠️ at-risk axes), **per-metric leaders**, and **Balanced (caps nothing)** list. Then synthesize for the user:
- Favor the **Balanced** cases. Treat any **⚠️ UI thread / UI jank** flag as close to disqualifying — call it out explicitly with the risk ("drops frames → janky under load").
- Don't reward a flagged-but-cheap case just because one number is low. Explain the trade-off.
- Use `compare_reports` for a deep two-way diff (avg + p95) when two candidates are close.

## Step 6 — Prune
Drop the clear losers and the visually-wrong ones; keep the promising candidates (e.g. top 5 of 20). Tell the user what you kept and why (per-metric + flags), and confirm.

## Step 7 — Depth: fork the survivors (binary-tree refine)
For each survivor, **give its page its own additional params** — sub-variants exploring ideas *within* that approach (e.g. the Skia variant sprouts Skia-A/B/C). Re-run `run_benchmark_batch` over the sub-variants, visual-gate, analyze, prune. Recurse. New framing each round: *"optimize these survivors without losing visual quality."*

## Step 8 — Cross-pollinate
When two runs are good in *different* ways (A: great CPU but caps UI thread; B: balanced but pricier), **build a new candidate that combines their best tricks** (A's batching + B's throttling) and benchmark it. Learn from both instead of discarding either.

## Step 9 — Stop (for this tier)
When gains plateau on the current device, present the distilled candidate **with its trade-offs stated**, not as a bare "winner." Confirm with the user.

## Step 10 — Advance the ladder
Don't call it "done" — call it "done for this rung," and recommend the next one explicitly:
- Finished on the **iOS simulator** → *"Solid on the iOS sim. Next: bulk-test the top candidates on a real iOS device to confirm — real hardware can shift the ranking."*
- Finished on a **real iOS device** → *"Confirmed on a real iPhone. Next: Android (sim, then device). Expect different and usually worse numbers — less RAM, slower GPU — likely needing Android-specific tweaks."*
- Finished on the **Android simulator** → *"Good on the Android sim. Next: confirm on a real Android device."*
- Finished on a **real Android device** → fully validated across the ladder; present the final per-platform results and any platform-specific code paths.

Carry the iOS winners into Android as the starting set, but re-benchmark everything — never assume an iOS result holds on Android.

## Downstream gates (ask only when reached — keep each tiny)
- **Visual** (every round): which variants render correctly / disqualify.
- **Prune**: "keep my picks (A, C, D), or adjust?"
- **Fork**: "for [survivor], what sub-ideas — yours, or I propose ~N?"
- **Combine**: "A capped the UI thread, B was balanced — try a hybrid?"
- **Stop**: "gains are plateauing — lock in X, or keep distilling?"

## Tool quick-reference
- `list_devices` — confirm device + tools.
- `get_benchmark_settings` / `set_benchmark_settings` — read (plain-English + estimate) / persist the saved profile.
- `run_benchmark_batch` — the core measurement: case matrix → ranked trade-off report. Inherits saved settings; accepts per-run overrides.
- `get_batch_report` / `compare_reports` — re-rank a past batch by id / deep two-way diff.
- `call_action` with `toolId:"route-events"`, `action:"navigate"`, `params:{ path }` — move the app (e.g. to seed an origin or open a variant).

## Keep context lean
Infer before asking. Defer fork/combine questions until you reach those stages. Don't dump raw per-sample data — work from the ranked report. Summarize each round's decision in a line or two so the user can follow without re-reading tables.
