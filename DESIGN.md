---
name: İz — Hızlı Okuma
description: A quiet measuring instrument for exam students; every session leaves a trace.
colors:
  accent-mineral: "hsl(165, 82%, 31%)"
  accent-mineral-deep: "hsl(165, 82%, 29%)"
  accent-mint: "hsl(163, 54%, 51%)"
  mineral-tint: "hsl(165, 50%, 90%)"
  mineral-text: "hsl(165, 80%, 24%)"
  on-accent-light: "#FFFFFF"
  on-accent-dark: "#08201A"
  brand-mark: "#2DBE73"
  ember: "hsl(33, 62%, 44%)"
  ember-tint: "hsl(33, 62%, 83%)"
  ember-glow: "hsl(37, 72%, 56%)"
  alert: "hsl(7, 55%, 52%)"
  alert-glow: "hsl(5, 71%, 58%)"
  paper: "hsla(200, 15%, 96%, 1)"
  paper-card: "hsla(200, 15%, 100%, 1)"
  paper-line: "hsla(200, 15%, 89%, 1)"
  slate-ink: "hsla(200, 15%, 8%, 1)"
  slate-ink-muted: "hsla(200, 15%, 40%, 1)"
  graphite: "hsla(200, 15%, 8%, 1)"
  graphite-card: "hsla(200, 15%, 11%, 1)"
  graphite-line: "hsla(200, 15%, 18%, 1)"
  chalk: "hsla(200, 15%, 91%, 1)"
  chalk-muted: "hsla(200, 15%, 59%, 1)"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "62px"
    fontWeight: 700
    lineHeight: "72px"
    letterSpacing: "-2px"
  word:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "42px"
    fontWeight: 800
    lineHeight: "52px"
    letterSpacing: "-1.5px"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: "40px"
    letterSpacing: "-1px"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "30px"
    letterSpacing: "0"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "22px"
    letterSpacing: "0"
rounded:
  sm: "5px"
  md: "7px"
  lg: "9px"
  xl: "16px"
  pill: "34px"
spacing:
  xs: "7px"
  sm: "13px"
  md: "18px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent-mineral}"
    textColor: "{colors.on-accent-light}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "0 24px"
    height: "52px"
  button-primary-press:
    backgroundColor: "{colors.accent-mineral-deep}"
    textColor: "{colors.on-accent-light}"
  button-outlined:
    backgroundColor: "transparent"
    textColor: "{colors.slate-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0 16px"
    height: "48px"
  button-icon-circular:
    backgroundColor: "{colors.accent-mineral}"
    textColor: "{colors.on-accent-light}"
    rounded: "{rounded.pill}"
    height: "64px"
    width: "64px"
  chip-selected:
    backgroundColor: "{colors.accent-mineral}"
    textColor: "{colors.on-accent-light}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0 16px"
    height: "48px"
  chip-unselected:
    backgroundColor: "transparent"
    textColor: "{colors.slate-ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0 16px"
    height: "48px"
  card:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.lg}"
    padding: "18px"
  stat-tile:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.lg}"
    padding: "13px"
  streak-badge:
    backgroundColor: "{colors.ember-tint}"
    textColor: "{colors.ember}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "7px 13px"
  pro-badge:
    backgroundColor: "{colors.mineral-tint}"
    textColor: "{colors.mineral-text}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "2px 7px"
---

# Design System: İz — Hızlı Okuma

## Overview

**Creative North Star: "İz" — The Trace**

İz is Turkish for *trace*, *mark*, the track something leaves behind. That is
the entire thesis of this interface. A student opens this app in a gap in
their study day, does four short exercises, and closes it. The app's job is
not to entertain them during those minutes — it is to make sure the minutes
*left a mark they can see*. Every screen is measured against one question:
did the user leave with visible evidence that today counted?

