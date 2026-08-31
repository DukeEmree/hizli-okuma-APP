import React, { useState, useEffect } from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useMemoryEngine } from './useMemoryEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Play, Pause, X } from 'lucide-react-native';
import { haptics } from '@/lib/haptics';
import { ExerciseCompletionActions } from '@/features/exercises/shared/ExerciseCompletionActions';

interface MemoryExerciseScreenProps {
  timeLimitMs: number;
  onComplete?: () => void;
}

export function MemoryExerciseScreen({ timeLimitMs, onComplete }: MemoryExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);

  const {
    session,
    targetWords,
    options,
    selectedWords,
    phase,
    correctCount,
    totalAttempts,
    isCompleted,
    start,
    pause,
    resume,
    handleSelection
  } = useMemoryEngine({ timeLimitMs }, () => {});

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
          {t('memory.completed', { ns: 'exercises' })}
        </Text>
        <Text fontSize="$4" color="$color11">
          {t('resultAccuracy', { correct: correctCount, total: totalAttempts, accuracy })}
        </Text>
        <ExerciseCompletionActions exerciseType="memory" onFinish={() => onComplete ? onComplete() : router.back()} />
      </YStack>
    );
  }

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
            {phase === 'memorize' && session.state === 'running' ? (
              <YStack gap="$4" ai="center">
                <Text fontSize="$8" fontWeight="bold" color="$color" fontFamily="$body">{t('memory.recallPrompt', { ns: 'exercises' })}</Text>
                <XStack flexWrap="wrap" jc="center" gap="$3">
                  {targetWords.map((word, i) => (
                    <Text key={i} fontSize="$8" fontWeight="bold" color="$color" fontFamily="$body">{word}</Text>
                  ))}
                </XStack>
              </YStack>
            ) : phase === 'recall' && session.state === 'running' ? (
              <YStack w="100%" gap="$6" ai="center">
                <Text textAlign="center" fontSize="$4" fontFamily="$body" color="$color11" mb="$2">{t('memory.selectPrompt', { ns: 'exercises', selected: selectedWords.length, total: targetWords.length })}</Text>
                <XStack flexWrap="wrap" jc="center" gap="$3">
                  {options.map((opt, i) => {
                    const isSelected = selectedWords.includes(opt);
                    return (
                      <Button
                        key={i}
                        onPress={() => {
                          if (!isSelected) {
                            if (targetWords.includes(opt)) haptics.light();
                            else haptics.error();
                          }
                          handleSelection(opt);
                        }}
                        minWidth={120}
                        size="$4"
                        bg={isSelected ? '$green9' : '$backgroundHover'}
                      >
                        {opt}
                      </Button>
                    );
                  })}
                </XStack>
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
