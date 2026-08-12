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
}

export function Track({ data, size = "expanded", height, live = false, showBaseline = true }: TrackProps) {
  const theme = useTheme();
  const trackHeight = height ?? SIZE_PRESETS[size].height;
  const bars = computeTrackLayout(data);

  const accentColor = (theme.accent9?.val ?? theme.accent2?.val) as string;
  const emberColor = theme.orange9?.val as string;
  const trackColor = theme.borderColor?.val as string;

  // One bar per day, drawn in two layers on the same column: a full
  // WPM-height "track" bar underneath, and a shorter accent "fill" bar on
  // top sized to WPM * comprehension — together they read as a single
  // two-tone bar, same trick the design uses.
  const chartData = bars.map((bar, i) => ({
    x: i,
    trackY: bar.empty ? EMPTY_FLOOR : Math.max(bar.heightRatio, EMPTY_FLOOR),
    fillY: bar.empty ? 0 : bar.heightRatio * bar.fillRatio,
  }));

  return (
    <YStack gap="$2">
      <View style={{ height: trackHeight, width: "100%" }}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={["trackY", "fillY"]}
          domain={{ y: [0, 1] }}
          domainPadding={{ left: 6, right: 6, top: 2, bottom: 0 }}
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