So the interface behaves like a well-made instrument, not like an app
competing for attention. Surfaces are calm neutral paper in a cool 200° grey
that never announces itself. Type is Inter, workmanlike and dense with
information. Color is scarce and load-bearing: a single mineral green marks
what you can act on, an ember orange marks accumulated heat (streaks and
freezes), a muted brick marks danger. Nothing else is colored. The result is
that a two-tone bar in a 32px-tall chart can carry more meaning than a hero
image, because it is the only thing on screen with a voice.

Inside an exercise, the instrument disappears entirely. The runner screens
are the one place the system goes to near-black-and-white and near-empty:
a single word at 42px in the optical center, a hairline progress bar, one
circular control. This is deliberate — the exercise is a timed perceptual
task, and every pixel of chrome is a pixel of distraction competing with the
thing being trained. The app's personality lives in the screens *around* the
exercise, never inside it.

**Key Characteristics:**

- Cool neutral paper (200° hue, 15% saturation) in both light and dark; never a pure-white or pure-black ground.
- One accent, used sparingly — mineral green means "act here" and nothing else.
- Ember orange is reserved for accumulation: streak and freeze only. It is a reward color, never a UI color and never an upsell color.
- Soft, wide, low-opacity lift on cards. The system is layered, not flat, and never hard-edged.
- Data is the ornament. The Track sparkline is the app's signature, not a decorative element.
- Exercise runners strip to monochrome and one control.
- Turkish-first typography: no tracking-out headlines, no all-caps labels that mangle Turkish diacritics (İ, ı, ğ, ş).

## Colors

A cool neutral ground carrying exactly three functional hues: mineral green
for action, ember for accumulation, brick for danger.

### Primary

- **Mineral Green** (`hsl(165, 82%, 31%)` light / `hsl(163, 54%, 51%)` dark): The one action color. Primary buttons, the play/pause control, selected category chips, the Track's comprehension fill. This is the app's normative in-app green — it is the deliberately authored ramp, with its on-accent text color solved per theme (white on the dark light-mode teal, near-black `#08201A` on the pale dark-mode mint, because the mint is too light to carry white legibly).

**On the three greens.** This codebase currently contains three different
greens, and this document settles which one has authority:

1. **Mineral green (the `accent` ramp)** — *normative for the interface.* Hand-authored with per-theme lightness and a solved on-accent contrast pair. Every primary action already routes through it via `theme="accent"`.
2. **Brand mark green `#2DBE73`** — *normative for OS surfaces only.* The app icon, adaptive-icon background, splash and notification color. It is a binding brand commitment and it stays. It is the app's outward face at 512px on a launcher, not a UI token, and it must never be introduced as an in-app background, border or text color.
3. **The `$green*` scale** — *rehued to mineral, and now safe to use.* These tokens were the residue of a mechanical `$blue*` → `$green*` rename and used to resolve to Radix's leaf green (hue 151) — a fourth hue matching neither of the above. Rather than rewrite ~70 call sites, the `green` children theme is now recolored in `src/config/tamagui/themes.ts` (the same trick already used for ember and alert), so `$green*` *is* the mineral ramp, on Radix step semantics: 3–5 component backgrounds, 6–8 borders, **9 the solid brand color — identical to `accent2`**, 10 its hover, 11 low-contrast text (readable on 3–5), 12 high-contrast text. Use `theme="accent"` for solid controls and `$green3`/`$green11` for tinted surfaces and their text.

The brand mark (`hue 149`) and the mineral accent (`hue 165`) are 16° apart.
That gap is real and known: the mark reads as a saturated leaf-green at
launcher size, the accent as a deeper mineral teal at button size. Aligning
them is an open item, not a license to invent a third value in the middle.

### Secondary

- **Ember** (`hsl(33, 62%, 44%)` light / `hsl(37, 72%, 56%)` dark): Accumulated heat. Streak count, streak-freeze pips, and the Track's streak baseline strip. Ember is earned; it appears only where the user has built something up over time. It is deliberately *not* the PRO marker — a PRO badge sits on an exercise the user has not unlocked, which is the opposite of earned. PRO is mineral.
- **Ember Tint** (`hsl(33, 62%, 83%)`): The streak badge ground. Never a page or card background.

