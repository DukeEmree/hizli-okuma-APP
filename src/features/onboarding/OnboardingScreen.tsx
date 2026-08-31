import { analytics } from "@/lib/analytics";
import { captureException } from "@/lib/sentry";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUserProgressStore } from "@/stores/userProgressStore";
import { useExerciseProgressStore } from "@/stores/exerciseProgressStore";
import { startingLevelFromWpm } from "@/utils/onboarding";
import { RSVP_ID } from "@/features/exercises/rsvp";
import { CHUNKING_ID } from "@/features/exercises/chunking";
import { Button, H2, H4, Text, XStack, YStack } from "tamagui";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Track } from "@/components/ui/track/Track";
import { AppCard } from '@/components/ui/AppCard';

function OptionRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <XStack
      minHeight={56}
      paddingHorizontal="$4"
      borderRadius="$5"
      backgroundColor="$backgroundHover"
      borderWidth={1}
      borderColor="$borderColor"
      alignItems="center"
      justifyContent="space-between"
      pressStyle={{ borderColor: "$green9" }}
      onPress={onPress}
    >
      <Text fontSize="$5" fontWeight="500">{label}</Text>
      <YStack width={18} height={18} borderRadius={999} borderWidth={1.5} borderColor="$borderColor" />
    </XStack>
  );
}

/** i18n keys under `onboarding:reasonStep.options`. */
const REASON_KEYS = ["study", "books", "work", "general"] as const;

const GOALS = [5, 10, 15, 20, 30];

const ASSESSMENT_TEXT =
  "Hızlı okuma, sadece kelimeleri daha çabuk görmek değil, aynı zamanda onları daha iyi anlamaktır. Birçok insan hızlı okuduğunda anlama oranının düşeceğinden korkar. Oysa beynimiz, kelimeleri gruplar halinde algılayıp işlediğinde daha yüksek bir odaklanma seviyesine ulaşır. Göz hareketlerini optimize etmek ve iç sesi azaltmak, bu becerinin temel adımlarıdır. Düzenli pratikle hem okuma hızınızı hem de kavrama yeteneğinizi artırabilirsiniz.";

const ASSESSMENT_QUESTION = {
  question:
    "Parçaya göre beynimiz kelimeleri nasıl algıladığında daha yüksek odaklanma seviyesine ulaşır?",
  options: [
    "Tek tek harf harf",
    "Gruplar halinde",
    "Sadece sesli okuyarak",
    "İç sesimizi yükselttiğimizde",
  ],
  correctIndex: 1,
};

