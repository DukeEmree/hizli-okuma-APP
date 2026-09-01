import React, { useRef, useState, useCallback } from 'react';
import { YStack, Text, Button, XStack, ScrollView, Progress } from 'tamagui';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useComprehensionStore } from "@/stores/useComprehensionStore";
import { useCreateSession } from "@/hooks/useCreateSession";
import { calculateReadingScore, CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";
import { AppCard } from '@/components/ui/AppCard';
import { ExerciseCompletionActions } from '@/features/exercises/shared/ExerciseCompletionActions';

export function ComprehensionScreen() {
  const router = useRouter();
  const { t } = useTranslation('exercises');

  const activeText = useComprehensionStore(state => state.activeText);
  const pendingResult = useComprehensionStore(state => state.pendingResult);
  const clearComprehensionContext = useComprehensionStore(state => state.clearComprehensionContext);
  const createSession = useCreateSession();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const isAnsweringRef = useRef(false);

  const finishComprehension = useCallback(async (finalAnswers: number[]) => {
    if (!activeText || !pendingResult) return;

    let correctCount = 0;
    finalAnswers.forEach((ans, idx) => {
      if (ans === activeText.questions[idx]?.correctAnswerIndex) {
        correctCount++;
      }
    });

    const accuracy = activeText.questions.length > 0 ? correctCount / activeText.questions.length : 0;
    const comprehensionScore = Math.round(accuracy * 100);

    const updatedMetrics = {
      ...pendingResult.metrics,
      comprehensionScore,
      comprehensionAccuracy: accuracy,
    };
    
    const recalculatedScore = calculateReadingScore(
      updatedMetrics,
      pendingResult.durationMs,
      pendingResult.difficulty
    );

    const finalResult = {
      ...pendingResult,
      score: recalculatedScore,
      metrics: updatedMetrics,
      algorithmVersion: CURRENT_ALGORITHM_VERSION,
    };

    try {
      await createSession({
        // eslint-disable-next-line react-hooks/purity
        clientSessionId: finalResult.exerciseId + '-' + Date.now().toString(),
        exerciseId: finalResult.exerciseId,
        exerciseType: finalResult.exerciseType,
        startedAt: finalResult.startedAt,
        completedAt: finalResult.completedAt,
        durationMs: finalResult.durationMs,
        difficulty: finalResult.difficulty,
        score: finalResult.score.finalScore,
        metrics: finalResult.metrics,
        algorithmVersion: finalResult.algorithmVersion,
      }, finalResult);
    } catch (err) {
      console.error('Error saving comprehension result:', err);
    }

    setIsFinished(true);
  }, [activeText, pendingResult, createSession]);

  // Eğer store'da veri yoksa hata ekranı göster
  if (!activeText || !pendingResult) {
    return (
      <YStack f={1} ai="center" jc="center" p="$4" bg="$background">
        <Text color="$color" fontSize="$5" mb="$4">
          {t('comprehensionFlow.notFound')}
        </Text>
        <Button size="$4.5" onPress={() => router.replace('/(app)/(tabs)/exercises')}>
          {t('comprehensionFlow.back')}
        </Button>
      </YStack>
    );
  }

  const questions = activeText.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;

  const handleAnswer = (optionIndex: number) => {
    if (isAnsweringRef.current) return;
    isAnsweringRef.current = true;

    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      isAnsweringRef.current = false;
    } else {
      finishComprehension(newAnswers);
    }
  };

  const handleFinish = () => {
    clearComprehensionContext();
    router.replace('/(app)/(tabs)/exercises');
  };

  if (isFinished) {
    let correctCount = 0;
    answers.forEach((ans, idx) => {
      if (ans === questions[idx]?.correctAnswerIndex) correctCount++;
    });
    const comprehensionScore = Math.round((correctCount / questions.length) * 100);

    return (
      <YStack f={1} bg="$background" p="$4" ai="center" jc="center" gap="$4">
        <Text fontSize="$8" fontWeight="bold" color="$color">
          {t('comprehensionFlow.completedTitle')}
        </Text>
        
        <AppCard w="100%" maxWidth={400} ai="center">
          <Text fontSize="$6" mb="$2" color="$color">
            {t('comprehensionFlow.readingSpeed')}
          </Text>
          <Text fontSize="$8" fontWeight="bold" color="$green10">
            {t('comprehensionFlow.wpmUnit', { wpm: pendingResult.metrics.wpm || 0 })}
          </Text>
        </AppCard>

        <AppCard w="100%" maxWidth={400} ai="center">
          <Text fontSize="$6" mb="$2" color="$color">
            {t('comprehensionFlow.comprehensionRate')}
          </Text>
          <Text fontSize="$8" fontWeight="bold" color="$green10">
            {t('comprehensionFlow.percentUnit', { score: comprehensionScore })}
          </Text>
        </AppCard>
        
        <ExerciseCompletionActions
          exerciseType={pendingResult.exerciseType}
          onFinish={handleFinish}
        />
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="$background" p="$4" gap="$4">
      <XStack ai="center" jc="space-between">
        <Text color="$color11">
          {t('comprehensionFlow.questionProgress', { current: currentQuestionIndex + 1, total: questions.length })}
        </Text>
        <Progress value={progress} max={100} width={150}>
          <Progress.Indicator transition="quick" />
        </Progress>
      </XStack>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text fontSize="$6" fontWeight="bold" color="$color" mt="$4" mb="$6">
          {currentQuestion.text}
        </Text>

        <YStack gap="$3">
          {currentQuestion.options.map((option, idx) => (
            <Button
              key={idx}
              size="$5"
              height="auto"
              variant="outlined"
              onPress={() => handleAnswer(idx)}
              justifyContent="flex-start"
              paddingHorizontal="$4"
              paddingVertical="$3"
            >
              <Text color="$color" fontSize="$4" flexWrap="wrap" flexShrink={1}>{option}</Text>
            </Button>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
