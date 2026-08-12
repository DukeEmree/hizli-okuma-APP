import { analytics } from "@/lib/analytics";
import { captureException } from "@/lib/sentry";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUserProgressStore } from "@/stores/userProgressStore";
import { Button, Card, H2, H4, Text, XStack, YStack } from "tamagui";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Track } from "@/components/ui/track/Track";

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
      pressStyle={{ borderColor: "$accent9" }}
      onPress={onPress}
    >
      <Text fontSize="$5" fontWeight="500">{label}</Text>
      <YStack width={18} height={18} borderRadius={999} borderWidth={1.5} borderColor="$borderColor" />
    </XStack>
  );
}

const REASONS = [
  "Ders çalışmak",
  "Daha fazla kitap okumak",
  "İş",
  "Genel gelişim",
];

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
  const setHasCompletedOnboarding = useSettingsStore(s => s.setHasCompletedOnboarding);
  const setDailyGoalMinutes = useSettingsStore(s => s.setDailyGoalMinutes);
  const updateBestWpm = useUserProgressStore(s => s.updateBestWpm);
  const updateBestComprehension = useUserProgressStore(s => s.updateBestComprehension);

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
      <YStack marginBottom="$6">
        <Track data={stepTrackData} size="compact" height={5} showBaseline={false} />
      </YStack>

      {step === 1 && (
        <YStack flex={1} gap="$4">
          <H2>Neden hızlı okumak istiyorsunuz?</H2>
          <Text color="$color11" marginBottom="$4">
            Size en uygun programı oluşturabilmemiz için temel hedefinizi seçin.
          </Text>

          <YStack gap="$3">
            {REASONS.map((r) => (
              <OptionRow key={r} label={r} onPress={handleReasonSelect} />
            ))}
          </YStack>
        </YStack>
      )}

      {step === 2 && (
        <YStack flex={1} gap="$4">
          <H2>Günlük hedefiniz nedir?</H2>
          <Text color="$color11" marginBottom="$4">
            Düzenli pratik gelişimin anahtarıdır.
          </Text>

          <YStack gap="$3">
            {GOALS.map((g) => (
              <OptionRow key={g} label={`Günde ${g} dakika`} onPress={() => handleGoalSelect(g)} />
            ))}
          </YStack>
        </YStack>
      )}

      {step === 3 && !showQuestion && (
        <YStack flex={1} gap="$4">
          <H4 color="$accent9">Başlangıç Değerlendirmesi</H4>
          <Text color="$color11">
            Aşağıdaki metni kendi doğal hızınızda, anlayarak okuyun. Bittiğinde
            butona tıklayın.
          </Text>

          <ScrollView>
            <Card padding="$4" backgroundColor="$backgroundHover">
              <Text fontSize="$6" lineHeight={28}>
                {ASSESSMENT_TEXT}
              </Text>
            </Card>
          </ScrollView>

          <Button size="$5" theme="accent" onPress={handleFinishReading}>
            <Text color="$color">Okumayı Bitirdim</Text>
          </Button>
        </YStack>
      )}

      {step === 3 && showQuestion && (
        <YStack flex={1} gap="$4">
          <H4>Okuma Anlama Testi</H4>
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
