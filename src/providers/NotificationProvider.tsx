import {
  rescheduleAllReminders,
  scheduleWeeklySummaryNotification,
  setupNotificationChannels,
} from "@/services/notifications";
import * as Notifications from "expo-notifications";
import { useRouter, type Href } from "expo-router";
import React, { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

/**
 * The only destinations a notification is allowed to deep-link to. The
 * payload is matched against this map instead of being pushed straight into
 * the router: `data.screen` is an untyped string coming back from the OS, and
 * a stale or malformed one would otherwise push a route that doesn't exist.
 */
const DEEP_LINK_ROUTES: Record<string, Href> = {
  "/(app)/(tabs)/": "/(app)/(tabs)",
  "/(app)/(tabs)/exercises": "/(app)/(tabs)/exercises",
  "/(app)/(tabs)/statistics": "/(app)/(tabs)/statistics",
  "/(app)/weekly-summary": "/(app)/weekly-summary",
};

export function AppNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Channels must exist before anything is scheduled against a channelId;
    // both scheduling helpers await the same memoised setup internally, so
    // this is only here to warm it as early as possible.
    setupNotificationChannels().catch(console.error);
    scheduleWeeklySummaryNotification().catch(console.error);
  }, []);

  useEffect(() => {
    const navigateToScreen = (
      response: Notifications.NotificationResponse | null,
    ) => {
      const screen = response?.notification.request.content.data?.screen;
      if (typeof screen !== "string") return;
      const route = DEEP_LINK_ROUTES[screen];
      if (route) router.push(route);
    };

    // Warm/background taps.
    const subscription =
      Notifications.addNotificationResponseReceivedListener(navigateToScreen);

    // Cold start: app launched by tapping a notification. The OS keeps the
    // last response around indefinitely, so it must be cleared once handled -
    // otherwise every subsequent normal launch replays the same deep link and
    // drops the user on a screen they didn't ask for.
    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (!response) return;
        navigateToScreen(response);
        Notifications.clearLastNotificationResponse();
      })
      .catch(console.error);

    // Reschedule the reminder calendar whenever the app leaves the foreground.
    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "background" || nextAppState === "inactive") {
          rescheduleAllReminders().catch(console.error);
        }
      },
    );

    return () => {
      subscription.remove();
      appStateSubscription.remove();
    };
  }, [router]);

  return <>{children}</>;
}
