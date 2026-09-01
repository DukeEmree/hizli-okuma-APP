import React from 'react';
import { WordRecognitionExerciseScreen } from "@/features/exercises/word-recognition/WordRecognitionExerciseScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';

export default function Route() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const markStepCompleted = useDailyPlanStore(s => s.markStepCompleted);

  // Default to 60s if not provided via config
  const timeLimitMs = params.timeLimitMs ? parseInt(params.timeLimitMs as string, 10) : 60000;

  const handleComplete = () => {
    markStepCompleted('word-recognition');
    router.back();
  };
  
  return (
    <WordRecognitionExerciseScreen 
      timeLimitMs={timeLimitMs}
      onComplete={handleComplete}
    />
  );
}
