import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { YStack, XStack, H2, H4, Text, Button, Card, Slider, Separator, View, Paragraph } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { Play, Settings2, Info, BookOpen, Eye, Brain, Zap, Target } from 'lucide-react-native';

import { exerciseRegistry } from '@/features/exercises/registry';
import { useExerciseSettingsStore } from '@/stores/useExerciseSettingsStore';

const CATEGORY_ICONS: Record<string, any> = {
  reading: BookOpen,
  focus: Eye,
  comprehension: Brain,
  vision: Target,
  memory: Zap,
};

export default function ExerciseInfoScreen() {
  const { exerciseId } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation('exercises');
  
  const { getExerciseConfig, updateExerciseConfig } = useExerciseSettingsStore();
  const exercise = exerciseRegistry.get(exerciseId as string);

  // Local state for UI settings adjustments before saving
  const [config, setConfig] = useState(() => {
    if (!exercise) return {};
    return getExerciseConfig(exercise.id, exercise.defaultConfig);
  });

  // Eğer bulunamazsa veya henüz yüklenmediyse
  if (!exercise) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
          <Text>{t('detailPlaceholder', { id: exerciseId })}</Text>
          <Button marginTop="$4" onPress={() => router.back()}>Geri</Button>
        </YStack>
      </SafeAreaView>
    );
  }

  const IconComponent = CATEGORY_ICONS[exercise.category] || BookOpen;

  // Settings kaydet
  const handleSettingChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    updateExerciseConfig(exercise.id, newConfig);
  };

  const handleStart = () => {
    // Generate URL query parameters from config
    const queryParams = new URLSearchParams();
    Object.entries(config).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });
    router.push({
      pathname: `/(app)/exercises/${exercise.type}`,
      params: Object.fromEntries(queryParams.entries()),
    } as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <ScrollView style={{ flex: 1, backgroundColor: '$background' }}>
        <YStack padding="$4" gap="$5" paddingBottom="$10">
          
          {/* Header Section */}
          <XStack alignItems="center" gap="$3">
            <View backgroundColor="$blue4" padding="$3" borderRadius="$4">
              <IconComponent color="#208AEF" size={32} />
            </View>
            <YStack flex={1}>
              <H2 numberOfLines={2}>{t(exercise.nameKey, exercise.type)}</H2>
              <Text color="$color11" textTransform="capitalize">{t(`categories.${exercise.category}`, exercise.category)}</Text>
            </YStack>
          </XStack>

          <Paragraph color="$color12" fontSize={16} lineHeight={24}>
            {t(exercise.descriptionKey, '')}
          </Paragraph>

          <Separator />

          {/* Info Section */}
          <YStack gap="$4">
            <YStack gap="$2">
              <XStack alignItems="center" gap="$2">
                <Info size={20} color="$blue10" />
                <H4>{t('labels.purpose', 'Amacı')}</H4>
              </XStack>
              <Paragraph color="$color11" fontSize={15} lineHeight={22}>
                {t(`${exercise.type}.purpose`, '')}
              </Paragraph>
            </YStack>

            <YStack gap="$2" marginTop="$2">
              <XStack alignItems="center" gap="$2">
                <Target size={20} color="$green10" />
                <H4>{t('labels.howItWorks', 'Nasıl Çalışır?')}</H4>
              </XStack>
              <Paragraph color="$color11" fontSize={15} lineHeight={22}>
                {t(`${exercise.type}.howItWorks`, '')}
              </Paragraph>
            </YStack>
          </YStack>

          <Separator />

          {/* Settings Section */}
          <YStack gap="$4">
            <XStack alignItems="center" gap="$2">
              <Settings2 size={20} color="$orange10" />
              <H4>{t('labels.settings', 'Ayarlar')}</H4>
            </XStack>

            <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover" elevation={1}>
              <YStack gap="$4">
                
                {/* WPM Setting */}
                {config.wpm !== undefined && (
                  <YStack gap="$2">
                    <XStack justifyContent="space-between">
                      <Text fontWeight="bold">{t('settings.wpm', 'Hız (WPM)')}</Text>
                      <Text color="$blue10" fontWeight="bold">{config.wpm}</Text>
                    </XStack>
                    <Slider
                      defaultValue={[config.wpm]}
                      max={1000}
                      min={100}
                      step={50}
                      onValueChange={(val) => handleSettingChange('wpm', val[0])}
                    >
                      <Slider.Track backgroundColor="$color5">
                        <Slider.TrackActive backgroundColor="$blue10" />
                      </Slider.Track>
                      <Slider.Thumb index={0} size="$1.5" circular elevate backgroundColor="$blue10" />
                    </Slider>
                  </YStack>
                )}

                {/* Chunk Size Setting */}
                {config.chunkSize !== undefined && (
                  <YStack gap="$2">
                    <XStack justifyContent="space-between">
                      <Text fontWeight="bold">{t('settings.chunkSize', 'Grup Büyüklüğü (Kelime)')}</Text>
                      <Text color="$blue10" fontWeight="bold">{config.chunkSize}</Text>
                    </XStack>
                    <Slider
                      defaultValue={[config.chunkSize]}
                      max={5}
                      min={1}
                      step={1}
                      onValueChange={(val) => handleSettingChange('chunkSize', val[0])}
                    >
                      <Slider.Track backgroundColor="$color5">
                        <Slider.TrackActive backgroundColor="$blue10" />
                      </Slider.Track>
                      <Slider.Thumb index={0} size="$1.5" circular elevate backgroundColor="$blue10" />
                    </Slider>
                  </YStack>
                )}

                {/* Grid Size Setting (Schulte vb.) */}
                {config.gridSize !== undefined && (
                  <YStack gap="$2">
                    <XStack justifyContent="space-between">
                      <Text fontWeight="bold">{t('settings.gridSize', 'Tablo Boyutu')}</Text>
                      <Text color="$blue10" fontWeight="bold">{config.gridSize}x{config.gridSize}</Text>
                    </XStack>
                    <Slider
                      defaultValue={[config.gridSize]}
                      max={7}
                      min={3}
                      step={1}
                      onValueChange={(val) => handleSettingChange('gridSize', val[0])}
                    >
                      <Slider.Track backgroundColor="$color5">
                        <Slider.TrackActive backgroundColor="$blue10" />
                      </Slider.Track>
                      <Slider.Thumb index={0} size="$1.5" circular elevate backgroundColor="$blue10" />
                    </Slider>
                  </YStack>
                )}

                {/* Time Limit Setting (Saniye cinsine çevrilerek gösterilebilir) */}
                {config.timeLimitMs !== undefined && (
                  <YStack gap="$2">
                    <XStack justifyContent="space-between">
                      <Text fontWeight="bold">{t('settings.timeLimitMs', 'Süre Limiti')}</Text>
                      <Text color="$blue10" fontWeight="bold">{config.timeLimitMs / 1000} sn</Text>
                    </XStack>
                    <Slider
                      defaultValue={[config.timeLimitMs / 1000]}
                      max={300}
                      min={30}
                      step={30}
                      onValueChange={(val) => handleSettingChange('timeLimitMs', val[0] * 1000)}
                    >
                      <Slider.Track backgroundColor="$color5">
                        <Slider.TrackActive backgroundColor="$blue10" />
                      </Slider.Track>
                      <Slider.Thumb index={0} size="$1.5" circular elevate backgroundColor="$blue10" />
                    </Slider>
                  </YStack>
                )}
                
                {/* Eğer hiçbir ayar yoksa */}
                {Object.keys(config).filter(k => ['wpm', 'chunkSize', 'gridSize', 'timeLimitMs'].includes(k)).length === 0 && (
                  <Text color="$color11" textAlign="center">
                    Bu egzersiz için değiştirilebilir bir ayar bulunmuyor.
                  </Text>
                )}

              </YStack>
            </Card>
          </YStack>

        </YStack>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <YStack padding="$4" paddingBottom="$6" backgroundColor="$background" borderTopWidth={1} borderColor="$borderColor">
        <Button 
          size="$5" 
          theme="active" 
          icon={Play} 
          onPress={handleStart}
          borderRadius="$8"
          elevation={2}
        >
          {t('buttons.start', 'Başla')}
        </Button>
      </YStack>

    </SafeAreaView>
  );
}
