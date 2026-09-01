import React from 'react';
import { ScanningExerciseScreen } from "@/features/exercises/scanning/ScanningExerciseScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';

export default function ScanningRoute() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const gridSize = params.gridSize ? parseInt(params.gridSize as string, 10) : 5;
  const timeLimitMs = params.timeLimitMs ? parseInt(params.timeLimitMs as string, 10) : 60000;
  const targetCount = params.targetCount ? parseInt(params.targetCount as string, 10) : 3;
  const targetSymbol = (params.targetSymbol as string) || 'B';
  const distractorSymbol = (params.distractorSymbol as string) || 'A';
  const markStepCompleted = useDailyPlanStore(s => s.markStepCompleted);

  return (
    <ScanningExerciseScreen
      gridSize={gridSize}
      timeLimitMs={timeLimitMs}
      targetCount={targetCount}
      targetSymbol={targetSymbol}
      distractorSymbol={distractorSymbol}
      onComplete={() => {
        markStepCompleted('scanning');
        router.replace('/(app)/(tabs)/exercises');
      }}
    />
  );
}
