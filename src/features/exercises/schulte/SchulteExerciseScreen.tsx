import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useSchulteEngine } from './useSchulteEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Play, Pause, X } from 'lucide-react-native';
import { haptics } from '@/lib/haptics';
import { ExerciseCompletionActions } from '@/features/exercises/shared/ExerciseCompletionActions';

interface SchulteExerciseScreenProps {
  gridSize: number;
  timeLimitMs: number;
  onComplete?: () => void;
}

export function SchulteExerciseScreen({ gridSize, timeLimitMs, onComplete }: SchulteExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);
  const { width: screenWidth } = useWindowDimensions();

  const {
    session,
    grid,
    gridSize: currentGridSize,
    expectedNumber,
    isCompleted,
    errors,
    roundsCompleted,
    totalCorrect,
    tableVersion,
    start,
    pause,
    resume,
    handleNumberPress
  } = useSchulteEngine({ gridSize, timeLimitMs }, () => {});

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
    if (isCompleted) haptics.success();
  }, [isCompleted]);

  const handleExit = () => {
    pause();
    router.back();
  };

  const handleTogglePlay = () => {
    if (session.state === 'running') {
      pause();
    } else if (session.state === 'paused') {
      resume();
    }
  };

  if (isCompleted) {
    return (
      <YStack f={1} bg="$background" jc="center" ai="center" p="$4" gap="$4">
        <Text fontSize="$8" fontWeight="bold" color="$color">
          {t('timeUp', 'Süre doldu!')}
        </Text>
        <Text fontSize="$4" color="$color11">
          {t('schulte.resultLine', 'Tablo: {{tables}} | Doğru: {{correct}} | Hata: {{errors}}', { ns: 'exercises', tables: roundsCompleted, correct: totalCorrect, errors })}
        </Text>
        <ExerciseCompletionActions exerciseType="schulte" onFinish={() => onComplete ? onComplete() : router.back()} />
      </YStack>
    );
  }

  // Grid hesaplamaları
  const rows = [];
  for (let i = 0; i < currentGridSize; i++) {
    rows.push(grid.slice(i * currentGridSize, (i + 1) * currentGridSize));
  }

  // Responsive calculations
  const HORIZONTAL_PADDING = 32; // p="$4" on both sides (16 * 2)
  const GAP_SIZE = 8; // gap="$2"
  const availableWidth = screenWidth - HORIZONTAL_PADDING - ((currentGridSize - 1) * GAP_SIZE);
  const cellSize = Math.min(60, Math.floor(availableWidth / currentGridSize));
  const cellFontSize = cellSize > 45 ? '$6' : '$5';

  return (
    <YStack f={1} bg="$background" jc="space-between" ai="center" p="$4" pt="$8" pb="$8">
      <XStack w="100%" jc="space-between" ai="center">
        <Button size="$3" circular variant="outlined" onPress={handleExit} icon={X} accessibilityLabel={t('exit', { ns: 'common' })} accessibilityRole="button" />
        <Text color="$color11" fontSize="$3">
          {t('schulte.nextLabel', 'Tablo {{table}} · Sıradaki:', { ns: 'exercises', table: roundsCompleted + 1 })} <Text fontWeight="bold" color="$color">{expectedNumber}</Text>
        </Text>
      </XStack>

      <YStack f={1} w="100%" jc="center" ai="center">
        {countdown !== null ? (
          <Text fontSize="$12" fontWeight="bold" color="$color">
            {countdown}
          </Text>
        ) : (
          <YStack gap="$2" w="100%" ai="center" jc="center" position="relative">
            <YStack
              position="absolute"
              top="50%"
              left="50%"
              width={10}
              height={10}
              marginTop={-5}
              marginLeft={-5}
              borderRadius={999}
              bg="$blue10"
              zIndex={1}
              pointerEvents="none"
            />
            {rows.map((row, rowIndex) => (
              <XStack key={`row-${tableVersion}-${rowIndex}`} gap="$2" w="100%" jc="center">
                {row.map((num, colIndex) => {
                  const isPressed = num < expectedNumber;
                  return (
                    <Button
                      key={`cell-${tableVersion}-${rowIndex}-${colIndex}`}
                      width={cellSize}
                      height={cellSize}
                      padding={0}
                      bg={isPressed ? '$green5' : '$backgroundHover'}
                      onPress={() => {
                        if (num === expectedNumber) haptics.light();
                        else haptics.error();
                        handleNumberPress(num);
                      }}
                      disabled={isPressed || session.state !== 'running'}
                    >
                      <Text fontSize={cellFontSize} fontWeight="bold" color={isPressed ? '$green11' : '$color'}>
                        {num}
                      </Text>
                    </Button>
                  );
                })}
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
         icon={session.state === 'running' ? <Pause size={24} color="white" /> : <Play size={24} color="white" />} accessibilityLabel={t(session.state === 'running' ? 'pause' : 'start', { ns: 'common' })} accessibilityRole="button" />
      </XStack>
    </YStack>
  );
}
