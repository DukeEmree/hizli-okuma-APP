import React, { useMemo } from 'react';
import { RSVPExerciseScreen } from "@/features/exercises/rsvp/RSVPExerciseScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COMPREHENSION_TEXTS } from "@/constants/content";
import { useComprehensionStore } from "@/stores/useComprehensionStore";
import { DifficultyLevel, ExerciseResult } from "@/types/exercise";
import { pickByDifficulty } from "@/features/exercises/contentSelection";
import { useDailyPlanStore } from '@/stores/dailyPlanStore';

const DEFAULT_TEXT = "Hızlı okuma bir ayrıcalık değil, sonradan kazanılabilen bir beceridir. Beynimiz kelimeleri tek tek değil, bloklar halinde algılama kapasitesine sahiptir. Göz kaslarımızı eğiterek ve iç sesimizi baskılayarak okuma hızımızı katlayabiliriz.";

export default function RSVPRoute() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const wpm = params.wpm ? parseInt(params.wpm as string, 10) : 250;
  const textId = params.textId as string;
  const initialDifficulty = (params.initialDifficulty ? parseInt(params.initialDifficulty as string, 10) : 5) as DifficultyLevel;
  const setComprehensionContext = useComprehensionStore(s => s.setComprehensionContext);
  const markStepCompleted = useDailyPlanStore(s => s.markStepCompleted);
  const activeFlowType = useDailyPlanStore(s => s.activeFlowType);

  // eslint-disable-next-line react-hooks/purity
  const [pickedText] = React.useState(() => pickByDifficulty(COMPREHENSION_TEXTS, initialDifficulty));

  const activeText = useMemo(() => {
    if (textId) {
      return COMPREHENSION_TEXTS.find(t => t.id === textId) || null;
    }
    return pickedText;
  }, [textId, pickedText]);

  const handleComplete = (result: ExerciseResult) => {
    // Always mark the plan step done if today's plan includes it - but only
    // skip RSVP's own ad-hoc comprehension-text follow-up when this run is
    // actually the daily-plan's chained flow (activeFlowType is set only
    // when launched from the daily-plan list). Otherwise `rsvp` merely
    // being a coincidental part of today's plan would silently swallow the
    // follow-up for a standalone run started from the Egzersizler tab.
    const isActiveFlowStep = activeFlowType === result.exerciseType;
    markStepCompleted(result.exerciseType);
    if (isActiveFlowStep) return;
    if (activeText) {
      setComprehensionContext(result, activeText);
      router.replace('/(app)/exercises/comprehension');
    }
  };
  
  return (
    <RSVPExerciseScreen 
      wpm={wpm} 
      text={activeText ? activeText.content : DEFAULT_TEXT} 
      skipDefaultStorage={!!activeText}
      onComplete={handleComplete}
    />
  );
}