export function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation('onboarding');
  const setHasCompletedOnboarding = useSettingsStore(s => s.setHasCompletedOnboarding);
  const setDailyGoalMinutes = useSettingsStore(s => s.setDailyGoalMinutes);
  const updateBestWpm = useUserProgressStore(s => s.updateBestWpm);
  const updateBestComprehension = useUserProgressStore(s => s.updateBestComprehension);
  const updateExerciseMetrics = useExerciseProgressStore(s => s.updateExerciseMetrics);

  // Step 3 is a self-paced timed reading test whose measured WPM seeds the
  // starting difficulty of RSVP and Chunking. A display timeout firing mid-read
  // would inflate the duration and permanently mis-seed those levels, so the
  // screen is held awake for the (short) duration of the whole flow.
  useKeepAwake();

  const [step, setStep] = useState(1);
  const insets = useSafeAreaInsets();
  const [goal, setGoal] = useState<number | null>(null);

  // Assessment State
  const assessmentStartMsRef = useRef<number | null>(null);
  const [readDurationMs, setReadDurationMs] = useState<number | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    analytics.track("onboarding_started");
  }, []);

  const handleReasonSelect = () => {
    setStep(2);
  };

  const handleGoalSelect = (g: number) => {
    setGoal(g);
    setStep(3);
    // eslint-disable-next-line react-hooks/purity
    assessmentStartMsRef.current = Date.now();
  };

  const handleFinishReading = () => {
    // eslint-disable-next-line react-hooks/purity
    const startTime = assessmentStartMsRef.current ?? Date.now();
    // eslint-disable-next-line react-hooks/purity
    setReadDurationMs(Date.now() - startTime);
    setShowQuestion(true);
  };

  const handleAnswer = async (index: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const isCorrect = index === ASSESSMENT_QUESTION.correctIndex;
    const comprehension = isCorrect ? 100 : 50; // Give 50 if wrong so they don't get stuck at level 1 forever initially

    // Calculate WPM
    const wordCount = ASSESSMENT_TEXT.trim().split(/\s+/).length;
    const durationSeconds = (readDurationMs || 10000) / 1000;
    const initialWpm = Math.round((wordCount / durationSeconds) * 60);

    try {
      setDailyGoalMinutes(goal || 10);
      updateBestWpm(initialWpm);
      updateBestComprehension(comprehension / 100);

      // Seed the reading exercises at the level matching the measured speed.
      // Otherwise the whole assessment is decorative: every user starts at
      // level 1 (150 WPM) and a fast reader has to grind several deliberately
      // slow sessions before the adaptive loop reaches where they already
      // were. Pacer is not seeded directly - it reads RSVP's progression via
      // CROSS_EXERCISE_METRICS_SOURCE, so seeding RSVP covers it.
      const startingLevel = startingLevelFromWpm(initialWpm);
      for (const exerciseId of [RSVP_ID, CHUNKING_ID]) {
        updateExerciseMetrics(exerciseId, {
          currentDifficulty: startingLevel,
          historicalBestLevel: startingLevel,
        });
      }

      setHasCompletedOnboarding(true);
      analytics.track("onboarding_completed");
      router.replace("/(app)/(tabs)");
    } catch (e) {
      captureException(e, { context: 'OnboardingScreen.handleFinish' });
      setIsSubmitting(false);
    }
  };

  const stepTrackData = [1, 2, 3].map((s) => ({ value: 1, comprehension: s <= step ? 1 : 0 }));

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" paddingTop={insets.top + 16} paddingBottom={insets.bottom + 16}>
      {/* The Track here is a decorative step meter, not data - it hides itself
          from the accessibility tree, so the step count is spoken by the
          wrapper instead of leaving the flow's only progress cue silent. */}
      <YStack
        marginBottom="$6"
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={t('a11y.progress', { step, total: 3 })}
        accessibilityValue={{ min: 1, max: 3, now: step }}
      >
        <Track data={stepTrackData} size="compact" height={5} showBaseline={false} />
      </YStack>

      {step === 1 && (
        <YStack flex={1} gap="$4">
          <H2>{t('reasonStep.title')}</H2>
          <Text color="$color11" marginBottom="$4">
            {t('reasonStep.subtitle')}
          </Text>

          <YStack gap="$3">
            {REASON_KEYS.map((key) => (
              <OptionRow
                key={key}
                label={t(`reasonStep.options.${key}`)}
                onPress={handleReasonSelect}
              />
            ))}
          </YStack>
        </YStack>
      )}

      {step === 2 && (
        <YStack flex={1} gap="$4">
          <H2>{t('goalStep.title')}</H2>
          <Text color="$color11" marginBottom="$4">
            {t('goalStep.subtitle')}
          </Text>

          <YStack gap="$3">
            {GOALS.map((g) => (
              <OptionRow
                key={g}
                label={t('goalStep.option', { minutes: g })}
                onPress={() => handleGoalSelect(g)}
              />
            ))}
          </YStack>
        </YStack>
      )}

      {step === 3 && !showQuestion && (
        <YStack flex={1} gap="$4">
          <H4 color="$green11">{t('assessment.title')}</H4>
          <Text color="$color11">{t('assessment.instructions')}</Text>

          <ScrollView>
            <AppCard>
              <Text fontSize="$6" lineHeight={28}>
                {ASSESSMENT_TEXT}
              </Text>
            </AppCard>
          </ScrollView>

          <Button size="$5" theme="accent" onPress={handleFinishReading}>
            <Text color="$color">{t('assessment.finishReading')}</Text>
          </Button>
        </YStack>
      )}

      {step === 3 && showQuestion && (
        <YStack flex={1} gap="$4">
          <H4>{t('assessment.questionTitle')}</H4>
          <Text fontSize="$6" marginBottom="$4">
            {ASSESSMENT_QUESTION.question}
          </Text>

          <YStack gap="$3">
            {ASSESSMENT_QUESTION.options.map((opt, i) => (
              <Button
                key={i}
                size="$5"
                disabled={isSubmitting}
                onPress={() => handleAnswer(i)}
              >
                <Text>{opt}</Text>
              </Button>
            ))}
          </YStack>
        </YStack>
      )}
    </YStack>
  );
}
