import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { YStack, XStack, H2, H4, Text, Button, Card, Slider, Separator, View, Paragraph, useTheme } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { Play, Settings2, Info, BookOpen, Eye, Brain, Zap, Target, Lock, TrendingUp } from 'lucide-react-native';
import { CartesianChart, Line } from 'victory-native';

import { exerciseRegistry } from '@/features/exercises/registry';
import { useExerciseSettingsStore } from '@/stores/useExerciseSettingsStore';
import { useAdaptiveExerciseStart } from '@/hooks/useAdaptiveExerciseStart';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';

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
  
  const getExerciseConfig = useExerciseSettingsStore(state => state.getExerciseConfig);
  const updateExerciseConfig = useExerciseSettingsStore(state => state.updateExerciseConfig);
  const theme = useTheme();
  const exercise = exerciseRegistry.get(exerciseId as string);
  const { isPremium, isConfigured } = useRevenueCat();
  const activeFlowType = useDailyPlanStore((s) => s.activeFlowType);
  // Free users may only start the exercise they just launched from the
  // daily-plan list - same rule enforced at the engine-route layout
  // (exercises/_layout.tsx), mirrored here so the Lock/paywall CTA shows
  // immediately instead of flashing the engine screen before that redirect.
  const canStartExercise = isPremium || (!!exercise && activeFlowType === exercise.type);
  const isLimitsLoading = !isConfigured;

  // Adaptive difficulty logic
  const { isReady: isAdaptiveReady, config: adaptiveConfig, progressionState } = useAdaptiveExerciseStart(exercise);
  const hasAppliedAdaptive = React.useRef(false);

  // Progress history for the chart - local history only
  const localSessions = useLocalHistoryStore(state => state.sessions);
  const chartData = useMemo(() => {
    if (!exercise) return [];
    const points = localSessions
      .filter(s => s.exerciseId === exercise.id)
      .sort((a, b) => a.completedAt - b.completedAt);
    return points.map((s, i) => ({ x: i, y: s.score }));
  }, [exercise, localSessions]);

  // Local state for UI settings adjustments before saving
  const [config, setConfig] = useState(() => {
    if (!exercise) return {};
    return getExerciseConfig(exercise.id, exercise.defaultConfig);
  });

  // Apply adaptive config once it's ready, overriding any previously saved user overrides
  // This ensures the system's adaptive difficulty dictates the start configuration.
  React.useEffect(() => {
    if (isAdaptiveReady && adaptiveConfig && !hasAppliedAdaptive.current) {
      hasAppliedAdaptive.current = true;
      setConfig((prev) => {
        const merged = {
          ...prev,
          ...adaptiveConfig
        };
        // Also save to settings store so it persists if they leave without starting
        if (exercise) {
          updateExerciseConfig(exercise.id, merged);
        }
        return merged;
      });
    }
  }, [isAdaptiveReady, adaptiveConfig, exercise, updateExerciseConfig]);

  // Combine loading states
  const isLoading = isLimitsLoading || !isAdaptiveReady;

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
    if (isLoading) return;
    
    if (!canStartExercise) {
      router.push('/paywall');
      return;
    }

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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top', 'bottom']}>
      <ScrollView style={{ flex: 1, backgroundColor: theme.background?.val as string }}>
        <YStack padding="$4" gap="$5" paddingBottom="$10">
          
          {/* Header Section */}
          <XStack alignItems="center" gap="$3">
            <View backgroundColor="$green4" padding="$4" borderRadius="$4">
              <IconComponent color={theme.accent10?.val} size={32} />
            </View>
            <YStack flex={1}>
              <H2 numberOfLines={2}>{t(exercise.nameKey, exercise.type)}</H2>
              <Text color="$color11" textTransform="capitalize">{t(`categories.${exercise.category}`, exercise.category)}</Text>
            </YStack>
          </XStack>

          <Paragraph color="$color12" fontSize="$5" lineHeight={24}>
            {t(exercise.descriptionKey, '')}
          </Paragraph>

          <Separator />

          {/* Info Section */}
          <YStack gap="$4">
            <YStack gap="$2">
              <XStack alignItems="center" gap="$2">
                <Info size={20} color={theme.green10?.val as string} />
                <H4>{t('labels.purpose', 'Amacı')}</H4>
              </XStack>
              <Paragraph color="$color11" fontSize="$4" lineHeight={22}>
                {t(exercise.nameKey.replace('.name', '.purpose'), '')}
              </Paragraph>
            </YStack>

            <YStack gap="$2" marginTop="$2">
              <XStack alignItems="center" gap="$2">
                <Target size={20} color={theme.green10?.val as string} />
                <H4>{t('labels.howItWorks', 'Nasıl Çalışır?')}</H4>
              </XStack>
              <Paragraph color="$color11" fontSize="$4" lineHeight={22}>
                {t(exercise.nameKey.replace('.name', '.howItWorks'), '')}
              </Paragraph>
            </YStack>
          </YStack>

          <Separator />

          {/* Progress History Section */}
          <YStack gap="$2">
            <XStack alignItems="center" gap="$2">
              <TrendingUp size={20} color={theme.accent10?.val as string} />
              <H4>{t('labels.progressHistory', 'Geçmiş Performans')}</H4>
            </XStack>
            {chartData.length > 1 ? (
              <View style={{ height: 180, width: '100%' }}>
                <CartesianChart
                  data={chartData}
                  xKey="x"
                  yKeys={["y"]}
                  domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
                >
                  {({ points }) => (
                    <Line points={points.y} color={theme.accent10?.val as string} strokeWidth={3} animate={{ type: "timing", duration: 500 }} />
                  )}
                </CartesianChart>
              </View>
            ) : (
              <Text color="$color11">
                {progressionState
                  ? t('labels.historicalBest', 'En İyi Seviye: {{level}}', { level: progressionState.historicalBest })
                  : t('labels.notEnoughHistory', 'Henüz yeterli geçmiş yok. İlk denemeni tamamla!')}
              </Text>
            )}
          </YStack>

          <Separator />

          {/* Settings Section */}
          <YStack gap="$4">
            <XStack alignItems="center" gap="$2">
              <Settings2 size={20} color={theme.orange10?.val as string} />
              <H4>{t('labels.settings', 'Ayarlar')}</H4>
            </XStack>

            <Card padding="$4" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundHover" elevation={1}>
              <YStack gap="$4">
                
                {/* WPM Setting */}
                {config.wpm !== undefined && (
                  <YStack gap="$2">
                    <XStack justifyContent="space-between">
                      <Text fontWeight="bold">{t('settings.wpm', 'Hız (WPM)')}</Text>
                      <Text color="$green10" fontWeight="bold">{config.wpm}</Text>
                    </XStack>
                    <Slider
                      value={[config.wpm]}
                      max={1000}
                      min={100}
                      step={50}
                      onValueChange={(val) => handleSettingChange('wpm', val[0])}
                    >
                      <Slider.Track backgroundColor="$color5">
                        <Slider.TrackActive backgroundColor="$green10" />
                      </Slider.Track>
                      <Slider.Thumb index={0} size="$1.5" circular elevate backgroundColor="$green10" />
                    </Slider>
                  </YStack>
                )}

                {/* Chunk Size Setting */}
                {config.chunkSize !== undefined && (
                  <YStack gap="$2">
                    <XStack justifyContent="space-between">
                      <Text fontWeight="bold">{t('settings.chunkSize', 'Grup Büyüklüğü (Kelime)')}</Text>
                      <Text color="$green10" fontWeight="bold">{config.chunkSize}</Text>
                    </XStack>
                    <Slider
                      value={[config.chunkSize]}
                      max={5}
                      min={1}
                      step={1}
                      onValueChange={(val) => handleSettingChange('chunkSize', val[0])}
                    >
                      <Slider.Track backgroundColor="$color5">
                        <Slider.TrackActive backgroundColor="$green10" />
                      </Slider.Track>
                      <Slider.Thumb index={0} size="$1.5" circular elevate backgroundColor="$green10" />
                    </Slider>
                  </YStack>
                )}

                {/* Grid Size Setting (Schulte vb.) */}
                {config.gridSize !== undefined && (
                  <YStack gap="$2">
                    <XStack justifyContent="space-between">
                      <Text fontWeight="bold">{t('settings.gridSize', 'Tablo Boyutu')}</Text>
                      <Text color="$green10" fontWeight="bold">{config.gridSize}x{config.gridSize}</Text>
                    </XStack>
                    <Slider
                      value={[config.gridSize]}
                      max={7}
                      min={3}
                      step={1}
                      onValueChange={(val) => handleSettingChange('gridSize', val[0])}
                    >
                      <Slider.Track backgroundColor="$color5">
                        <Slider.TrackActive backgroundColor="$green10" />
                      </Slider.Track>
                      <Slider.Thumb index={0} size="$1.5" circular elevate backgroundColor="$green10" />
                    </Slider>
                  </YStack>
                )}

                {/* Time Limit Setting (Saniye cinsine çevrilerek gösterilebilir) */}
                {config.timeLimitMs !== undefined && (
                  <YStack gap="$2">
                    <XStack justifyContent="space-between">
                      <Text fontWeight="bold">{t('settings.timeLimitMs', 'Süre Limiti')}</Text>
                      <Text color="$green10" fontWeight="bold">{config.timeLimitMs / 1000} sn</Text>
                    </XStack>
                    <Slider
                      value={[config.timeLimitMs / 1000]}
                      max={300}
                      min={30}
                      step={30}
                      onValueChange={(val) => handleSettingChange('timeLimitMs', val[0] * 1000)}
                    >
                      <Slider.Track backgroundColor="$color5">
                        <Slider.TrackActive backgroundColor="$green10" />
                      </Slider.Track>
                      <Slider.Thumb index={0} size="$1.5" circular elevate backgroundColor="$green10" />
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
          theme="accent"
          backgroundColor={!canStartExercise ? "$orange9" : undefined}
          icon={isLoading ? undefined : (!canStartExercise ? Lock : Play)} 
          onPress={handleStart}
          borderRadius="$8"
          elevation={2}
          opacity={isLoading ? 0.7 : 1}
          disabled={isLoading}
        >
          {isLoading 
            ? "Yükleniyor..." 
            : (!canStartExercise 
              ? t('buttons.limitReached', "Limit Doldu - Premium'a Geç") 
              : t('buttons.start', 'Başla'))}
        </Button>
      </YStack>

    </SafeAreaView>
  );
}
