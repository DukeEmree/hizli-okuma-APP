import React from 'react';
import { NumberScanExerciseScreen } from "@/features/exercises/number-scan/NumberScanExerciseScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Route() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // Default to 60s if not provided via config
  const timeLimitMs = params.timeLimitMs ? parseInt(params.timeLimitMs as string, 10) : 60000;

  const handleComplete = () => {
    router.back();
  };
  
  return (
    <NumberScanExerciseScreen 
      timeLimitMs={timeLimitMs}
      onComplete={handleComplete}
    />
  );
}
