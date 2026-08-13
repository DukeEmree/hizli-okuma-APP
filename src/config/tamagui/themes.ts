import { green, greenDark, yellow, yellowDark } from "@tamagui/colors";
import { createV5Theme, defaultChildrenThemes } from "@tamagui/config/v5";
import { v5ComponentThemes } from "@tamagui/themes/v5";

// Neutral bg/surface/border/muted-text ramp — "İz" design system palette.
// $background = step 1, $backgroundHover (card surface) = step 0 (light) / step 2
// (dark), $borderColor = step 3, $color11 (muted text) = step 10 — see Tamagui's
// v5 palette offset math (PALETTE_BACKGROUND_OFFSET) for why those steps land there.
const darkPalette = [
  "hsla(200, 15%, 2%, 1)",
  "hsla(200, 15%, 8%, 1)",
  "hsla(200, 15%, 11%, 1)",
  "hsla(200, 15%, 18%, 1)",
  "hsla(200, 15%, 24%, 1)",
  "hsla(200, 15%, 30%, 1)",
  "hsla(200, 15%, 36%, 1)",
  "hsla(200, 15%, 41%, 1)",
  "hsla(200, 15%, 47%, 1)",
  "hsla(200, 15%, 53%, 1)",
  "hsla(200, 15%, 59%, 1)",
  "hsla(200, 15%, 91%, 1)",
];
const lightPalette = [
  "hsla(200, 15%, 100%, 1)",
  "hsla(200, 15%, 96%, 1)",
  "hsla(200, 15%, 93%, 1)",
  "hsla(200, 15%, 89%, 1)",
  "hsla(200, 15%, 82%, 1)",
  "hsla(200, 15%, 75%, 1)",
  "hsla(200, 15%, 68%, 1)",
  "hsla(200, 15%, 61%, 1)",
  "hsla(200, 15%, 54%, 1)",
  "hsla(200, 15%, 47%, 1)",
  "hsla(200, 15%, 40%, 1)",
  "hsla(200, 15%, 8%, 1)",
];

// Custom accent color theme — mineral yeşil-teal (design's #0E8F6E / #3EC6A0).
// $accent-themed Button backgrounds resolve to accent2; accent11/12 are the
// on-accent text color (white on the light teal, dark ink on the pale dark-mode
// mint, since #3EC6A0 is too light for white text to stay legible).
const accentLight = {
  accent1: "hsl(165, 82%, 29%)",
  accent2: "hsl(165, 82%, 31%)",
  accent3: "hsl(165, 82%, 34%)",
  accent4: "hsl(165, 82%, 36%)",
  accent5: "hsl(165, 82%, 39%)",
  accent6: "hsl(165, 82%, 41%)",
  accent7: "hsl(165, 82%, 44%)",
  accent8: "hsl(165, 82%, 46%)",
  accent9: "hsl(165, 82%, 49%)",
  accent10: "hsl(165, 82%, 51%)",
  accent11: "#FFFFFF",
  accent12: "#FFFFFF",
};

const accentDark = {
  accent1: "hsl(163, 54%, 48%)",
  accent2: "hsl(163, 54%, 51%)",
  accent3: "hsl(163, 54%, 54%)",
  accent4: "hsl(163, 54%, 56%)",
  accent5: "hsl(163, 54%, 59%)",
  accent6: "hsl(163, 54%, 62%)",
  accent7: "hsl(163, 54%, 65%)",
  accent8: "hsl(163, 54%, 67%)",
  accent9: "hsl(163, 54%, 70%)",
  accent10: "hsl(163, 54%, 73%)",
  accent11: "#08201A",
  accent12: "#08201A",
};

