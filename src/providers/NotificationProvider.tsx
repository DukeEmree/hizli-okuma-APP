import {
  rescheduleAllReminders,
  setupNotificationChannels,
} from "@/services/notifications";
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

  useEffect(() => {
    // 1. Setup Channels
    setupNotificationChannels();

    // 2. Notification response listener (Deep linking)
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data?.screen as
          string | undefined;
        if (screen) {
          // @ts-ignore - Dynamic route string
          router.push(screen as any);
        }
      },
    );

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
