import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { YStack, XStack, Text, Button, Circle } from 'tamagui';
import { usePeripheralEngine } from './usePeripheralEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Play, Pause, X } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';

interface PeripheralExerciseScreenProps {
  timeLimitMs: number;
  onComplete?: () => void;
}

export function PeripheralExerciseScreen({ timeLimitMs, onComplete }: PeripheralExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);

  const {
    session,
    currentTarget,
    options,
    position,
    distance,
    showTarget,
    correctCount,
    totalAttempts,
    isCompleted,
    start,
    pause,
    resume,
    handleSelection
  } = usePeripheralEngine({ timeLimitMs, updateIntervalMs: 2000 }, () => {});

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
        <Button size="$5" theme="accent" onPress={() => onComplete ? onComplete() : router.back()}>
          {t('common.done', 'Bitir')}
        </Button>
      </YStack>
    );
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'left': return { right: distance };
      case 'right': return { left: distance };
      case 'top': return { bottom: distance };
      case 'bottom': return { top: distance };
      default: return {};
    }
  };

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
            {/* Center Focus Dot */}
            <View style={{ position: 'relative', width: 10, height: 10, justifyContent: 'center', alignItems: 'center' }}>
              <Circle size={12} bg="$red10" />
              
              {/* Target Word */}
              {showTarget && session.state === 'running' && (
                <View style={{ position: 'absolute', ...getPositionStyles() }}>
                  <AppText variant="title" style={{ whiteSpace: 'nowrap' }}>{currentTarget}</AppText>
                </View>
              )}
            </View>

            {/* Options */}
            {!showTarget && session.state === 'running' && (
              <YStack position="absolute" bottom={0} w="100%" gap="$2">
                <AppText textAlign="center" variant="body" color="$color11" mb="$2">Gördüğünüz kelimeyi seçin:</AppText>
                <XStack flexWrap="wrap" jc="center" gap="$2">
                  {options.map((opt, i) => (
                    <Button key={i} onPress={() => handleSelection(opt)} minWidth={120}>
                      {opt}
                    </Button>
                  ))}
                </XStack>
              </YStack>
            )}
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