// Ember (streak/premium) and alert (danger) ramps — same shape as Tamagui's
// stock orange/red radix scales, hue/lightness shifted so step 9 lands on the
// design's ember (#B4762A / #E0A33E) and alert (#C8503F / #E0574A) colors.
// These replace the default 'orange'/'red' children themes below, so existing
// $orange9/$orange10 and $red9/$red10 usages pick up the new colors for free.
const emberLight = {
  orange1: "hsl(33, 62%, 90%)",
  orange2: "hsl(33, 62%, 87%)",
  orange3: "hsl(33, 62%, 83%)",
  orange4: "hsl(33, 62%, 76%)",
  orange5: "hsl(33, 62%, 71%)",
  orange6: "hsl(33, 62%, 66%)",
  orange7: "hsl(33, 62%, 62%)",
  orange8: "hsl(33, 62%, 54%)",
  orange9: "hsl(33, 62%, 44%)",
  orange10: "hsl(33, 62%, 38%)",
  orange11: "hsl(33, 62%, 31%)",
  orange12: "hsl(33, 62%, 14%)",
};
const emberDark = {
  orange1: "hsl(37, 72%, 11%)",
  orange2: "hsl(37, 72%, 12%)",
  orange3: "hsl(37, 72%, 16%)",
  orange4: "hsl(37, 72%, 17%)",
  orange5: "hsl(37, 72%, 20%)",
  orange6: "hsl(37, 72%, 26%)",
  orange7: "hsl(37, 72%, 34%)",
  orange8: "hsl(37, 72%, 44%)",
  orange9: "hsl(37, 72%, 56%)",
  orange10: "hsl(37, 72%, 60%)",
  orange11: "hsl(37, 72%, 71%)",
  orange12: "hsl(37, 72%, 92%)",
};
const alertLight = {
  red1: "hsl(7, 55%, 92%)",
  red2: "hsl(7, 55%, 91%)",
  red3: "hsl(7, 55%, 88%)",
  red4: "hsl(7, 55%, 86%)",
  red5: "hsl(7, 55%, 83%)",
  red6: "hsl(7, 55%, 79%)",
  red7: "hsl(7, 55%, 74%)",
  red8: "hsl(7, 55%, 67%)",
  red9: "hsl(7, 55%, 52%)",
  red10: "hsl(7, 55%, 48%)",
  red11: "hsl(7, 55%, 42%)",
  red12: "hsl(7, 55%, 17%)",
};
const alertDark = {
  red1: "hsl(5, 71%, 8%)",
  red2: "hsl(5, 71%, 9%)",
  red3: "hsl(5, 71%, 14%)",
  red4: "hsl(5, 71%, 18%)",
  red5: "hsl(5, 71%, 23%)",
  red6: "hsl(5, 71%, 29%)",
  red7: "hsl(5, 71%, 37%)",
  red8: "hsl(5, 71%, 48%)",
  red9: "hsl(5, 71%, 58%)",
  red10: "hsl(5, 71%, 64%)",
  red11: "hsl(5, 71%, 78%)",
  red12: "hsl(5, 71%, 90%)",
};

const builtThemes = createV5Theme({
  darkPalette,
  lightPalette,
  componentThemes: v5ComponentThemes,
  accent: {
    light: accentLight,
    dark: accentDark,
  },
  childrenThemes: {
    // Include default color themes (blue, red, green, yellow, etc.)
    ...defaultChildrenThemes,

    // Recolor the stock orange/red scales to the design's ember/alert tokens
    // so existing $orange9/$red10-style usages update without a rename.
    orange: {
      light: emberLight,
      dark: emberDark,
    },
    red: {
      light: alertLight,
      dark: alertDark,
    },

    // Semantic color themes for warnings, errors, and success states
    warning: {
      light: yellow,
      dark: yellowDark,
    },
    error: {
      light: alertLight,
      dark: alertDark,
    },
    success: {
      light: green,
      dark: greenDark,
    },
  },
});

export type Themes = typeof builtThemes;

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === "client" &&
  process.env.NODE_ENV === "production"
    ? ({} as any)
    : (builtThemes as any);
