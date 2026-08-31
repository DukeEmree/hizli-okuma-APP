import React, { useState, useEffect } from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useSelectiveAttentionEngine } from './useSelectiveAttentionEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Play, Pause, X } from 'lucide-react-native';
import { haptics } from '@/lib/haptics';
import { ExerciseCompletionActions } from '@/features/exercises/shared/ExerciseCompletionActions';

interface SelectiveAttentionExerciseScreenProps {
  timeLimitMs: number;
  onComplete?: () => void;
}

export function SelectiveAttentionExerciseScreen({ timeLimitMs, onComplete }: SelectiveAttentionExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);

  const {
    session,
    targetCategoryName,
    gridWords,
    selectedWords,
    correctWordsInGrid,
    correctCount,
    errorCount,
    isCompleted,
    start,
    pause,
    resume,
    handleSelection
  } = useSelectiveAttentionEngine({ timeLimitMs }, () => {});

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
    const total = correctCount + errorCount;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return (
      <YStack f={1} bg="$background" jc="center" ai="center" p="$4" gap="$4">
        <Text fontSize="$8" fontWeight="bold" color="$green10">
          {t('selectiveAttention.completed', { ns: 'exercises' })}
        </Text>
        <Text fontSize="$4" color="$color11">
          {t('selectiveAttention.resultLine', { ns: 'exercises', correct: correctCount, incorrect: errorCount, accuracy })}
        </Text>
        <ExerciseCompletionActions exerciseType="selective-attention" onFinish={() => onComplete ? onComplete() : router.back()} />
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="$background" jc="space-between" ai="center" p="$4" pt="$8" pb="$8">
      <XStack w="100%" jc="space-between" ai="center">
        <Button size="$4.5" circular variant="outlined" onPress={handleExit} icon={X} accessibilityLabel={t('exit', { ns: 'common' })} accessibilityRole="button" />
        <Text color="$color11" fontSize="$3">
          {t('resultScore')} <Text fontWeight="bold" color="$green10">{correctCount}</Text> / <Text fontWeight="bold" color="$red10">{errorCount}</Text>
        </Text>
      </XStack>

      <YStack f={1} w="100%" jc="center" ai="center">
        {countdown !== null ? (
          <Text fontSize="$12" fontWeight="bold" color="$color">
            {countdown}
          </Text>
        ) : (
          <YStack f={1} w="100%" jc="center" ai="center">
            {session.state === 'running' && gridWords.length > 0 ? (
              <YStack gap="$4" ai="center" w="100%">
                <Text fontSize="$8" fontWeight="bold" color="$green10" fontFamily="$body">
                  {t('selectiveAttention.categoryLabel', { ns: 'exercises', category: targetCategoryName })}
                </Text>
                <Text fontSize="$4" color="$color11" fontFamily="$body" mb="$2">
                  {t('selectiveAttention.categoryPrompt', { ns: 'exercises' })}
                </Text>
                
                <XStack flexWrap="wrap" jc="center" gap="$2" px="$2">
                  {gridWords.map((word, i) => {
                    const isSelected = selectedWords.includes(word);
                    const isCorrect = correctWordsInGrid.includes(word);
                    
                    let bg = '$backgroundHover';
                    let color = '$color';
                    if (isSelected) {
                        if (isCorrect) {
                            bg = '$green9';
                            color = 'white';
                        } else {
                            bg = '$red8';
                            color = 'white';
                        }
                    }

                    return (
                      <Button 
                        key={i}
                        onPress={() => {
                          if (isCorrect) haptics.light();
                          else haptics.error();
                          handleSelection(word);
                        }}
                        size="$4.5"
                        minWidth={100}
                        bg={bg as any}
                        color={color as any}
                      >
                        {word}
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
