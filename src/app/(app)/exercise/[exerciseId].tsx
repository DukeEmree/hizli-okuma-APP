import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { YStack, XStack, H2, H4, Text, Button, Slider, Separator, View, Paragraph, useTheme } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { Play, Settings2, Info, BookOpen, Eye, Brain, Zap, Target, Lock, TrendingUp, ChevronLeft, type LucideIcon } from 'lucide-react-native';

import { SafeLineChart } from '@/components/ui/charts/SafeCharts';

import { exerciseRegistry } from '@/features/exercises/registry';
import { useExerciseSettingsStore } from '@/stores/useExerciseSettingsStore';
import { useAdaptiveExerciseStart } from '@/hooks/useAdaptiveExerciseStart';
import { useLocalHistoryStore } from '@/stores/localHistoryStore';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { useDailyPlanStore } from '@/stores/dailyPlanStore';
import { AppCard } from '@/components/ui/AppCard';
import { contentColumn } from '@/constants/layout';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
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
  const { t: tCommon } = useTranslation('common');
  
  const getExerciseConfig = useExerciseSettingsStore(state => state.getExerciseConfig);
  const updateExerciseConfig = useExerciseSettingsStore(state => state.updateExerciseConfig);
  const theme = useTheme();
  const exercise = exerciseRegistry.get(exerciseId as string);
  const { isPremium, isConfigured, isEntitlementKnown } = useRevenueCat();
  const activeFlowType = useDailyPlanStore((s) => s.activeFlowType);
  // Free users may only start the exercise they just launched from the
  // daily-plan list - same rule enforced at the engine-route layout
  // (exercises/_layout.tsx), mirrored here so the Lock/paywall CTA shows
  // immediately instead of flashing the engine screen before that redirect.
  // Kept identical to that layout's condition, `isEntitlementKnown` included,
  // so the two can't disagree and show a "Başla" button that the layout then
  // immediately redirects away from (or vice versa).
  const canStartExercise =
    isPremium || !isEntitlementKnown || (!!exercise && activeFlowType === exercise.type);
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
        {/* Was "Egzersiz Placeholder: {id}" - scaffolding copy plus an internal
            id, shown to a user who has simply followed a stale link. */}
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" gap="$2">
          <H4>{t('notFound.title')}</H4>
          <Text color="$color11" textAlign="center">{t('notFound.body')}</Text>
          <Button size="$4.5" marginTop="$4" onPress={() => router.back()}>{tCommon('back')}</Button>
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
        <YStack padding="$4" gap="$5" paddingBottom="$10" {...contentColumn}>
          
          <Button
            size="$4.5"
            circular
            chromeless
            alignSelf="flex-start"
            icon={<ChevronLeft size={24} color={theme.color11?.val as string} />}
            onPress={() => router.back()}
            accessibilityLabel={tCommon('back')}
            accessibilityRole="button"
          />

          {/* Header Section */}

          <XStack alignItems="center" gap="$3">
            <View backgroundColor="$green4" padding="$4" borderRadius="$4">
              <IconComponent color={theme.green11?.val as string} size={32} />
            </View>
            <YStack flex={1}>
              <H2 numberOfLines={2}>{t(exercise.nameKey, exercise.type)}</H2>
              <Text color="$color11">{t(`categories.${exercise.category}`, exercise.category)}</Text>
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
                <H4>{t('labels.purpose')}</H4>
              </XStack>
              <Paragraph color="$color11" fontSize="$4" lineHeight={22}>
                {t(exercise.nameKey.replace('.name', '.purpose'), '')}
              </Paragraph>
            </YStack>

            <YStack gap="$2" marginTop="$2">
              <XStack alignItems="center" gap="$2">
                <Target size={20} color={theme.green10?.val as string} />
                <H4>{t('labels.howItWorks')}</H4>
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
              <TrendingUp size={20} color={theme.green11?.val as string} />
              <H4>{t('labels.progressHistory')}</H4>
            </XStack>
            {chartData.length > 1 ? (
              <SafeLineChart
                data={chartData}
                color={theme.green9?.val as string}
                height={180}
              />
            ) : (
              <Text color="$color11">
                {progressionState
                  ? t('labels.historicalBest', { level: progressionState.historicalBest })
                  : t('labels.notEnoughHistory')}
              </Text>
            )}
          </YStack>

          <Separator />

          {/* Settings Section */}
          <YStack gap="$4">
            <XStack alignItems="center" gap="$2">
              <Settings2 size={20} color={theme.color11?.val as string} />
              <H4>{t('labels.settings')}</H4>
            </XStack>

            <AppCard>
              <YStack gap="$4">
                
                {config.wpm !== undefined && (
                  <ConfigSlider
                    label={t('settings.wpm')}
                    readout={String(config.wpm)}
                    value={config.wpm}
                    min={100}
                    max={700}
                    step={50}
                    onChange={(v) => handleSettingChange('wpm', v)}
                  />
                )}

                {config.chunkSize !== undefined && (
                  <ConfigSlider
                    label={t('settings.chunkSize')}
                    readout={String(config.chunkSize)}
                    value={config.chunkSize}
                    min={1}
                    max={5}
                    step={1}
                    onChange={(v) => handleSettingChange('chunkSize', v)}
                  />
                )}

                {config.gridSize !== undefined && (
                  <ConfigSlider
                    label={t('settings.gridSize')}
                    readout={`${config.gridSize}x${config.gridSize}`}
                    value={config.gridSize}
                    min={3}
                    max={7}
                    step={1}
                    onChange={(v) => handleSettingChange('gridSize', v)}
                  />
                )}

                {config.timeLimitMs !== undefined && (
                  <ConfigSlider
                    label={t('settings.timeLimitMs')}
                    readout={t('labels.estimatedTime', { time: config.timeLimitMs / 1000 })}
                    value={config.timeLimitMs / 1000}
                    min={30}
                    max={300}
                    step={30}
                    onChange={(v) => handleSettingChange('timeLimitMs', v * 1000)}
                  />
                )}
                
                {/* Eğer hiçbir ayar yoksa */}
                {Object.keys(config).filter(k => ['wpm', 'chunkSize', 'gridSize', 'timeLimitMs'].includes(k)).length === 0 && (
                  <Text color="$color11" textAlign="center">
                    {t('labels.noSettings')}
                  </Text>
                )}

              </YStack>
            </AppCard>
          </YStack>

        </YStack>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <YStack
        padding="$4"
        paddingBottom="$6"
        backgroundColor="$background"
        borderTopWidth={1}
        borderColor="$borderColor"
      >
        {/* The bar spans the window so its top border reads as a full-width
            edge, but the action inside it stays on the content column. */}
        <YStack {...contentColumn}>
          {/* The locked state stays on the accent ramp: ember marks what the
              user has earned, never an upsell, and PRO is mineral. The Lock
              glyph and the label already carry "you cannot start this yet".
              $4 radius and $5 height are the system's button, not a one-off
              pill; depth is the sticky bar's own border, and the press is a
              scale, per the design's Press Rule. */}
          <Button
            size="$5"
            theme="accent"
            icon={isLoading ? undefined : (!canStartExercise ? Lock : Play)}
            onPress={handleStart}
            borderRadius="$4"
            pressStyle={{ scale: 0.98 }}
            opacity={isLoading ? 0.7 : 1}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading, busy: isLoading }}
          >
            {isLoading
              ? t('buttons.loading')
              : (!canStartExercise
                ? t('buttons.unlockPremium')
                : t('buttons.start'))}
          </Button>
        </YStack>
      </YStack>

    </SafeAreaView>
  );
}

