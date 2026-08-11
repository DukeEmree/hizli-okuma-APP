import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSettingsStore } from "@/stores/settingsStore";
import { captureException } from "@/lib/sentry";

// Registers/refreshes this device's Expo push token in Convex while signed
// in, and releases it on logout or when the user disables notifications —
// so a stale token never keeps receiving pushes for an account that's no
// longer active on this device.
export function usePushNotificationToken() {
  const { isLoaded, isSignedIn } = useAuth();
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const registerToken = useMutation(api.pushTokens.registerToken);
  const removeToken = useMutation(api.pushTokens.removeToken);
  const syncEnabled = useMutation(api.users.setPushNotificationsEnabled);
  const registeredTokenRef = useRef<string | null>(null);
  const wasSignedInRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    syncEnabled({ enabled: notificationsEnabled }).catch((error) => {
      captureException(error, { context: "usePushNotificationToken.syncEnabled" });
    });
  }, [isLoaded, isSignedIn, notificationsEnabled, syncEnabled]);

  useEffect(() => {
    if (!isLoaded) return;
    if (Platform.OS !== "ios" && Platform.OS !== "android") return;

    let cancelled = false;

    async function sync() {
      if (!isSignedIn) {
        if (wasSignedInRef.current && registeredTokenRef.current) {
          try {
            await removeToken({ token: registeredTokenRef.current });
          } catch (error) {
            captureException(error, { context: "usePushNotificationToken.removeToken.logout" });
          }
        }
        registeredTokenRef.current = null;
        wasSignedInRef.current = false;
        return;
      }
      wasSignedInRef.current = true;

      if (!notificationsEnabled) {
        if (registeredTokenRef.current) {
          try {
            await removeToken({ token: registeredTokenRef.current });
          } catch (error) {
            captureException(error, { context: "usePushNotificationToken.removeToken.disabled" });
          }
          registeredTokenRef.current = null;
        }
        return;
      }

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") return;

      const projectId = Constants.expoConfig?.extra?.eas?.projectId as
        | string
        | undefined;
      if (!projectId) {
        captureException(new Error("Missing EAS projectId, cannot register push token"), {
          context: "usePushNotificationToken.projectId",
        });
        return;
      }

      try {
        const { data: token } = await Notifications.getExpoPushTokenAsync({
          projectId,
        });
        if (cancelled || registeredTokenRef.current === token) return;

        await registerToken({
          token,
          platform: Platform.OS === "ios" ? "ios" : "android",
        });
        registeredTokenRef.current = token;
      } catch (error) {
        captureException(error, { context: "usePushNotificationToken.registerToken" });
      }
    }

    sync();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, notificationsEnabled, registerToken, removeToken]);
}
