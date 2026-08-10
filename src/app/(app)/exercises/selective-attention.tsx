import React from 'react';
import { SelectiveAttentionExerciseScreen } from "@/features/exercises/selective-attention/SelectiveAttentionExerciseScreen";
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
    <SelectiveAttentionExerciseScreen 
      timeLimitMs={timeLimitMs}
      onComplete={handleComplete}
    />
  );
}
