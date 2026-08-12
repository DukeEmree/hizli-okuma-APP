import React from 'react';
import { MainIdeaExerciseScreen } from "@/features/exercises/main-idea/MainIdeaExerciseScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';

export default function Route() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const markStepCompleted = useDailyPlanStore(s => s.markStepCompleted);

  // Default to 60s if not provided via config
  const timeLimitMs = params.timeLimitMs ? parseInt(params.timeLimitMs as string, 10) : 60000;

  const handleComplete = () => {
    if (markStepCompleted('main-idea')) return;
    router.back();
  };
  
  return (
    <MainIdeaExerciseScreen 
      timeLimitMs={timeLimitMs}
      onComplete={handleComplete}
    />
  );
}
