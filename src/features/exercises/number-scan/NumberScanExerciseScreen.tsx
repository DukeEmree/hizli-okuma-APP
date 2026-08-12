import React, { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useNumberScanEngine } from './useNumberScanEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Play, Pause, X } from 'lucide-react-native';
import { haptics } from '@/lib/haptics';
import { ExerciseCompletionActions } from '@/features/exercises/shared/ExerciseCompletionActions';

interface NumberScanExerciseScreenProps {
  timeLimitMs: number;
  onComplete?: () => void;
}

export function NumberScanExerciseScreen({ timeLimitMs, onComplete }: NumberScanExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);
  const { width } = Dimensions.get('window');

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
          {t('common.timeUp', 'Süre doldu!')}
        </Text>
        <Text fontSize="$4" color="$color11">
          Doğru: {correctCount} / {totalAttempts} | Doğruluk: %{accuracy}
        </Text>
        <ExerciseCompletionActions exerciseType="number-scan" onFinish={() => onComplete ? onComplete() : router.back()} />
      </YStack>
    );
  }

  // Calculate generic columns based on grid length.
  const cols = Math.ceil(Math.sqrt(gridNumbers.length));
  const maxGridWidth = Math.min(width - 32, 400); // 32 is padding
  const itemSize = maxGridWidth / cols - 8; // 8 is margin

  return (
    <YStack f={1} bg="$background" jc="space-between" ai="center" p="$4" pt="$8" pb="$8">
      <XStack w="100%" jc="space-between" ai="center">
        <Button size="$3" circular variant="outlined" onPress={handleExit} icon={X} accessibilityLabel="Çıkış" accessibilityRole="button" />
        <Text color="$color11" fontSize="$3">
          Skor: <Text fontWeight="bold" color="$color">{correctCount}/{totalAttempts}</Text>
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
                  Şu sayıyı bul: {targetNumber}
                </Text>
                
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: maxGridWidth,
                  justifyContent: 'center'
                }}>
                  {gridNumbers.map((num, i) => (
                    <View key={i} style={{ width: itemSize, height: itemSize, margin: 4 }}>
                      <Button 
                        w="100%" 
                        h="100%" 
                        p={0} 
                        bg="$backgroundHover"
                        onPress={() => handleSelection(num)}
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
         icon={session.state === 'running' ? <Pause size={24} color="white" /> : <Play size={24} color="white" />} accessibilityLabel={session.state === 'running' ? 'Duraklat' : 'Başlat'} accessibilityRole="button" />
      </XStack>
    </YStack>
  );
}
