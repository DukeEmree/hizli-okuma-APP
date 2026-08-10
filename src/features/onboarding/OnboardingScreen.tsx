import { api } from "@/convex/_generated/api";
import { analytics } from "@/lib/analytics";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { useSettingsStore } from "@/stores/settingsStore";
import { Button, Card, H2, H4, Progress, Text, YStack } from "tamagui";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const { isSignedIn } = useAuth();
  const setHasCompletedOnboarding = useSettingsStore(s => s.setHasCompletedOnboarding);
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const [step, setStep] = useState(1);
  const insets = useSafeAreaInsets();
  const [reason, setReason] = useState<string | null>(null);
  const [goal, setGoal] = useState<number | null>(null);

  // Assessment State
  const assessmentStartMsRef = useRef<number | null>(null);
  const [readDurationMs, setReadDurationMs] = useState<number | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    analytics.track("onboarding_started");
  }, []);

  const handleReasonSelect = (r: string) => {
    setReason(r);
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

    // Basic difficulty adaptation (1 to 10)
    let startingDifficulty = 2; // Default
    if (initialWpm > 300 && comprehension === 100) startingDifficulty = 5;
    else if (initialWpm > 200 && comprehension === 100) startingDifficulty = 4;
    else if (initialWpm > 150) startingDifficulty = 3;

    try {
      if (isSignedIn) {
        await completeOnboarding({
          onboardingReason: reason || "Genel gelişim",
          trainingGoalMins: goal || 10,
          initialWpm,
          initialComprehension: comprehension,
          startingDifficulty,
        });
      }

      setHasCompletedOnboarding(true);
      analytics.track("onboarding_completed");
      router.replace("/(app)/(tabs)");
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" paddingTop={insets.top + 16} paddingBottom={insets.bottom + 16}>
      <Progress value={progress} size="$2" marginBottom="$6">
        <Progress.Indicator />
      </Progress>

      {step === 1 && (
        <YStack flex={1} gap="$4">
          <H2>Neden hızlı okumak istiyorsunuz?</H2>
          <Text color="$color11" marginBottom="$4">
            Size en uygun programı oluşturabilmemiz için temel hedefinizi seçin.
          </Text>

          <YStack gap="$3">
            {REASONS.map((r) => (
              <Button key={r} size="$5" onPress={() => handleReasonSelect(r)}>
                <Text>{r}</Text>
              </Button>
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
              <Button key={g} size="$5" onPress={() => handleGoalSelect(g)}>
                <Text>{`Günde ${g} dakika`}</Text>
              </Button>
            ))}
          </YStack>
        </YStack>
      )}

      {step === 3 && !showQuestion && (
        <YStack flex={1} gap="$4">
          <H4 color="$blue10">Başlangıç Değerlendirmesi</H4>
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
