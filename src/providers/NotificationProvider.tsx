import {
  rescheduleAllReminders,
  scheduleWeeklySummaryNotification,
  setupNotificationChannels,
} from "@/services/notifications";
import { usePushNotificationToken } from "@/hooks/usePushNotificationToken";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
// import { setupNotificationChannels, rescheduleAllReminders } from '@/services/notifications';

export function AppNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  usePushNotificationToken();

  useEffect(() => {
    scheduleWeeklySummaryNotification().catch(console.error);
  }, []);

  useEffect(() => {
    // 1. Setup Channels
    setupNotificationChannels();

    const navigateToScreen = (
      response: Notifications.NotificationResponse | null,
    ) => {
      const screen = response?.notification.request.content.data?.screen as
        string | undefined;
      if (screen) {
        // @ts-ignore - Dynamic route string
        router.push(screen as any);
      }
    };

    // 2. Notification response listener (Deep linking) — warm/background taps
    const subscription =
      Notifications.addNotificationResponseReceivedListener(navigateToScreen);

    // 2b. Cold start: app launched by tapping a notification
    Notifications.getLastNotificationResponseAsync().then(navigateToScreen);

    // 3. App State Listener (Reschedule on background)
    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "background" || nextAppState === "inactive") {
          // App backgrounda atıldığında tüm takvimi ileri sarıp güncelliyoruz
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
