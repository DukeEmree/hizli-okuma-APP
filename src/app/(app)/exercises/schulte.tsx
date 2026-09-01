import React from 'react';
import { SchulteExerciseScreen } from "@/features/exercises/schulte/SchulteExerciseScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';

export default function SchulteRoute() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const gridSize = params.gridSize ? parseInt(params.gridSize as string, 10) : 5;
  const timeLimitMs = params.timeLimitMs ? parseInt(params.timeLimitMs as string, 10) : 60000;
  const markStepCompleted = useDailyPlanStore(s => s.markStepCompleted);

  return (
    <SchulteExerciseScreen
      gridSize={gridSize}
      timeLimitMs={timeLimitMs}
      onComplete={() => {
        markStepCompleted('schulte');
        router.replace('/(app)/(tabs)/exercises');
      }}
    />
  );
}
