import React, { useState, useEffect } from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useScanningEngine } from './useScanningEngine';
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

  const {
    session,
    grid,
    foundCount,
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
          {isSuccess 
            ? t('exercises.scanning.completed', 'Tüm hedefleri başarıyla buldunuz!') 
            : t('common.timeUp', 'Süre doldu!')}
        </Text>
        <Text fontSize="$4" color="$color11">
          Hedef: {foundCount} / {targetCount} | Hata: {errors}
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

  return (
    <YStack f={1} bg="$background" jc="space-between" ai="center" p="$4" pt="$8" pb="$8">
      <XStack w="100%" jc="space-between" ai="center">
        <Button size="$3" circular variant="outlined" onPress={handleExit} icon={X} accessibilityLabel="Çıkış" accessibilityRole="button" />
        <Text color="$color11" fontSize="$3">
          Hedef: <Text fontWeight="bold" color="$color">"{targetSymbol}"</Text> ({foundCount}/{targetCount})
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
                {row.map((cell) => {
                  return (
                    <Button
                      key={`cell-${cell.id}`}
                      width={50}
                      height={50}
                      bg={cell.isFound ? '$green5' : '$backgroundHover'}
                      onPress={() => handleCellPress(cell.id)}
                      disabled={cell.isFound || session.state !== 'running'}
                    >
                      <Text fontSize="$6" fontWeight="bold" color={cell.isFound ? '$green11' : '$color'}>
                        {cell.symbol}
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
         icon={session.state === 'running' ? <Pause size={24} color="white" /> : <Play size={24} color="white" />} accessibilityLabel={session.state === 'running' ? 'Duraklat' : 'Başlat'} accessibilityRole="button" />
      </XStack>
    </YStack>
  );
}
