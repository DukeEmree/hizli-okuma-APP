import React from 'react';
import { SchulteExerciseScreen } from "@/features/exercises/schulte/SchulteExerciseScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function SchulteRoute() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const gridSize = params.gridSize ? parseInt(params.gridSize as string, 10) : 5;
  const timeLimitMs = params.timeLimitMs ? parseInt(params.timeLimitMs as string, 10) : 60000;
  
  return (
    <SchulteExerciseScreen 
      gridSize={gridSize}
      timeLimitMs={timeLimitMs}
      onComplete={() => {
        router.replace('/(app)/(tabs)/exercises');
      }}
    />
  );
}
