import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme } from "tamagui";

import { AuthSync } from "@/components/auth/AuthSync";
import { AchievementPopupGlobal } from "@/components/gamification/AchievementPopup";
import { api } from "@/convex/_generated/api";
import { useSyncTimezone } from "@/hooks/useSyncTimezone";
import { analytics } from "@/lib/analytics";
import { initSentry } from "@/lib/sentry";
import { RevenueCatProvider } from "@/providers/RevenueCatProvider";
import { SyncProvider } from "@/providers/SyncProvider";
import { useSettingsStore } from "@/stores/settingsStore";
import { useQuery } from "convex/react";

import { SafeAreaProvider } from "react-native-safe-area-context";

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

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    const isCloudOnboarded =
      convexUser !== null && convexUser?.isOnboarded === true;
    const isLocallyOnboarded = hasCompletedOnboarding;

    // We consider the user onboarded if either cloud says so (logged in) or local says so
    const userIsOnboarded = isSignedIn ? isCloudOnboarded : isLocallyOnboarded;

    if (isSignedIn && convexUser === undefined) {
      // Still loading convex user, wait
      return;
    }

    if (!userIsOnboarded && !inOnboardingGroup) {
      router.replace("/(onboarding)");
    } else if (userIsOnboarded && (inAuthGroup || inOnboardingGroup)) {
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
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(onboarding)"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}
SplashScreen.preventAutoHideAsync();

// Initialize Observability
initSentry();

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
                  <SyncProvider>
                    <AuthSync />
                    <RootNavigation />
                    <AchievementPopupGlobal />
                  </SyncProvider>
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
