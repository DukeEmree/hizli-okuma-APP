import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme, YStack } from "tamagui";
import { Toast, ToastProvider, ToastViewport, useToastState } from "@tamagui/toast";

import { AchievementPopupGlobal } from "@/components/gamification/AchievementPopup";
import { analytics } from "@/lib/analytics";
import { initSentry } from "@/lib/sentry";
import { RevenueCatProvider } from "@/providers/RevenueCatProvider";
import { AppNotificationProvider } from "@/providers/NotificationProvider";
import { useSettingsStore } from "@/stores/settingsStore";

import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import tamaguiConfig from "../../tamagui.config";
import "../i18n";

import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";

function RootNavigation() {
  const segments = useSegments();
  const router = useRouter();
  const hasCompletedOnboarding = useSettingsStore(
    (state) => state.hasCompletedOnboarding,
  );

  useEffect(() => {
    const inAppGroup = segments[0] === "(app)";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    const inPaywall = segments[0] === "paywall";

    if (!hasCompletedOnboarding) {
      if (!inOnboardingGroup) router.replace("/(onboarding)");
    } else if (!inAppGroup && !inPaywall) {
      router.replace("/(app)/(tabs)");
    }
  }, [segments, hasCompletedOnboarding, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(onboarding)"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}
function CurrentToast() {
  const currentToast = useToastState();
  if (!currentToast || currentToast.isHandledNatively) return null;
  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      transition="quick"
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
    >
      <YStack>
        <Toast.Title>{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  );
}

function AppToastViewport() {
  const insets = useSafeAreaInsets();
  return <ToastViewport top={insets.top} left={0} right={0} />;
}

SplashScreen.preventAutoHideAsync();

// Initialize Observability. analytics.init() must run before the first
// analytics.track() call below - without it the Amplitude SDK is never
// configured and every tracked event is silently dropped in production.
initSentry();
analytics.init();

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const settingsTheme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    analytics.track("app_opened");
  }, []);

  const activeTheme = (settingsTheme === "system" ? (systemColorScheme === "dark" ? "dark" : "light") : settingsTheme) as 'light' | 'dark';
  const navigationTheme = activeTheme === "dark" ? DarkTheme : DefaultTheme;

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <RevenueCatProvider>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={activeTheme}>
          <Theme name={activeTheme}>
            <ThemeProvider value={navigationTheme}>
              <StatusBar
                style={activeTheme === "dark" ? "light" : "dark"}
                animated
              />
              <ToastProvider swipeDirection="horizontal" duration={3000}>
                <AppNotificationProvider>
                  <RootNavigation />
                  <AchievementPopupGlobal />
                </AppNotificationProvider>
                <CurrentToast />
                <AppToastViewport />
              </ToastProvider>
            </ThemeProvider>
          </Theme>
        </TamaguiProvider>
      </RevenueCatProvider>
    </SafeAreaProvider>
  );
}

// Sentry.wrap is optional for basic error tracking, but it provides better React component tree error boundaries.
// Expo Router might conflict if we wrap RootLayout directly in some versions, but standard is to wrap it.
// We'll wrap the layout.
// Note: In some setups, you wrap the component directly: export default Sentry.wrap(RootLayout);
// However, with Expo Router, you can just export the unwrapped RootLayout and Sentry will still catch unhandled exceptions.
// We will leave it unwrapped to avoid Expo Router issues.
