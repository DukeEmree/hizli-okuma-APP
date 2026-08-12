import * as ExpoHaptics from 'expo-haptics';
import { useSettingsStore } from '@/stores/settingsStore';

function isEnabled(): boolean {
  return useSettingsStore.getState().hapticsEnabled;
}

export const haptics = {
  light: () => {
    if (!isEnabled()) return;
    ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light).catch(() => {});
  },
  success: () => {
    if (!isEnabled()) return;
    ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success).catch(() => {});
  },
  error: () => {
    if (!isEnabled()) return;
    ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error).catch(() => {});
  },
};
