import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { YStack, XStack, Text, Button, Progress } from 'tamagui';
import { useChunkingEngine } from './useChunkingEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

interface ChunkingExerciseScreenProps {
  text: string;
  wpm: number;
  chunkSize: number;
  skipDefaultStorage?: boolean;
  onComplete?: (result: any) => void;
}

export function ChunkingExerciseScreen({ text, wpm, chunkSize, skipDefaultStorage, onComplete }: ChunkingExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(3);

  const {
    session,
    currentChunk,
    progress,
    isCompleted,
    start,
    pause,
    resume,
    reset
  } = useChunkingEngine({ text, wpm, chunkSize, skipDefaultStorage, updateIntervalMs: 16 }, (result) => {
    if (onComplete) {
      onComplete(result);
    }
  });

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
          {t('exercises.chunking.completed', 'Tebrikler, grup okumayı tamamladınız!')}
        </Text>
        <Text fontSize="$4" color="$colorSubtitle">
          WPM: {wpm} | Chunk: {chunkSize}
        </Text>
        <Button size="$5" theme="active" onPress={() => router.back()}>
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

      <YStack f={1} jc="center" ai="center">
        {countdown !== null ? (
          <Text fontSize="$12" fontWeight="bold" color="$color">
            {countdown}
          </Text>
        ) : (
          <Text fontSize="$9" fontWeight="700" color="$color" ta="center">
            {currentChunk}
          </Text>
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
