import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { YStack, XStack, Text, Button, Progress } from 'tamagui';
import { useRSVPEngine } from './useRSVPEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Play, Pause, X } from 'lucide-react-native';
import { useMetronome } from '@/hooks/useMetronome';
import { MetronomeControl } from '@/components/exercises/MetronomeControl';
import { ExerciseResult } from '@/types/exercise';
import { haptics } from '@/lib/haptics';
import { ExerciseCompletionActions } from '@/features/exercises/shared/ExerciseCompletionActions';

interface RSVPExerciseScreenProps {
  text: string;
  wpm: number;
  skipDefaultStorage?: boolean;
  onComplete?: (result: ExerciseResult) => void;
}

export function RSVPExerciseScreen({ text, wpm, skipDefaultStorage, onComplete }: RSVPExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  
  const metronome = useMetronome();

  const [countdown, setCountdown] = useState<number | null>(3);
  
  const {
    session,
    currentWord,
    wordIndex,
    progress,
    isCompleted,
    start,
    pause,
    resume,
  } = useRSVPEngine({ text, wpm, skipDefaultStorage, updateIntervalMs: 16 }, (result) => {
    if (onComplete) {
      onComplete(result);
    }
  });

  // Tick exactly when a word appears, instead of running a separate
  // bpm-driven interval alongside the word-advance timer - two independent
  // timers can never stay perfectly in sync (and occasionally double-fire).
  // `lastTickedWordRef` starts at null so the very first word (index 0)
  // still ticks once `running` begins, without re-ticking on pause/resume.
  const lastTickedWordRef = useRef<number | null>(null);
  useEffect(() => {
    if (session.state !== 'running' || !metronome.isEnabled) return;
    if (lastTickedWordRef.current === wordIndex) return;
    lastTickedWordRef.current = wordIndex;
    metronome.playTick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIndex, session.state, metronome.isEnabled]);

  // Stop metronome on unmount
  useEffect(() => {
    return () => metronome.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown logic
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const tId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(tId);
    } else if (countdown === 0) {
      const tId = setTimeout(() => {
        setCountdown(null);
        start(); // Geri sayım bittiğinde motoru başlat
      }, 0);
      return () => clearTimeout(tId);
    }
  }, [countdown, start]);

  useEffect(() => {
    if (isCompleted) haptics.success();
  }, [isCompleted]);

  const handleExit = () => {
    // Alert kullanarak exit confirmation
    // Expo Web'de Alert tam çalışmayabilir, geçici olarak router.back()
    // Normal şartlarda Alert.alert() çağrılır.
    pause();
    // Tamagui AlertDialog eklenebilir ama basitlik için router.back
    router.back();
  };

  const handleTogglePlay = () => {
    if (session.state === 'running') {
      pause();
    } else if (session.state === 'paused') {
      resume();
    }
  };


  // Egzersiz tamamlanmışsa
  if (isCompleted) {
    return (
      <YStack
        f={1}
        bg="$background"
        jc="center"
        ai="center"
        p="$4"
        gap="$4"
        transition="bouncy"
        enterStyle={{ opacity: 0, scale: 0.9, y: 10 }}
        opacity={1}
        scale={1}
        y={0}
      >
        <Text fontSize="$8" fontWeight="bold" color="$color">
          {t('exercises.rsvp.completed', 'Tebrikler!')}
        </Text>
        <Text fontSize="$4" color="$color11">
          WPM: {wpm}
        </Text>
        <ExerciseCompletionActions exerciseType="rsvp" onFinish={() => router.back()} />
      </YStack>
    );
  }

  return (
      <YStack f={1} bg="$background" jc="space-between" ai="center" p="$4" pt="$8" pb="$8">

        {/* Üst Bar: İlerleme ve Çıkış */}
        <XStack w="100%" jc="space-between" ai="center">
          <Button size="$3" circular variant="outlined" onPress={handleExit} icon={X} accessibilityLabel={t('exit', { ns: 'common' })} accessibilityRole="button" />
          <View style={{ flex: 1, marginHorizontal: 20 }}>
            <Progress value={progress * 100}>
              <Progress.Indicator transition="quick" />
            </Progress>
          </View>
          <Text color="$color11" fontSize="$3">{Math.round(progress * 100)}%</Text>
        </XStack>

        {/* Ana İçerik: Kelime veya Geri Sayım */}
        <YStack f={1} jc="center" ai="center">
          {countdown !== null ? (
            <Text fontSize="$12" fontWeight="bold" color="$color">
              {countdown}
            </Text>
          ) : (
            <Text fontSize="$10" fontWeight="800" color="$color" ta="center">
              {currentWord}
            </Text>
          )}
        </YStack>

        <MetronomeControl metronome={metronome} />

        {/* Alt Bar: Kontroller */}
        <XStack w="100%" jc="center" ai="center" gap="$6" mt="$4">
          <Button 
            size="$6" 
            circular 
            theme="accent"
            onPress={handleTogglePlay}
            disabled={countdown !== null}
           icon={session.state === 'running' ? <Pause size={24} color="white" /> : <Play size={24} color="white" />} accessibilityLabel={t(session.state === 'running' ? 'pause' : 'start', { ns: 'common' })} accessibilityRole="button" />
        </XStack>

      </YStack>
  );
}
