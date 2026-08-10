import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { YStack, XStack, Text, Button, Progress, Theme } from 'tamagui';
import { useRSVPEngine } from './useRSVPEngine';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

interface RSVPExerciseScreenProps {
  text: string;
  wpm: number;
  skipDefaultStorage?: boolean;
  onComplete?: (result: any) => void;
}

export function RSVPExerciseScreen({ text, wpm, skipDefaultStorage, onComplete }: RSVPExerciseScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [countdown, setCountdown] = useState<number | null>(3);
  
  const {
    session,
    currentWord,
    progress,
    isCompleted,
    start,
    pause,
    resume,
    reset
  } = useRSVPEngine({ text, wpm, skipDefaultStorage, updateIntervalMs: 16 }, (result) => {
    if (onComplete) {
      onComplete(result);
    }
  });

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
      <YStack f={1} bg="$background" jc="center" ai="center" p="$4" gap="$4">
        <Text fontSize="$8" fontWeight="bold" color="$color">
          {t('exercises.rsvp.completed', 'Tebrikler!')}
        </Text>
        <Text fontSize="$4" color="$colorSubtitle">
          WPM: {wpm}
        </Text>
        <Button size="$5" theme="active" onPress={() => router.back()}>
          {t('common.done', 'Bitir')}
        </Button>
      </YStack>
    );
  }

  return (
    <Theme name="dark"> 
      {/* RSVP ekranı dikkati toplamak için karanlık modda zorlanabilir veya sistem teması bırakılır.
          Sistem temasına bırakmak için Theme'i kaldırıyorum. */}
      <YStack f={1} bg="$background" jc="space-between" ai="center" p="$4" pt="$8" pb="$8">
        
        {/* Üst Bar: İlerleme ve Çıkış */}
        <XStack w="100%" jc="space-between" ai="center">
          <Button size="$3" circular variant="outlined" onPress={handleExit}>X</Button>
          <View style={{ flex: 1, marginHorizontal: 20 }}>
            <Progress value={progress * 100}>
              <Progress.Indicator />
            </Progress>
          </View>
          <Text color="$colorSubtitle" fontSize="$3">{Math.round(progress * 100)}%</Text>
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

        {/* Alt Bar: Kontroller */}
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
    </Theme>
  );
}
