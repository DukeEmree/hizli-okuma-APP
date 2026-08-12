import React from 'react';
import { PacerExerciseScreen } from "@/features/exercises/pacer/PacerExerciseScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COMPREHENSION_TEXTS } from "@/constants/content";
import { DifficultyLevel } from "@/types/exercise";
import { pickByDifficulty } from "@/features/exercises/contentSelection";
import { useDailyPlanStore } from '@/stores/dailyPlanStore';

const DEFAULT_TEXT = "Pacer (Görsel Yönlendirici), okuma ritminizi belirli bir hızda tutmanıza yardımcı olur. Ekranda ilerleyen vurguyu (highlight) gözlerinizle takip ederek, okuma hızınızın düşmesini engeller ve süreklilik kazanırsınız. Göz kaslarınız bu düzenli harekete alışacak ve okuma ivmeniz artacaktır.";

export default function PacerRoute() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const wpm = params.wpm ? parseInt(params.wpm as string, 10) : 250;
  const initialDifficulty = (params.initialDifficulty ? parseInt(params.initialDifficulty as string, 10) : 5) as DifficultyLevel;
  const markStepCompleted = useDailyPlanStore(s => s.markStepCompleted);

  // eslint-disable-next-line react-hooks/purity
  const [pickedText] = React.useState(() => pickByDifficulty(COMPREHENSION_TEXTS, initialDifficulty));

  return (
    <PacerExerciseScreen
      wpm={wpm}
      text={pickedText ? pickedText.content : DEFAULT_TEXT}
      onComplete={() => {
        if (markStepCompleted('pacer')) return;
        router.replace('/(app)/(tabs)/exercises');
      }}
    />
  );
}
