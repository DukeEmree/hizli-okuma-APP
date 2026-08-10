import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { YStack, XStack, Text, Button, Progress, ScrollView } from 'tamagui';
import { usePacerEngine } from './usePacerEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

interface PacerExerciseScreenProps {
  text: string;
  wpm: number;
  onComplete?: () => void;
}

export function PacerExerciseScreen({ text, wpm, onComplete }: PacerExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);

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
        <Text fontSize="$4" color="$colorSubtitle">
          WPM: {wpm}
        </Text>
        <Button size="$5" theme="active" onPress={() => onComplete ? onComplete() : router.back()}>
          {t('common.done', 'Bitir')}
        </Button>
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="$background" jc="space-between" ai="center" p="$4" pt="$8" pb="$8">
      <XStack w="100%" jc="space-between" ai="center">
        <Button size="$3" circular variant="outlined" onPress={handleExit}>X</Button>
        <View style={{ flex: 1, marginHorizontal: 20 }}>
          <Progress value={progress * 100}>
            <Progress.Indicator />
          </Progress>
        </View>
        <Text color="$colorSubtitle" fontSize="$3">{Math.round(progress * 100)}%</Text>
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
                    color={isHighlighted ? '$color' : (isPassed ? '$colorSubtitle' : '$colorSubtitle')}
                    backgroundColor={isHighlighted ? '$blue5' : 'transparent'}
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

      <XStack w="100%" jc="center" ai="center" gap="$6">
        <Button 
          size="$6" 
          circular 
          theme="active"
          onPress={handleTogglePlay}
          disabled={countdown !== null}
        >
          {session.state === 'running' ? 'Duraklat' : 'Başlat'}
        </Button>
      </XStack>
    </YStack>
  );
}