### Tertiary

- **Alert Brick** (`hsl(7, 55%, 52%)` light / `hsl(5, 71%, 58%)` dark): Destructive confirmation, failed state, wrong answer. A muted brick, deliberately not a signal red — a wrong answer in a training exercise is data, not an emergency.

### Neutral

The whole neutral system is one 12-step ramp at `hue 200, saturation 15%` —
cool, slightly blue-grey, never a warm or pure grey.

- **Paper** (`hsla(200,15%,96%,1)` light / `hsla(200,15%,8%,1)` dark): The screen ground. Note it is *not* white and *not* black — cards sit brighter than the page in light mode and brighter than the page in dark mode both.
- **Paper Card** (`hsla(200,15%,100%,1)` light / `hsla(200,15%,11%,1)` dark): Every card, tile and raised surface.
- **Paper Line** (`hsla(200,15%,89%,1)` light / `hsla(200,15%,18%,1)` dark): Hairline separators and the Track's empty/unfilled bars.
- **Ink** (`hsla(200,15%,8%,1)` light / `hsla(200,15%,91%,1)` dark): Primary text.
- **Ink Muted** (`hsla(200,15%,40%,1)` light / `hsla(200,15%,59%,1)` dark): Secondary text, units, timestamps, inactive tab labels, icon-only glyph defaults.

### Named Rules

**The One Green Rule.** Mineral green is the only green that appears in the
interface. If a surface needs to feel positive without being actionable,
it uses ink and ember, not a second green.

**The Earned Ember Rule.** Ember never marks something the user has not
earned. It cannot be used to draw attention to a new feature, a promotion, or
an empty state. A streak of zero is grey; a streak of one is ember.

**The Scarcity Rule.** On any screen outside a paywall, colored pixels stay
under roughly 10% of the surface. If a screen reads as colorful, a color is
doing decoration instead of work — remove it.

## Typography

**Display / Body / Label Font:** Inter (with `system-ui, sans-serif` fallback), loaded as Inter Medium and Inter Bold.

**Character:** A single-family system. Inter is the right call here and needs
no companion: the app is overwhelmingly numbers, short Turkish labels, and
timed single words, and a display face would fight all three. Hierarchy comes
from weight and size, never from a change of voice. Turkish diacritics
(İ, ı, ğ, ş, ç, ö, ü) render cleanly in Inter at every weight, which is why
it stays.

### Hierarchy

- **Display** (700, 62px, 72px line-height): The pre-exercise countdown only — `3`, `2`, `1`. Nothing else in the app is allowed at this size.
- **Word** (800, 42px, 52px line-height, centered): The exercise runner's live word. The heaviest weight in the system, because it is read in ~200ms and must resolve instantly at any position on screen.
- **Headline** (700, 30px): Screen titles — "Egzersizler", the home greeting. One per screen, top-left, never centered.
- **Title** (700, 20px): Card headings, section headings, exercise names.
- **Body** (400/500, 14px, 24px line-height): Descriptions, list rows, settings labels. Two-line clamp on exercise descriptions.
- **Label** (500, 12px): Units (WPM, dk, %), timestamps, category tags, tab bar labels (11px), badge text.

Big numbers sit at 20px (`$7`) with `fontWeight: bold` and their unit
trailing at 12px in ink-muted — the number is the content, the unit is
annotation.

### Named Rules

**The No-Caps Rule.** Never `text-transform: uppercase` on Turkish text.
Uppercasing `i` in Turkish produces `I` where the language requires `İ`, and
the platform's locale-naive uppercase silently corrupts words. Labels get
weight and color, not caps. The one exception already in the tree is the
literal ASCII token `PRO`.

**The Unit Demotion Rule.** A measurement is one typographic object with two
weights: the number at title weight and size, the unit at label size in
ink-muted, inline. Never the same size, never the same color.

