import React from 'react';
import { View, TurboModuleRegistry, NativeModules } from 'react-native';
import { Svg, Polyline, Rect, Line as SvgLine, Circle } from 'react-native-svg';
import { Text, YStack } from 'tamagui';

/**
 * Checks safely whether the native Skia TurboModule is registered in the binary.
 * Uses `get` (returns null) instead of `getEnforcing` (which throws an unhandled crash).
 */
export function isSkiaAvailable(): boolean {
  try {
    return TurboModuleRegistry.get('RNSkiaModule') != null || (NativeModules && NativeModules.RNSkiaModule != null);
  } catch {
    return false;
  }
}

// Lazy reference to victory-native module
let victoryNativeModule: typeof import('victory-native') | null = null;
let victoryNativeFailed = false;

function getVictoryNative() {
  if (victoryNativeFailed || !isSkiaAvailable()) return null;
  if (victoryNativeModule) return victoryNativeModule;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    victoryNativeModule = require('victory-native');
    return victoryNativeModule;
  } catch {
    victoryNativeFailed = true;
    return null;
  }
}

export interface ChartDataPoint {
  x: number;
  y: number;
  [key: string]: unknown;
}

export interface SafeLineChartProps {
  data: ChartDataPoint[];
  color: string;
  height?: number;
  strokeWidth?: number;
  emptyText?: string;
}

export function SafeLineChart({
  data,
  color,
  height = 200,
  strokeWidth = 3,
  emptyText = 'Yeterli veri yok',
}: SafeLineChartProps) {
  if (!data || data.length < 2) {
    return (
      <YStack height={height} justifyContent="center" alignItems="center">
        <Text color="$color11">{emptyText}</Text>
      </YStack>
    );
  }

  const victory = getVictoryNative();

  if (victory) {
    const { CartesianChart, Line } = victory;
    return (
      <View style={{ height, width: '100%' }}>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={['y']}
          domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
        >
          {({ points }) => (
            <Line
              points={points.y}
              color={color}
              strokeWidth={strokeWidth}
              animate={{ type: 'timing', duration: 400 }}
            />
          )}
        </CartesianChart>
      </View>
    );
  }

  // Pure SVG Fallback for Expo Go / Web / environments without native Skia
  const width = 320;
  const padding = 24;
  const minY = Math.min(...data.map((d) => d.y));
  const maxY = Math.max(...data.map((d) => d.y));
  const rangeY = maxY - minY || 1;
  const rangeX = data.length - 1 || 1;

  const pointsString = data
    .map((d, i) => {
      const px = padding + (i / rangeX) * (width - padding * 2);
      const py = height - padding - ((d.y - minY) / rangeY) * (height - padding * 2);
      return `${px},${py}`;
    })
    .join(' ');

  return (
    <View style={{ height, width: '100%', alignItems: 'center' }}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Baseline gridline */}
        <SvgLine
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="rgba(150, 150, 150, 0.2)"
          strokeWidth={1}
        />
        {/* Polyline trend */}
        <Polyline
          points={pointsString}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Data points */}
        {data.map((d, i) => {
          const cx = padding + (i / rangeX) * (width - padding * 2);
          const cy = height - padding - ((d.y - minY) / rangeY) * (height - padding * 2);
          return (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={4}
              fill={color}
            />
          );
        })}
      </Svg>
    </View>
  );
}

export interface SafeBarChartProps {
  data: ChartDataPoint[];
  color: string;
  height?: number;
  emptyText?: string;
}

export function SafeBarChart({
  data,
  color,
  height = 200,
  emptyText = 'Yeterli veri yok',
}: SafeBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <YStack height={height} justifyContent="center" alignItems="center">
        <Text color="$color11">{emptyText}</Text>
      </YStack>
    );
  }

  const victory = getVictoryNative();

  if (victory) {
    const { CartesianChart, Bar } = victory;
    return (
      <View style={{ height, width: '100%' }}>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={['y']}
          domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
        >
          {({ points, chartBounds }) => (
            <Bar
              points={points.y}
              chartBounds={chartBounds}
              color={color}
              roundedCorners={{ topLeft: 4, topRight: 4 }}
              animate={{ type: 'timing', duration: 400 }}
            />
          )}
        </CartesianChart>
      </View>
    );
  }

  // Pure SVG Fallback for Expo Go / Web
  const width = 320;
  const padding = 20;
  const maxY = Math.max(1, ...data.map((d) => d.y));
  const availableWidth = width - padding * 2;
  const barWidth = Math.max(12, Math.min(28, (availableWidth / data.length) * 0.6));
  const stepX = availableWidth / data.length;

  return (
    <View style={{ height, width: '100%', alignItems: 'center' }}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <SvgLine
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="rgba(150, 150, 150, 0.2)"
          strokeWidth={1}
        />
        {data.map((d, i) => {
          const barHeight = Math.max(4, (d.y / maxY) * (height - padding * 2));
          const x = padding + i * stepX + (stepX - barWidth) / 2;
          const y = height - padding - barHeight;
          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={3}
              ry={3}
              fill={color}
            />
          );
        })}
      </Svg>
    </View>
  );
}
