import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, XStack, YStack } from "tamagui";
import { computeTrackLayout, type TrackPoint } from "./trackLayout";

export type TrackSize = "compact" | "expanded";

const SIZE_PRESETS: Record<TrackSize, { height: number }> = {
  compact: { height: 32 },
  expanded: { height: 62 },
};

// Empty slots still draw a faint track-colored sliver instead of nothing,
// so a day with no session reads as "no data" rather than a rendering gap.
const EMPTY_FLOOR = 0.08;

export interface TrackProps {
  data: TrackPoint[];
  size?: TrackSize;
  /** Overrides the preset height (px). */
  height?: number;
  /** Show the streak baseline strip below the bars. */
  showBaseline?: boolean;
  /**
   * Spoken summary of what the bars say. Pass a label wherever the Track is the
   * only carrier of a fact, and omit it where the Track is decoration.
   */
  accessibilityLabel?: string;
}

export function Track({
  data,
  size = "expanded",
  height,
  showBaseline = true,
  accessibilityLabel,
}: TrackProps) {
  const theme = useTheme();
  const trackHeight = height ?? SIZE_PRESETS[size].height;
  const bars = computeTrackLayout(data);

  const accentColor = theme.green9?.val as string;
  const emberColor = theme.orange9?.val as string;
  const trackColor = theme.color8?.val as string;

  const a11yProps = accessibilityLabel
    ? ({ accessible: true, accessibilityRole: "image" as const, accessibilityLabel })
    : ({
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants" as const,
      });

  return (
    <YStack gap="$2" {...a11yProps}>
      <XStack height={trackHeight} width="100%" alignItems="flex-end" gap="$2">
        {bars.map((bar, i) => {
          const trackHeightPct = bar.empty
            ? EMPTY_FLOOR * 100
            : Math.max(bar.heightRatio * 100, EMPTY_FLOOR * 100);
          const fillHeightPct = bar.empty ? 0 : bar.heightRatio * bar.fillRatio * 100;

          return (
            <View key={i} style={styles.barColumn}>
              {/* Underlying WPM Track Bar */}
              <View
                style={[
                  styles.barTrack,
                  {
                    height: `${trackHeightPct}%`,
                    backgroundColor: trackColor,
                  },
                ]}
              >
                {/* Accent Comprehension Fill Bar */}
                {fillHeightPct > 0 && (
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.min(100, (fillHeightPct / trackHeightPct) * 100)}%`,
                        backgroundColor: accentColor,
                      },
                    ]}
                  />
                )}
              </View>
            </View>
          );
        })}
      </XStack>

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

const styles = StyleSheet.create({
  barColumn: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barTrack: {
    width: "100%",
    maxWidth: 28,
    borderRadius: 3,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    borderRadius: 3,
  },
});