**The sp Rule.** All type scales with the system font size. No fixed-pixel
text that ignores the OS accessibility setting.

## Layout

A single-column, vertically scrolled phone layout, portrait-locked. There is
no tablet or landscape variant and none is implied.

- **Screen padding:** 18px (`$4`) horizontal and vertical on every scroll container. This is the app's outer margin and it does not vary by screen.
- **Section rhythm:** 24px (`$5`) between major blocks on the home screen; 18px (`$4`) between peer cards in a list; 13px (`$3`) between a heading and its content; 7px (`$2`) inside a row.
- **Card interior:** 18px (`$4`) for content cards, 13px (`$3`) for compact stat tiles.
- **Stat row:** three equal-flex tiles with 13px (`$3`) gutters, each stacking a 12px label over a 20px value.
- **Exercise runner:** a three-zone vertical layout — top bar (exit control, progress, percentage), a flex-1 optically centered stage, and a bottom control cluster — with 32px (`$8`) of extra breathing room top and bottom beyond the standard 18px so the stage never crowds the system bars.
- **Insets:** every screen applies safe-area edges explicitly. The runner additionally must clear the gesture navigation bar, since its primary control sits at the bottom.

### Named Rules

**The One Column Rule.** Content is a single column at every width. Never a
two-column grid on a phone; the three-up stat row is a row of tiles, not a
grid, and it is the only horizontal split in the system.

**The 48dp Rule.** Every tappable target is at least 48×48dp with 8dp
between neighbors. `size="$4.5"` is exactly 48px and is the floor for any
Button; `size="$3"` (36px) is below it and is never correct for something
tappable. Switches keep their Material proportions and reach 48dp through
`hitSlop` instead.

## Elevation & Depth

The system is **layered with soft lift**. Cards genuinely rise off the page:
wide, low-opacity, largely vertical shadows that read as diffuse ambient
light rather than a hard drop. There is no hard 1px outline as the primary
depth cue — a hairline may exist as a *fallback* where shadow is invisible,
never as the main separator.

Dark mode inverts the mechanic, because a shadow on a near-black ground
carries no information. Depth there is tonal: the card steps from
`hsla(200,15%,8%)` to `hsla(200,15%,11%)`, with a 1px `hsla(200,15%,18%)`
hairline. Same hierarchy, different physics.

**This lives in exactly one place.** `AppCard` (`src/components/ui/AppCard.tsx`)
owns the surface decision — background, radius, padding, and the light/dark
depth split. Every card in the app goes through it; no screen re-specifies
`borderWidth` / `borderColor` / `elevation` itself. Adding those props back at
a call site is how the flat-outlined look returns.

### Shadow Vocabulary

On Android the shadow is drawn by `elevation`, not by the iOS shadow props —
Material's elevation curve is already an ambient plus key shadow pair, which
is exactly the "wide and faint" behavior described here, so the values stay
low rather than fighting it. The `box-shadow` equivalents below are the
intent, and what RN Web and the planned iOS build render.

- **Lift Rest** (`elevation: 2`; `0 6px 16px rgba(…,0.07)`): Every card and stat tile at rest. `<AppCard>` default.
- **Lift Raised** (`elevation: 4`; `0 12px 28px rgba(…,0.10)`): The one card carrying the screen's primary action — the daily-plan card on home. `<AppCard lift="raised">`.
- **Lift Overlay** (`elevation: 12`; `0 12px 48px rgba(…,0.20)`): Achievement popup, dialogs, bottom sheets. `<AppCard lift="overlay">`.
- **Dark-mode substitution** (no shadow; `$backgroundHover` sits one tonal level above `$background`, plus a 1px `$borderColor` hairline): applied automatically by `AppCard` in any dark theme.

### Named Rules

**The Diffuse Light Rule.** Shadows are wide and faint, never tight and
dark. Blur radius is always at least 4× the Y offset, and opacity never
exceeds 0.20. A shadow that reads as a distinct edge is wrong.

