import React from 'react';
import { MemoryExerciseScreen } from "@/features/exercises/memory/MemoryExerciseScreen";
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
    <MemoryExerciseScreen 
      timeLimitMs={timeLimitMs}
      onComplete={handleComplete}
    />
  );
}
