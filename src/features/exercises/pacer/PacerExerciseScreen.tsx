import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { YStack, XStack, Text, Button, Progress, ScrollView } from 'tamagui';
import { usePacerEngine } from './usePacerEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Play, Pause, X } from 'lucide-react-native';
import { useMetronome } from '@/hooks/useMetronome';
import { MetronomeControl } from '@/components/exercises/MetronomeControl';
import { haptics } from '@/lib/haptics';
import { ExerciseCompletionActions } from '@/features/exercises/shared/ExerciseCompletionActions';

interface PacerExerciseScreenProps {
  text: string;
  wpm: number;
  onComplete?: () => void;
}

export function PacerExerciseScreen({ text, wpm, onComplete }: PacerExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);
  
  const metronome = useMetronome();

  const {
    session,
    words,
    highlightIndex,
    progress,
    isCompleted,
    start,
    pause,
    resume
  } = usePacerEngine({ text, wpm, updateIntervalMs: 16 }, () => {});

  // Tick exactly when the highlight advances to a new word, instead of
  // running a separate bpm-driven interval alongside the word-advance
  // timer - two independent timers can never stay perfectly in sync (and
  // occasionally double-fire). `lastTickedWordRef` starts at null so the
  // very first word (index 0) still ticks once `running` begins, without
  // re-ticking on pause/resume.
  const lastTickedWordRef = useRef<number | null>(null);
  useEffect(() => {
    if (session.state !== 'running' || !metronome.isEnabled) return;
    if (lastTickedWordRef.current === highlightIndex) return;
    lastTickedWordRef.current = highlightIndex;
    metronome.playTick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightIndex, session.state, metronome.isEnabled]);

  // Stop metronome on unmount
  useEffect(() => {
    return () => metronome.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const tId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(tId);
    } else if (countdown === 0) {
      const tId = setTimeout(() => {
        setCountdown(null);
        start();
      }, 0);
      return () => clearTimeout(tId);
    }
  }, [countdown, start]);

  useEffect(() => {
    if (isCompleted) haptics.success();
  }, [isCompleted]);

  const handleExit = () => {
    pause();
    router.back();
  };

  const handleTogglePlay = () => {
    if (session.state === 'running') {
      pause();
    } else if (session.state === 'paused') {
      resume();
    }
  };

  if (isCompleted) {
    return (
      <YStack f={1} bg="$background" jc="center" ai="center" p="$4" gap="$4">
        <Text fontSize="$8" fontWeight="bold" color="$color">
          {t('exercises.pacer.completed', 'Tebrikler, hızınızı korudunuz!')}
        </Text>
        <Text fontSize="$4" color="$color11">
          WPM: {wpm}
        </Text>
        <ExerciseCompletionActions exerciseType="pacer" onFinish={() => onComplete ? onComplete() : router.back()} />
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="$background" jc="space-between" ai="center" p="$4" pt="$8" pb="$8">
      <XStack w="100%" jc="space-between" ai="center">
        <Button size="$3" circular variant="outlined" onPress={handleExit} icon={X} accessibilityLabel={t('exit', { ns: 'common' })} accessibilityRole="button" />
        <View style={{ flex: 1, marginHorizontal: 20 }}>
          <Progress value={progress * 100}>
            <Progress.Indicator transition="quick" />
          </Progress>
        </View>
        <Text color="$color11" fontSize="$3">{Math.round(progress * 100)}%</Text>
      </XStack>

      <YStack f={1} w="100%" jc="center" ai="center">
        {countdown !== null ? (
          <Text fontSize="$12" fontWeight="bold" color="$color">
            {countdown}
          </Text>
        ) : (
          <ScrollView w="100%" px="$4">
            <XStack flexWrap="wrap" jc="center" ai="center" rowGap="$2" columnGap="$2">
              {words.map((word, idx) => {
                const isHighlighted = idx === highlightIndex;
                const isPassed = idx < highlightIndex;
                
                return (
                  <Text
                    key={idx}
                    fontSize="$7"
                    fontWeight="600"
                    color={isHighlighted ? '$color' : (isPassed ? '$color11' : '$color11')}
                    backgroundColor={isHighlighted ? '$green5' : 'transparent'}
                    borderRadius="$2"
                    paddingHorizontal="$1"
                  >
                    {word}
                  </Text>
                );
              })}
            </XStack>
          </ScrollView>
        )}
      </YStack>

      <MetronomeControl metronome={metronome} />

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
