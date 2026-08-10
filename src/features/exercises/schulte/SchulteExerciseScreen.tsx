import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useSchulteEngine } from './useSchulteEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

interface SchulteExerciseScreenProps {
  gridSize: number;
  timeLimitMs: number;
  onComplete?: () => void;
}

export function SchulteExerciseScreen({ gridSize, timeLimitMs, onComplete }: SchulteExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);

  const {
    session,
    grid,
    expectedNumber,
    isCompleted,
    isTimeUp,
    errors,
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
    const isSuccess = expectedNumber > gridSize * gridSize;
    return (
      <YStack f={1} bg="$background" jc="center" ai="center" p="$4" gap="$4">
        <Text fontSize="$8" fontWeight="bold" color={isSuccess ? '$green10' : '$red10'}>
          {isSuccess 
            ? t('exercises.schulte.completed', 'Tabloyu başarıyla tamamladınız!') 
            : t('common.timeUp', 'Süre doldu!')}
        </Text>
        <Text fontSize="$4" color="$colorSubtitle">
          Hedef: {expectedNumber - 1} / {gridSize * gridSize} | Hata: {errors}
        </Text>
        <Button size="$5" theme="active" onPress={() => onComplete ? onComplete() : router.back()}>
          {t('common.done', 'Bitir')}
        </Button>
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
        <Button size="$3" circular variant="outlined" onPress={handleExit}>X</Button>
        <Text color="$colorSubtitle" fontSize="$3">
          Sıradaki: <Text fontWeight="bold" color="$color">{expectedNumber}</Text>
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
                {row.map((num, colIndex) => {
                  const isPressed = num < expectedNumber;
                  return (
                    <Button
                      key={`cell-${rowIndex}-${colIndex}`}
                      width={60}
                      height={60}
                      bg={isPressed ? '$green5' : '$backgroundHover'}
                      onPress={() => handleNumberPress(num)}
                      disabled={isPressed || session.state !== 'running'}
                    >
                      <Text fontSize="$6" fontWeight="bold" color={isPressed ? '$green11' : '$color'}>
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
          theme="active"
          onPress={handleTogglePlay}
          disabled={countdown !== null}
        >
          {session.state === 'running' ? 'Duraklat' : 'Başlat'}
        </Button>
      </XStack>
    </YStack>
  );
}
