import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useNumberScanEngine } from './useNumberScanEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Play, Pause, X } from 'lucide-react-native';
import { haptics } from '@/lib/haptics';
import { computeGridLayout } from '@/features/exercises/gridLayout';
import { ExerciseCompletionActions } from '@/features/exercises/shared/ExerciseCompletionActions';

interface NumberScanExerciseScreenProps {
  timeLimitMs: number;
  onComplete?: () => void;
}

export function NumberScanExerciseScreen({ timeLimitMs, onComplete }: NumberScanExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);
  const { width, height } = useWindowDimensions();

  const {
    session,
    targetNumber,
    gridNumbers,
    correctCount,
    totalAttempts,
    isCompleted,
    start,
    pause,
    resume,
    handleSelection
  } = useNumberScanEngine({ timeLimitMs }, () => {});

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
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    return (
      <YStack f={1} bg="$background" jc="center" ai="center" p="$4" gap="$4">
        <Text fontSize="$8" fontWeight="bold" color="$green10">
          {t('numberScan.completed', { ns: 'exercises' })}
        </Text>
        <Text fontSize="$4" color="$color11">
          {t('resultAccuracy', { correct: correctCount, total: totalAttempts, accuracy })}
        </Text>
        <ExerciseCompletionActions exerciseType="number-scan" onFinish={() => onComplete ? onComplete() : router.back()} />
      </YStack>
    );
  }

  // Calculate generic columns based on grid length.
  const cols = Math.ceil(Math.sqrt(gridNumbers.length));
  const gridLayout = computeGridLayout(width, cols, {
    availableHeight: height,
    rows: Math.ceil(gridNumbers.length / cols),
  });
  const { gap: gridGap, hitSlop: cellHitSlop } = gridLayout;
  // Each slot carries `gridGap / 2` of margin on every side, so a row of
  // `cols` slots is one whole gap wider than the board's cell-to-cell width.
  const maxGridWidth = gridLayout.boardWidth + gridGap;
  const itemSize = gridLayout.cellSize;

  return (
    <YStack f={1} bg="$background" jc="space-between" ai="center" p="$4" pt="$8" pb="$8">
      <XStack w="100%" jc="space-between" ai="center">
        <Button size="$4.5" circular variant="outlined" onPress={handleExit} icon={X} accessibilityLabel={t('exit', { ns: 'common' })} accessibilityRole="button" />
        <Text color="$color11" fontSize="$3">
          {t('resultScore')} <Text fontWeight="bold" color="$color">{correctCount}/{totalAttempts}</Text>
        </Text>
      </XStack>

      <YStack f={1} w="100%" jc="center" ai="center">
        {countdown !== null ? (
          <Text fontSize="$12" fontWeight="bold" color="$color">
            {countdown}
          </Text>
        ) : (
          <YStack f={1} w="100%" jc="center" ai="center">
            {session.state === 'running' && targetNumber > 0 ? (
              <YStack gap="$4" ai="center" w="100%">
                <Text fontSize="$8" fontWeight="bold" color="$green10" fontFamily="$body">
                  {t('numberScan.findPrompt', { ns: 'exercises', target: targetNumber })}
                </Text>
                
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: maxGridWidth,
                  justifyContent: 'center'
                }}>
                  {gridNumbers.map((num, i) => (
                    <View key={i} style={{ width: itemSize, height: itemSize, margin: gridGap / 2 }}>
                      <Button
                        w="100%"
                        h="100%"
                        p={0}
                        hitSlop={{ top: cellHitSlop, bottom: cellHitSlop, left: cellHitSlop, right: cellHitSlop }}
                        bg="$backgroundHover"
                        onPress={() => {
                          if (num === targetNumber) haptics.light();
                          else haptics.error();
                          handleSelection(num);
                        }}
                      >
                        <Text fontSize={itemSize * 0.4} fontWeight="bold" color="$color" fontFamily="$body">{num}</Text>
                      </Button>
                    </View>
                  ))}
                </View>
              </YStack>
            ) : null}
          </YStack>
        )}
      </YStack>

      <XStack w="100%" jc="center" ai="center" mt="$4">
        <Button 
          size="$6" 
          circular 
          theme="accent"
          onPress={handleTogglePlay}
          disabled={countdown !== null}
         icon={session.state === 'running' ? <Pause size={24} /> : <Play size={24} />} accessibilityLabel={t(session.state === 'running' ? 'pause' : 'start', { ns: 'common' })} accessibilityRole="button" />
      </XStack>
    </YStack>
  );
}
