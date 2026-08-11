import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme, YStack } from "tamagui";
import { Toast, ToastProvider, ToastViewport, useToastState } from "@tamagui/toast";

import { AuthSync } from "@/components/auth/AuthSync";
import { AchievementPopupGlobal } from "@/components/gamification/AchievementPopup";
import { api } from "@/convex/_generated/api";
import { useSyncTimezone } from "@/hooks/useSyncTimezone";
import { analytics } from "@/lib/analytics";
import { initSentry } from "@/lib/sentry";
import { RevenueCatProvider } from "@/providers/RevenueCatProvider";
import { SyncProvider } from "@/providers/SyncProvider";
import { AppNotificationProvider } from "@/providers/NotificationProvider";
import { useSettingsStore } from "@/stores/settingsStore";
import { useQuery } from "convex/react";

import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import tamaguiConfig from "../../tamagui.config";
import "../i18n";

import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";

const CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "missing_key";
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL || "missing_url";

const convex = new ConvexReactClient(CONVEX_URL, {
  unsavedChangesWarning: false,
});

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};

function RootNavigation() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const hasCompletedOnboarding = useSettingsStore(
    (state) => state.hasCompletedOnboarding,
  );

  // This might return undefined initially
  const convexUser = useQuery(api.users.getMe);

  useSyncTimezone();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && convexUser === undefined) {
      // Still loading convex user, wait
      return;
    }

    const inAppGroup = segments[0] === "(app)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    const isCloudOnboarded =
      convexUser !== null && convexUser?.isOnboarded === true;
    const isLocallyOnboarded = hasCompletedOnboarding;

    // A signed-in user counts as onboarded if either side says so. Cloud
    // alone isn't enough: right after sign-in `getMe` resolves to null for
    // the moment before AuthSync's `users.store` mutation creates the row,
    // which would bounce an already-onboarded device into the onboarding
    // flow and straight back out again. AuthSync seeds the new row with
    // this same local flag, so the two can't disagree for long.
    const userIsOnboarded = isSignedIn
      ? isCloudOnboarded || isLocallyOnboarded
      : isLocallyOnboarded;

    if (!userIsOnboarded) {
      if (!inOnboardingGroup) router.replace("/(onboarding)");
    } else if (!inAppGroup) {
      router.replace("/(app)/(tabs)");
    }
  }, [
    isSignedIn,
    isLoaded,
    segments,
    convexUser,
    hasCompletedOnboarding,
    router,
  ]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
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
                      <SyncProvider>
                        <AuthSync />
                        <RootNavigation />
                        <AchievementPopupGlobal />
                      </SyncProvider>
                    </AppNotificationProvider>
                    <CurrentToast />
                    <AppToastViewport />
                  </ToastProvider>
                </ThemeProvider>
              </Theme>
            </TamaguiProvider>
          </RevenueCatProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}

// Sentry.wrap is optional for basic error tracking, but it provides better React component tree error boundaries.
// Expo Router might conflict if we wrap RootLayout directly in some versions, but standard is to wrap it.
// We'll wrap the layout.
// Note: In some setups, you wrap the component directly: export default Sentry.wrap(RootLayout);
// However, with Expo Router, you can just export the unwrapped RootLayout and Sentry will still catch unhandled exceptions.
// We will leave it unwrapped to avoid Expo Router issues.
