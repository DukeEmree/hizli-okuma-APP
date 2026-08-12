import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useComprehensionSpeedEngine } from './useComprehensionSpeedEngine';
import { useRouter } from 'expo-router';
import { Play, Pause, X } from 'lucide-react-native';
import { haptics } from '@/lib/haptics';
import { ExerciseCompletionActions } from '@/features/exercises/shared/ExerciseCompletionActions';

interface ComprehensionSpeedExerciseScreenProps {
  timeLimitMs: number;
  onComplete?: () => void;
}

export function ComprehensionSpeedExerciseScreen({ timeLimitMs, onComplete }: ComprehensionSpeedExerciseScreenProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);

  const {
    session,
    currentItem,
    phase,
    currentQuestionIndex,
    correctCount,
    totalAttempts,
    isCompleted,
    wpm,
    start,
    pause,
    resume,
    handleFinishedReading,
    handleSelection
  } = useComprehensionSpeedEngine({ timeLimitMs }, () => {});

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
          Egzersiz Tamamlandı!
        </Text>
        <Text fontSize="$4" color="$color11">
          Hız: {wpm} WPM
        </Text>
        <Text fontSize="$4" color="$color11">
          Doğru: {correctCount} / {totalAttempts} | Kavrama: %{accuracy}
        </Text>
        <ExerciseCompletionActions exerciseType="comprehension-speed" onFinish={() => onComplete ? onComplete() : router.back()} />
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="$background" jc="space-between" ai="center" p="$4" pt="$8" pb="$8">
      <XStack w="100%" jc="space-between" ai="center">
        <Button size="$3" circular variant="outlined" onPress={handleExit} icon={X} accessibilityLabel="Çıkış" accessibilityRole="button" />
        {phase === 'questions' && (
          <Text color="$color11" fontSize="$3">
            Soru: <Text fontWeight="bold" color="$color">{currentQuestionIndex + 1}/{currentItem?.questions.length}</Text>
          </Text>
        )}
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
                  {currentItem.text}
                </Text>
                <Button size="$5" theme="accent" onPress={handleFinishedReading}>
                  Okumayı Bitirdim
                </Button>
              </YStack>
            ) : phase === 'questions' && session.state === 'running' && currentItem ? (
              <YStack w="100%" gap="$6" ai="center" px="$4">
                <Text textAlign="center" fontSize="$8" fontWeight="bold" color="$color" fontFamily="$body" mb="$4">{currentItem.questions[currentQuestionIndex].question}</Text>
                <YStack w="100%" gap="$3">
                  {currentItem.questions[currentQuestionIndex].options.map((opt, i) => (
                    <Button 
                      key={i} 
                      onPress={() => handleSelection(i)} 
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
         icon={session.state === 'running' ? <Pause size={24} color="white" /> : <Play size={24} color="white" />} accessibilityLabel={session.state === 'running' ? 'Duraklat' : 'Başlat'} accessibilityRole="button" />
      </XStack>
    </YStack>
  );
}