**The Tonal Dark Rule.** Dark mode conveys depth with tonal steps and a
hairline, not shadow. Never ship a dark card whose only separation from the
page is a shadow nobody can see.

**The Press Rule.** Interactive surfaces respond by scaling to 0.98, not by
changing shadow. Depth states the hierarchy; scale confirms the touch.

## Shapes

Gently softened rectangles throughout — soft enough to feel handled, never
so soft they read as toy-like.

- **Cards, buttons, tiles:** 9px (`$4`). This is the system default and covers the overwhelming majority of surfaces.
- **Compact containers** (icon tiles behind an exercise glyph, small badges): 7px (`$3`).
- **Hairline chart elements** (Track bars, streak baseline strip): 2–3px, top corners only on bars — the bar is anchored to a baseline, so its bottom corners stay square.
- **Fully round:** streak badge, achievement pill, and every circular icon button (34px / `$10` radius, or true circles). Round is reserved for *status and control*, never for content containers.

There are no cut corners, no asymmetric radii, no borders thicker than 1px,
and no decorative strokes. Form language is uniform on purpose: the shape
system carries no meaning, so shape changes never distract from the data,
which does.

### Named Rules

**The Square Baseline Rule.** Anything sitting on a measurement baseline
(chart bars, progress fills) keeps square bottom corners. Rounding both ends
of a bar detaches it from the axis it is measured against.

## Components

### Buttons

- **Shape:** Softly rounded (9px), full-width in cards, hugging in rows.
- **Primary:** Mineral green ground, white label at body size and bold weight, 52px tall (`size="$5"`). One per screen region. This is `theme="accent"` in Tamagui terms — never a hardcoded green.
- **Press:** Ground deepens one accent step and the button scales to 0.98. No shadow change, no color flash.
- **Outlined / Ghost:** Transparent ground, ink-muted label, hairline border. Used for the unselected state of category chips and for secondary dismissals. Never two outlined buttons adjacent to a primary — the hierarchy collapses.
- **Circular icon:** 64px (`size="$6"`) for the exercise runner's play/pause — the single most-pressed control in the app and deliberately oversized. 44px minimum everywhere else.

### Chips

- **Style:** The category filter row. Selected = mineral green ground, white label. Unselected = transparent with a hairline and ink-muted label.
- **Behavior:** Horizontally scrolling, no wrap, no scroll indicator, 7px (`$2`) gutters. The "all" chip leads and is selected by default.
- **State:** Single-select only. Never multi-select; the filter is a view switch, not a query builder.

### Cards / Containers

- **Corner Style:** 9px.
- **Background:** Paper Card — one tonal step off the page ground in both themes.
- **Shadow Strategy:** Lift Rest by default; Lift Raised for the one card carrying the screen's primary action (the daily-plan card on home).
- **Border:** None in light mode once soft lift lands. 1px Paper Line in dark mode, always.
- **Internal Padding:** 18px (`$4`); 13px (`$3`) for compact tiles.
- **Pressable cards** scale to 0.98 and never change color.

### Inputs / Fields

The app has almost no text entry — it is a tapping and timing product. The
input vocabulary is sliders (exercise configuration: word count, WPM, chunk
size, grid size) and switches (settings).

- **Sliders:** Always *controlled* by value, never `defaultValue`. Adaptive difficulty writes a new value after mount, and an uncontrolled slider leaves the thumb showing the previous run's setting while the number beside it shows the new one.
- **Slider readout:** the numeric value sits adjacent at title size with its unit demoted, per the Unit Demotion Rule.
- **Switches:** Material switches, mineral green when on.

### Navigation

- **Style:** A four-destination bottom navigation bar — Ana Sayfa, Egzersizler, İstatistikler, Ayarlar — on the page ground with a hairline top border. Lucide icons at the platform default size.
- **Active:** Mineral green icon and label. *(Currently wired to `$green10`; this is part of the Radix-green drift and should resolve to the accent ramp.)*
- **Inactive:** Ink-muted icon and label.
- **Labels:** 11px, weight 500, always visible — never icon-only.
- **Exercise runners are outside the tab bar.** Entering an exercise is a full-screen push with its own exit control, so nothing competes with the timed task. The system Back gesture must exit the runner exactly as the X control does, including releasing the daily-plan flow lock.

