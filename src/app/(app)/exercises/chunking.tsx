import React, { useMemo } from 'react';
import { ChunkingExerciseScreen } from "@/features/exercises/chunking/ChunkingExerciseScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COMPREHENSION_TEXTS } from "@/constants/content";
import { useComprehensionStore } from "@/stores/useComprehensionStore";
import { ExerciseResult } from "@/types/exercise";

const DEFAULT_TEXT = "Kelime gruplama tekniği okuma hızınızı önemli ölçüde artırır. Gözleriniz her kelime için ayrı ayrı duraklamak yerine, birkaç kelimeyi tek bir bakışta kavrar. Bu sayede hem zaman kazanırsınız hem de cümlenin bütününü daha rahat anlarsınız. Düzenli pratik yaparak göz kaslarınızı eğitebilir ve çok daha hızlı bir okuyucu olabilirsiniz.";

export default function ChunkingRoute() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const wpm = params.wpm ? parseInt(params.wpm as string, 10) : 250;
  const chunkSize = params.chunkSize ? parseInt(params.chunkSize as string, 10) : 2;
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
    <ChunkingExerciseScreen 
      wpm={wpm} 
      chunkSize={chunkSize}
      text={activeText ? activeText.content : DEFAULT_TEXT} 
      skipDefaultStorage={!!activeText}
      onComplete={handleComplete}
    />
  );
}
