import React from 'react';
import { PeripheralExerciseScreen } from "@/features/exercises/peripheral/PeripheralExerciseScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';

export default function Route() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const markStepCompleted = useDailyPlanStore(s => s.markStepCompleted);

  // Default to 60s if not provided via config
  const timeLimitMs = params.timeLimitMs ? parseInt(params.timeLimitMs as string, 10) : 60000;

  const handleComplete = () => {
    if (markStepCompleted('peripheral')) return;
    router.back();
  };
  
  return (
    <PeripheralExerciseScreen 
      timeLimitMs={timeLimitMs}
      onComplete={handleComplete}
    />
  );
}
