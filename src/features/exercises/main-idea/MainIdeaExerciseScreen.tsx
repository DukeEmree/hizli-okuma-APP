import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useMainIdeaEngine } from './useMainIdeaEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Play, Pause, X } from 'lucide-react-native';
import { haptics } from '@/lib/haptics';
import { ExerciseCompletionActions } from '@/features/exercises/shared/ExerciseCompletionActions';

interface MainIdeaExerciseScreenProps {
  timeLimitMs: number;
  onComplete?: () => void;
}

export function MainIdeaExerciseScreen({ timeLimitMs, onComplete }: MainIdeaExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);

  const {
    session,
    currentItem,
    currentQuestion,
    questionIndex,
    questionCount,
    phase,
    correctCount,
    totalAttempts,
    isCompleted,
    start,
    pause,
    resume,
    handleFinishedReading,
    handleSelection
  } = useMainIdeaEngine({ timeLimitMs }, () => {});

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
          {t('timeUp', 'Süre doldu!')}
        </Text>
        <Text fontSize="$4" color="$color11">
          {t('resultAccuracy', 'Doğru: {{correct}} / {{total}} | Doğruluk: %{{accuracy}}', { correct: correctCount, total: totalAttempts, accuracy })}
        </Text>
        <ExerciseCompletionActions exerciseType="main-idea" onFinish={() => onComplete ? onComplete() : router.back()} />
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="$background" jc="space-between" ai="center" p="$4" pt="$8" pb="$8">
      <XStack w="100%" jc="space-between" ai="center">
        <Button size="$3" circular variant="outlined" onPress={handleExit} icon={X} accessibilityLabel={t('exit', { ns: 'common' })} accessibilityRole="button" />
        <Text color="$color11" fontSize="$3">
          {t('resultScore', 'Skor:')} <Text fontWeight="bold" color="$color">{correctCount}/{totalAttempts}</Text>
        </Text>
      </XStack>

      <YStack f={1} w="100%" jc="center" ai="center">
        {countdown !== null ? (
          <Text fontSize="$12" fontWeight="bold" color="$color">
            {countdown}
          </Text>
        ) : (
          <ScrollView style={{ width: '100%', flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            {phase === 'read' && session.state === 'running' && currentItem ? (
              <YStack gap="$6" ai="center" px="$4">
                <Text fontSize="$6" lineHeight="$8" textAlign="justify" color="$color" fontFamily="$body">
                  {currentItem.paragraph}
                </Text>
                <Button size="$5" theme="accent" onPress={handleFinishedReading}>
                  {t('mainIdea.readDone', 'Okudum', { ns: 'exercises' })}
                </Button>
              </YStack>
            ) : phase === 'question' && session.state === 'running' && currentQuestion ? (
              <YStack w="100%" gap="$6" ai="center" px="$4">
                <Text color="$color11" fontSize="$3">{t('questionOfTotal', 'Soru {{index}} / {{total}}', { index: questionIndex + 1, total: questionCount })}</Text>
                <Text textAlign="center" fontSize="$8" fontWeight="bold" color="$color" fontFamily="$body" mb="$4">{currentQuestion.question}</Text>
                <YStack w="100%" gap="$3">
                  {currentQuestion.options.map((opt, i) => (
                    <Button
                      key={i}
                      onPress={() => {
                        if (i === currentQuestion.correctIndex) haptics.light();
                        else haptics.error();
                        handleSelection(i);
                      }}
                      size="$5"
                    >
                      <Text fontSize="$4" color="$color" fontFamily="$body" style={{ whiteSpace: 'normal', textAlign: 'center' }}>
                        {opt}
                      </Text>
                    </Button>
                  ))}
                </YStack>
              </YStack>
            ) : null}
          </ScrollView>
        )}
      </YStack>

      <XStack w="100%" jc="center" ai="center" mt="$4">
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
