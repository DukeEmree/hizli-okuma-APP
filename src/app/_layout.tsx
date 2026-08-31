import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme } from "tamagui";

import * as Sentry from "@sentry/react-native";

import { AchievementPopupGlobal } from "@/components/gamification/AchievementPopup";
import { AppErrorBoundary } from "@/components/ui/AppErrorBoundary";
import { analytics } from "@/lib/analytics";
import { setupDevMenu } from "@/lib/devMenu";
import { initSentry } from "@/lib/sentry";
import { RevenueCatProvider } from "@/providers/RevenueCatProvider";
import { AppNotificationProvider } from "@/providers/NotificationProvider";
import { useSettingsStore } from "@/stores/settingsStore";

import { SafeAreaProvider } from "react-native-safe-area-context";

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
SplashScreen.preventAutoHideAsync();

// Initialize Observability. analytics.init() must run before the first
// analytics.track() call below - without it the Amplitude SDK is never
// configured and every tracked event is silently dropped in production.
initSentry();
analytics.init();
setupDevMenu();

/**
 * Expo Router renders this instead of the tree below when a descendant
 * throws during render. Without it a render-time error leaves a blank app
 * and the throw never reaches Sentry.
 */
export { AppErrorBoundary as ErrorBoundary };

function RootLayout() {
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
              <AppNotificationProvider>
                <RootNavigation />
                <AchievementPopupGlobal />
              </AppNotificationProvider>
            </ThemeProvider>
          </Theme>
        </TamaguiProvider>
      </RevenueCatProvider>
    </SafeAreaProvider>
  );
}

// Unhandled exceptions reach Sentry either way, but wrapping the root layout
// is what attaches the React component-tree context and touch breadcrumbs to
// them - without it a production crash report is a bare stack with no trail
// of what the user did to get there. This is the setup Expo documents.
export default Sentry.wrap(RootLayout);