### Track — the signature component

The app's one distinctive visual object, and the literal expression of the
North Star. A compact horizontal bar strip, one bar per day:

- **Bar height** encodes reading speed (WPM), normalized across the window.
- **Bar fill**, drawn as a second mineral-green bar on the same column, encodes comprehension as a proportion of that height. The two read as one two-tone bar: how fast, and how much of that speed was real.
- **Empty days** still draw a 5%-height sliver in Paper Line, so a gap reads as "no session" rather than as a rendering failure.
- **Beneath the bars**, a 3px baseline strip of per-day pips: ember where the streak was alive, Paper Line where it was not.
- **Two sizes:** 32px compact (inline, in cards) and 62px expanded (statistics screen). It animates only in the runner's live-drawing mode, at 350ms timing.

The Track is never decorated — no axis labels, no gridlines, no legend, no
tooltip. It is a texture that rewards a two-second glance, and its
legibility comes entirely from the two-tone encoding.

### Achievement popup

The one moment the system is allowed to celebrate. Enters with a bouncy
spring from `opacity: 0, scale: 0.9, y: 10`, carries Lift Overlay, and queues
strictly — multiple simultaneous unlocks play in sequence, never stacked. It
is in-memory only and deliberately does not survive an app kill, so a stale
celebration can never replay days later.

## Do's and Don'ts

### Do:

- **Do** route every primary action through `theme="accent"` so it picks up the mineral ramp and its solved on-accent text color in both themes.
- **Do** keep the neutral ground at `hue 200, saturation 15%`. Cards are one tonal step off the page, never pure white or pure black.
- **Do** give every measurement a demoted unit: number at 20px bold, unit at 12px ink-muted, inline.
- **Do** put every card through `AppCard`, and pick its `lift` (`rest` / `raised` / `overlay`) by what the card is for, not by how it should look.
- **Do** keep exercise runner screens monochrome: ink on paper, one accent control, a hairline progress bar. The word is the only thing with weight.
- **Do** size every tappable Button to `$4.5` (48px) or larger, and give Material controls that keep smaller proportions - switches - a `hitSlop` that reaches 48dp.
- **Do** use `sp`-scaling type everywhere so the OS font-size setting works.
- **Do** honor the system Back gesture as a full equal of the on-screen exit control, including releasing the daily-plan flow lock.
- **Do** keep the Track's bottom corners square and its empty days visible as slivers.

### Don't:

- **Don't** re-specify `borderWidth`, `borderColor`, `backgroundColor` or `elevation` on a card at a call site. `AppCard` owns the surface; overriding it at one screen is how the flat-outlined look creeps back.
- **Don't** use the brand mark `#2DBE73` inside the interface. It belongs to the icon, splash, adaptive-icon background and notification color, and nowhere else.
- **Don't** apply `text-transform: uppercase` to Turkish text. Locale-naive uppercasing turns `i` into `I` where Turkish requires `İ`.
- **Don't** use ember for anything the user has not earned — no "new!" flags, no promotional highlights, no empty-state illustrations.
- **Don't** put more than one primary green button in a screen region.
- **Don't** give the Track an axis, gridline, legend, or tooltip.
- **Don't** add chrome to an exercise runner — no headers, no branding, no tips, no secondary buttons beside the play control.
- **Don't** use `defaultValue` on a configuration slider; adaptive difficulty writes after mount and the thumb will lie.
- **Don't** use tight dark shadows (offset ≥ blur, opacity > 0.20) or rely on shadow alone for separation in dark mode.
- **Don't** ship a hardcoded hex in a component. Every color resolves through a Tamagui theme token so light, dark and system all stay correct.