interface ConfigSliderProps {
  label: string;
  /** Rendered value, already formatted with its unit. */
  readout: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

/**
 * One row of the exercise configuration card. All four settings render through
 * this so the touch target and the screen-reader semantics are decided once.
 *
 * `value` is passed, never `defaultValue`: adaptive difficulty writes a new
 * value in an effect after mount, and an uncontrolled slider would keep showing
 * the previous run's position while the number beside it shows the new one.
 */
function ConfigSlider({ label, readout, value, min, max, step, onChange }: ConfigSliderProps) {
  return (
    <YStack gap="$2">
      <XStack justifyContent="space-between" alignItems="baseline">
        <Text fontWeight="bold">{label}</Text>
        <Text color="$green10" fontWeight="bold">{readout}</Text>
      </XStack>
      {/* Tamagui puts the pan responder on the Slider frame, not on the thumb,
          so vertical padding - not the thumb's size - is what lifts this to the
          48dp Material floor. A 24px handle on a bare track gave a ~24dp band
          on the screen every exercise is configured from. */}
      <Slider
        value={[value]}
        max={max}
        min={min}
        step={step}
        onValueChange={(val) => onChange(val[0])}
        paddingVertical="$3"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: value, text: readout }}
      >
        {/* `$color5` left the unfilled half of the track at ~1.5:1 against the
            card, so the range being dragged within was invisible; `$color7`
            reads without competing with the fill. Active track and handle are
            `$green9`, the ramp's solid step and the same green as every other
            control - `$green10` is its hover step. */}
        <Slider.Track backgroundColor="$color7">
          <Slider.TrackActive backgroundColor="$green9" />
        </Slider.Track>
        <Slider.Thumb index={0} size="$1.5" circular elevate backgroundColor="$green9" />
      </Slider>
    </YStack>
  );
}
