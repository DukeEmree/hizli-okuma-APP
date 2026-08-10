import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import auth from './locales/tr/auth.json';
import common from './locales/tr/common.json';
import errors from './locales/tr/errors.json';
import exercises from './locales/tr/exercises.json';
import home from './locales/tr/home.json';
import leaderboard from './locales/tr/leaderboard.json';
import navigation from './locales/tr/navigation.json';
import onboarding from './locales/tr/onboarding.json';
import progress from './locales/tr/progress.json';
import settings from './locales/tr/settings.json';
import subscription from './locales/tr/subscription.json';
import notifications from './locales/tr/notifications.json';

export const defaultNS = 'common';
export const resources = {
  tr: {
    auth,
    common,
    errors,
    exercises,
    home,
    leaderboard,
    navigation,
    onboarding,
    progress,
    settings,
    subscription,
    notifications,
  },
} as const;

// Simplified language detection logic for Phase 1
const getDeviceLanguage = () => {
  const locales = Localization.getLocales();
  if (locales && locales.length > 0) {
    const languageCode = locales[0].languageCode;
    if (languageCode === 'tr') {
      return 'tr';
    }
  }
  return 'tr';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'tr',
    defaultNS,
    interpolation: {
      escapeValue: false, // react is already safe from xss
    },
    compatibilityJSON: 'v4', // Needed for React Native
  });

export default i18n;
