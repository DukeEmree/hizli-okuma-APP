import React, { useState, useEffect, useCallback, memo } from 'react';
import { useWindowDimensions } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useScanningEngine } from './useScanningEngine';
import type { ScanningCell } from './useScanningEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Play, Pause, X } from 'lucide-react-native';
import { haptics } from '@/lib/haptics';
import { ExerciseCompletionActions } from '@/features/exercises/shared/ExerciseCompletionActions';

interface ScanningExerciseScreenProps {
  gridSize: number;
  timeLimitMs: number;
  targetCount: number;
  targetSymbol: string;
  distractorSymbol: string;
  onComplete?: () => void;
}

// Responsive calculations - mirrors Schulte's sizing so cells never
// clip/overflow on narrow screens at high grid sizes.
const HORIZONTAL_PADDING = 32; // p="$4" on both sides (16 * 2)
const GAP_SIZE = 8; // gap="$2"

// Memoized so a tap on one cell (or the once-a-second elapsed-time tick,
// which re-renders the whole screen) doesn't force every other cell in the
// grid through Tamagui's style resolution - that was the real cause of the
// grid getting janky (and missed corner taps) the longer a run went on.
const ScanCell = memo(function ScanCell({
  cell,
  cellSize,
  cellFontSize,
  disabled,
  onCellPress,
}: {
  cell: ScanningCell;
  cellSize: number;
  cellFontSize: '$5' | '$6';
  disabled: boolean;
  onCellPress: (id: number, isTarget: boolean) => void;
}) {
  return (
    <Button
      width={cellSize}
      height={cellSize}
      padding={0}
      hitSlop={{ top: GAP_SIZE / 2, bottom: GAP_SIZE / 2, left: GAP_SIZE / 2, right: GAP_SIZE / 2 }}
      bg={cell.isFound ? '$green5' : '$backgroundHover'}
      onPress={() => onCellPress(cell.id, cell.isTarget)}
      disabled={disabled}
    >
      <Text fontSize={cellFontSize} fontWeight="bold" color={cell.isFound ? '$green11' : '$color'}>
        {cell.symbol}
      </Text>
    </Button>
  );
});

export function ScanningExerciseScreen({ 
  gridSize, 
  timeLimitMs,
  targetCount,
  targetSymbol,
  distractorSymbol,
  onComplete
}: ScanningExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);
  const { width: screenWidth } = useWindowDimensions();

  const {
    session,
    grid,
    foundCount,
    roundsCompleted,
    roundTargetCount,
    isCompleted,
    isTimeUp,
    errors,
    start,
    pause,
    resume,
    handleCellPress
  } = useScanningEngine({
    gridSize, 
    timeLimitMs, 
    targetCount, 
    targetSymbol, 
    distractorSymbol 
  }, () => {});

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const tId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(tId);
    } else if (countdown === 0) {
      const tId = setTimeout(() => {
        setCountdown(null);
        start();
      }, 0);
      return () => clearTimeout(tId);
    }
  }, [countdown, start]);

  useEffect(() => {
    if (isCompleted || isTimeUp) haptics.success();
  }, [isCompleted, isTimeUp]);

  const handleExit = () => {
    pause();
    router.back();
  };

  const handleCellTap = useCallback((id: number, isTarget: boolean) => {
    if (isTarget) haptics.light();
    else haptics.error();
    handleCellPress(id);
  }, [handleCellPress]);

  const handleTogglePlay = () => {
    if (session.state === 'running') {
      pause();
    } else if (session.state === 'paused') {
      resume();
    }
  };

  if (isCompleted || isTimeUp) {
    const isSuccess = foundCount >= targetCount;
    return (
      <YStack f={1} bg="$background" jc="center" ai="center" p="$4" gap="$4">
        <Text fontSize="$8" fontWeight="bold" color={isSuccess ? '$green10' : '$red10'}>
          {t('common.timeUp', 'Süre doldu!')}
        </Text>
        <Text fontSize="$4" color="$color11">
          Toplam bulunan: {foundCount} | Tur: {roundsCompleted + 1} | Hata: {errors}
        </Text>
        <ExerciseCompletionActions exerciseType="scanning" onFinish={() => onComplete ? onComplete() : router.back()} />
      </YStack>
    );
  }

  // Grid hesaplamaları
  const rows = [];
  for (let i = 0; i < gridSize; i++) {
    rows.push(grid.slice(i * gridSize, (i + 1) * gridSize));
  }

  const availableWidth = screenWidth - HORIZONTAL_PADDING - ((gridSize - 1) * GAP_SIZE);
  const cellSize = Math.min(64, Math.floor(availableWidth / gridSize));
  const cellFontSize = cellSize > 45 ? '$6' : '$5';
  const roundFoundCount = grid.filter((cell) => cell.isFound).length;

  return (
    <YStack f={1} bg="$background" jc="space-between" ai="center" p="$4" pt="$8" pb="$8">
      <XStack w="100%" jc="space-between" ai="center">
        <Button size="$3" circular variant="outlined" onPress={handleExit} icon={X} accessibilityLabel="Çıkış" accessibilityRole="button" />
        <Text color="$color11" fontSize="$3">
          Hedef: <Text fontWeight="bold" color="$color">"{targetSymbol}"</Text> ({roundFoundCount}/{roundTargetCount}) · Toplam: {foundCount}
        </Text>
      </XStack>

      <YStack f={1} w="100%" jc="center" ai="center">
        {countdown !== null ? (
          <Text fontSize="$12" fontWeight="bold" color="$color">
            {countdown}
          </Text>
        ) : (
          <YStack gap="$2" w="100%" ai="center" jc="center">
            {rows.map((row, rowIndex) => (
              <XStack key={`row-${rowIndex}`} gap="$2" w="100%" jc="center">
                {row.map((cell) => (
                  <ScanCell
                    key={`cell-${cell.id}`}
                    cell={cell}
                    cellSize={cellSize}
                    cellFontSize={cellFontSize}
                    disabled={cell.isFound || session.state !== 'running'}
                    onCellPress={handleCellTap}
                  />
                ))}
              </XStack>
            ))}
          </YStack>
        )}
      </YStack>

      <XStack w="100%" jc="center" ai="center" gap="$6">
        <Button 
          size="$6" 
          circular 
          theme="accent"
          onPress={handleTogglePlay}
          disabled={countdown !== null}
         icon={session.state === 'running' ? <Pause size={24} color="white" /> : <Play size={24} color="white" />} accessibilityLabel={session.state === 'running' ? 'Duraklat' : 'Başlat'} accessibilityRole="button" />
      </XStack>
    </YStack>
  );
}
