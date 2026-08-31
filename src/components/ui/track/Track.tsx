import React from "react";
import { View } from "react-native";
import { Bar, CartesianChart } from "victory-native";
import { useTheme, XStack, YStack } from "tamagui";
import { computeTrackLayout, type TrackPoint } from "./trackLayout";

export type TrackSize = "compact" | "expanded";

const SIZE_PRESETS: Record<TrackSize, { height: number }> = {
  compact: { height: 32 },
  expanded: { height: 62 },
};

// Empty slots still draw a faint track-colored sliver instead of nothing,
// so a day with no session reads as "no data" rather than a rendering gap.
const EMPTY_FLOOR = 0.05;

export interface TrackProps {
  data: TrackPoint[];
  size?: TrackSize;
  /** Overrides the preset height (px). */
  height?: number;
  /** Animate bars to their new height/fill (use for the runner's live-drawing mode). */
  live?: boolean;
  /** Show the streak baseline strip below the bars. */
  showBaseline?: boolean;
  /**
   * Spoken summary of what the bars say. A Skia canvas exposes nothing to
   * TalkBack on its own, so without this the Track is silent - pass a label
   * wherever the Track is the only carrier of a fact, and omit it where the
   * Track is decoration or where an ancestor already speaks for it (the
   * weekly-summary card folds the trend into its own button label). Omitting
   * it hides the canvas from the accessibility tree rather than leaving an
   * unlabelled node for the screen reader to stop on.
   */
  accessibilityLabel?: string;
}

export function Track({
  data,
  size = "expanded",
  height,
  live = false,
  showBaseline = true,
  accessibilityLabel,
}: TrackProps) {
  const theme = useTheme();
  const trackHeight = height ?? SIZE_PRESETS[size].height;
  const bars = computeTrackLayout(data);

  // `$green9` is the mineral ramp's solid step and is authored to be identical
  // to `accent2`, so this is exactly the green of every primary button - but it
  // is reached through the Radix-ordered scale. The accent ramp is inverted
  // (accent2 is the solid, accent9/10 are its palest end, because Tamagui
  // resolves a themed Button's background to accent2), so `accent9` here was
  // rendering the comprehension fill at 1.65:1 on a light card. See the note on
  // `accentLight` in src/config/tamagui/themes.ts.
  const accentColor = theme.green9?.val as string;
  const emberColor = theme.orange9?.val as string;
  // Bar height is the WPM channel - half of the two-tone encoding - and the
  // empty-day sliver is what makes a gap read as "no session". Both were drawn
  // in `$borderColor`, a hairline tone at 1.27:1 against the card in either
  // theme, so neither was visible: the Track showed one channel, not two.
  // `$color8` reads as a mark (2.7:1 light / 3.2:1 dark) while staying clearly
  // subordinate to the fill above it.
  const trackColor = theme.color8?.val as string;

  // One bar per day, drawn in two layers on the same column: a full
  // WPM-height "track" bar underneath, and a shorter accent "fill" bar on
  // top sized to WPM * comprehension — together they read as a single
  // two-tone bar, same trick the design uses.
  const chartData = bars.map((bar, i) => ({
    x: i,
    trackY: bar.empty ? EMPTY_FLOOR : Math.max(bar.heightRatio, EMPTY_FLOOR),
    fillY: bar.empty ? 0 : bar.heightRatio * bar.fillRatio,
  }));

  const a11yProps = accessibilityLabel
    ? ({ accessible: true, accessibilityRole: "image" as const, accessibilityLabel })
    : ({
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants" as const,
      });

  return (
    <YStack gap="$2" {...a11yProps}>
      <View style={{ height: trackHeight, width: "100%" }}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={["trackY", "fillY"]}
          domain={{ y: [0, 1] }}
          domainPadding={{ left: 6, right: 6, top: 2, bottom: 0 }}
          // Victory renders a default Y axis even when no `yAxis` prop is
          // passed, which drew tick gridlines across the bars. The Track is a
          // texture, not a plotted chart - no axis, no grid, no legend.
          yAxis={[{ lineWidth: 0, lineColor: "transparent", labelColor: "transparent" }]}
        >
          {({ points, chartBounds }) => (
            <>
              <Bar
                points={points.trackY}
                chartBounds={chartBounds}
                color={trackColor}
                innerPadding={0.35}
                roundedCorners={{ topLeft: 3, topRight: 3 }}
                animate={live ? { type: "timing", duration: 350 } : undefined}
              />
              <Bar
                points={points.fillY}
                chartBounds={chartBounds}
                color={accentColor}
                innerPadding={0.35}
                roundedCorners={{ topLeft: 3, topRight: 3 }}
                animate={live ? { type: "timing", duration: 350 } : undefined}
              />
            </>
          )}
        </CartesianChart>
      </View>
      {showBaseline && (
        <XStack gap={3}>
          {bars.map((bar, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                backgroundColor: bar.streak ? emberColor : trackColor,
              }}
            />
          ))}
        </XStack>
      )}
    </YStack>
  );
}
