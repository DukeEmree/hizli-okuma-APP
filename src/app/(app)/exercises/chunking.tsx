import React, { useMemo } from 'react';
import { ChunkingExerciseScreen } from "@/features/exercises/chunking/ChunkingExerciseScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COMPREHENSION_TEXTS } from "@/constants/content";
import { useComprehensionStore } from "@/stores/useComprehensionStore";
import { DifficultyLevel, ExerciseResult } from "@/types/exercise";
import { pickByDifficulty } from "@/features/exercises/contentSelection";
import { useDailyPlanStore } from '@/stores/dailyPlanStore';

const DEFAULT_TEXT = "Kelime gruplama tekniği okuma hızınızı önemli ölçüde artırır. Gözleriniz her kelime için ayrı ayrı duraklamak yerine, birkaç kelimeyi tek bir bakışta kavrar. Bu sayede hem zaman kazanırsınız hem de cümlenin bütününü daha rahat anlarsınız. Düzenli pratik yaparak göz kaslarınızı eğitebilir ve çok daha hızlı bir okuyucu olabilirsiniz.";

export default function ChunkingRoute() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const wpm = params.wpm ? parseInt(params.wpm as string, 10) : 250;
  const chunkSize = params.chunkSize ? parseInt(params.chunkSize as string, 10) : 2;
  const textId = params.textId as string;
  const initialDifficulty = (params.initialDifficulty ? parseInt(params.initialDifficulty as string, 10) : 5) as DifficultyLevel;
  const setComprehensionContext = useComprehensionStore(s => s.setComprehensionContext);
  const markStepCompleted = useDailyPlanStore(s => s.markStepCompleted);

  // eslint-disable-next-line react-hooks/purity
  const [pickedText] = React.useState(() => pickByDifficulty(COMPREHENSION_TEXTS, initialDifficulty));

  const activeText = useMemo(() => {
    if (textId) {
      return COMPREHENSION_TEXTS.find(t => t.id === textId) || null;
    }
    return pickedText;
  }, [textId, pickedText]);

  const handleComplete = (result: ExerciseResult) => {
    // A daily-plan step always chains to the next plan step, taking
    // precedence over chunking's own ad-hoc comprehension-text follow-up
    // (the plan already has a dedicated comprehension slot).
    if (markStepCompleted(result.exerciseType)) return;
    if (activeText) {
      setComprehensionContext(result, activeText);
      router.replace('/(app)/exercises/comprehension');
    }
  };
  
  return (
    <ChunkingExerciseScreen 
      wpm={wpm} 
      chunkSize={chunkSize}
      text={activeText ? activeText.content : DEFAULT_TEXT} 
      skipDefaultStorage={!!activeText}
      onComplete={handleComplete}
    />
  );
}
