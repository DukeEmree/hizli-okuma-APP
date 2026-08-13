import { registerDevMenuItems } from "expo-dev-client";
import * as Sentry from "@sentry/react-native";
import { reloadAppAsync } from "expo";

import { mmkv } from "@/stores/storage";
import { useSettingsStore } from "@/stores/settingsStore";

export function setupDevMenu() {
  if (!__DEV__) return;

  registerDevMenuItems([
    {
      name: "Tüm yerel veriyi temizle (MMKV)",
      callback: () => {
        mmkv.clearAll();
        reloadAppAsync();
      },
    },
    {
      name: "Onboarding'i sıfırla",
      callback: () => {
        useSettingsStore.getState().setHasCompletedOnboarding(false);
        reloadAppAsync();
      },
    },
    {
      name: "Test Sentry hatası gönder",
      callback: () => {
        Sentry.captureException(new Error("Dev menu test error"));
      },
    },
  ]);
}
