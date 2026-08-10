import React, { useState } from 'react';
import { YStack, Text, Button, XStack, ScrollView, Progress, Card } from 'tamagui';
import { useRouter } from 'expo-router';
import { useComprehensionStore } from "@/stores/useComprehensionStore";
import { useCreateSession } from "@/hooks/useCreateSession";
import { calculateReadingScore, CURRENT_ALGORITHM_VERSION } from "@/utils/scoring";

export function ComprehensionScreen() {
  const router = useRouter();
  const { activeText, pendingResult, clearComprehensionContext } = useComprehensionStore();
  const createSession = useCreateSession();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Eğer store'da veri yoksa hata ekranı göster
  if (!activeText || !pendingResult) {
    return (
      <YStack f={1} ai="center" jc="center" p="$4" bg="$background">
        <Text color="$color" fontSize="$5" mb="$4">
          Metin veya sonuç bulunamadı.
        </Text>
        <Button onPress={() => router.replace('/(app)/(tabs)/exercises')}>
          Geri Dön
        </Button>
      </YStack>
    );
  }

  const questions = activeText.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishComprehension(newAnswers);
    }
  };

  const finishComprehension = async (finalAnswers: number[]) => {
    // Doğru cevapları hesapla
    let correctCount = 0;
    finalAnswers.forEach((ans, idx) => {
      if (ans === questions[idx].correctAnswerIndex) {
        correctCount++;
      }
    });

    const accuracy = correctCount / questions.length;
    const comprehensionScore = Math.round(accuracy * 100);

    // Recalculate score using updated metrics
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

    // Convex'e kaydet
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
      });
    } catch (err) {
      console.error('Error saving comprehension result:', err);
    }

    setIsFinished(true);
  };

  const handleFinish = () => {
    clearComprehensionContext();
    router.replace('/(app)/(tabs)/exercises');
  };

  if (isFinished) {
    // Doğruluk oranını hesapla (tekrar) UI için
    let correctCount = 0;
    answers.forEach((ans, idx) => {
      if (ans === questions[idx].correctAnswerIndex) correctCount++;
    });
    const comprehensionScore = Math.round((correctCount / questions.length) * 100);

    return (
      <YStack f={1} bg="$background" p="$4" ai="center" jc="center" gap="$4">
        <Text fontSize="$8" fontWeight="bold" color="$color">Sonuç</Text>
        
        <Card borderWidth={1} borderColor="$borderColor" p="$4" w="100%" maxWidth={400} ai="center" bg="$backgroundHover">
          <Text fontSize="$6" mb="$2" color="$color">Okuma Hızı</Text>
          <Text fontSize="$8" fontWeight="bold" color="$green10">{pendingResult.metrics.wpm || 0} WPM</Text>
        </Card>

        <Card borderWidth={1} borderColor="$borderColor" p="$4" w="100%" maxWidth={400} ai="center" bg="$backgroundHover">
          <Text fontSize="$6" mb="$2" color="$color">Anlama Oranı</Text>
          <Text fontSize="$8" fontWeight="bold" color="$blue10">% {comprehensionScore}</Text>
        </Card>
        
        <Button size="$5" mt="$4" theme="active" onPress={handleFinish}>
          Tamamla
        </Button>
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="$background" p="$4" gap="$4">
      <XStack ai="center" jc="space-between">
        <Text color="$colorSubtle">Soru {currentQuestionIndex + 1} / {questions.length}</Text>
        <Progress value={progress} max={100} width={150}>
          <Progress.Indicator />
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
              variant="outlined"
              onPress={() => handleAnswer(idx)}
              justifyContent="flex-start"
              paddingHorizontal="$4"
            >
              <Text color="$color" fontSize="$4">{option}</Text>
            </Button>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
