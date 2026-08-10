import React, { useMemo } from 'react';
import { RSVPExerciseScreen } from "@/features/exercises/rsvp/RSVPExerciseScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COMPREHENSION_TEXTS } from "@/constants/content";
import { useComprehensionStore } from "@/stores/useComprehensionStore";
import { ExerciseResult } from "@/types/exercise";

const DEFAULT_TEXT = "Hızlı okuma bir ayrıcalık değil, sonradan kazanılabilen bir beceridir. Beynimiz kelimeleri tek tek değil, bloklar halinde algılama kapasitesine sahiptir. Göz kaslarımızı eğiterek ve iç sesimizi baskılayarak okuma hızımızı katlayabiliriz.";

export default function RSVPRoute() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const wpm = params.wpm ? parseInt(params.wpm as string, 10) : 250;
  const textId = params.textId as string;
  const setComprehensionContext = useComprehensionStore(s => s.setComprehensionContext);

  // eslint-disable-next-line react-hooks/purity
  const [randomIndex] = React.useState(() => Math.floor(Math.random() * COMPREHENSION_TEXTS.length));

  const activeText = useMemo(() => {
    if (textId) {
      return COMPREHENSION_TEXTS.find(t => t.id === textId) || null;
    }
    return COMPREHENSION_TEXTS[randomIndex];
  }, [textId, randomIndex]);

  const handleComplete = (result: ExerciseResult) => {
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
