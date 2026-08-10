import React from 'react';
import { PacerExerciseScreen } from "@/features/exercises/pacer/PacerExerciseScreen";
import { useLocalSearchParams, useRouter } from 'expo-router';

const DEFAULT_TEXT = "Pacer (Görsel Yönlendirici), okuma ritminizi belirli bir hızda tutmanıza yardımcı olur. Ekranda ilerleyen vurguyu (highlight) gözlerinizle takip ederek, okuma hızınızın düşmesini engeller ve süreklilik kazanırsınız. Göz kaslarınız bu düzenli harekete alışacak ve okuma ivmeniz artacaktır.";

export default function PacerRoute() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const wpm = params.wpm ? parseInt(params.wpm as string, 10) : 250;
  
  return (
    <PacerExerciseScreen 
      wpm={wpm} 
      text={DEFAULT_TEXT} 
      onComplete={() => {
        router.replace('/(app)/(tabs)/exercises');
      }}
    />
  );
}
