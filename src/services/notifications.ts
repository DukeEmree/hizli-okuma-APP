import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import i18n from '@/i18n';
import { useSettingsStore } from '@/stores/settingsStore';
import { useStreakCacheStore } from '@/stores/streakCacheStore';

// Bildirimlerin uygulamada nasıl gösterileceğini yapılandırıyoruz
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const CHANNELS = {
  REMINDERS: 'reminders',
  PROGRESS: 'progress',
};

export async function setupNotificationChannels() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNELS.REMINDERS, {
      name: 'Hatırlatmalar',
      importance: Notifications.AndroidImportance.HIGH,
    });
    await Notifications.setNotificationChannelAsync(CHANNELS.PROGRESS, {
      name: 'İlerleme ve Başarılar',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
}

function isSameDay(timestamp1: number, timestamp2: number) {
  const d1 = new Date(timestamp1);
  const d2 = new Date(timestamp2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

/**
 * Parses time string like "20:00" and returns next Date for the given day offset
 */
function getNextReminderDate(daysToAdd: number, timeString: string): Date | null {
  const parts = timeString.split(':');
  if (parts.length !== 2) return null;
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  
  const now = new Date();
  const scheduledDate = new Date();
  
  if (daysToAdd === 0) {
    scheduledDate.setHours(hours, minutes, 0, 0);
    // Eğer bugünün saati geçmişse, bugüne kuramayız, null döneriz
    if (scheduledDate.getTime() <= now.getTime()) {
      return null;
    }
  } else {
    scheduledDate.setDate(scheduledDate.getDate() + daysToAdd);
    scheduledDate.setHours(hours, minutes, 0, 0);
  }
  
  return scheduledDate;
}

const DAILY_REMINDER_IDENTIFIER = 'daily-reminder';
const INACTIVITY_3_IDENTIFIER = 'inactivity-3';
const INACTIVITY_7_IDENTIFIER = 'inactivity-7';

export async function rescheduleAllReminders() {
  // Sadece bu fonksiyonun yönettiği bildirimleri iptal et (ör. weekly-summary'i etkilemesin)
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_IDENTIFIER).catch(() => {});
  await Notifications.cancelScheduledNotificationAsync(INACTIVITY_3_IDENTIFIER).catch(() => {});
  await Notifications.cancelScheduledNotificationAsync(INACTIVITY_7_IDENTIFIER).catch(() => {});

  const settings = useSettingsStore.getState();
  const streakData = useStreakCacheStore.getState();
  
  if (!settings.notificationsEnabled) {
    return;
  }

  const now = Date.now();
  const exercisedToday = isSameDay(streakData.lastActivityAt, now);
  
  // 1. GÜNLÜK / STREAK HATIRLATMASI
  let day1Offset = exercisedToday ? 1 : 0; // Bugün yaptıysa yarına, yapmadıysa bugüne
  let day1Date = getNextReminderDate(day1Offset, settings.dailyReminderTime);
  
  // Eğer saat geçmişse (day1Offset 0 iken) ve null döndüyse, yarına kur
  if (!day1Date && day1Offset === 0) {
    day1Offset = 1;
    day1Date = getNextReminderDate(day1Offset, settings.dailyReminderTime);
  }

  if (day1Date) {
    let title = '';
    let body = '';

    if (streakData.currentStreak > 0 && settings.streakReminderEnabled) {
      title = i18n.t('notifications:streakReminder.title', 'Serini Korumaya Az Kaldı! 🔥');
      body = i18n.t('notifications:streakReminder.body', 'Bugünkü egzersizini tamamla, serin bozulmasın.');
    } else if (settings.dailyReminderEnabled) {
      title = i18n.t('notifications:dailyReminder.title1', 'Günlük Antrenman Zamanı 📖');
      body = i18n.t('notifications:dailyReminder.body1', 'Bugünkü egzersizini tamamlamaya hazır mısın?');
    }

    if (title && body) {
      await Notifications.scheduleNotificationAsync({
        identifier: DAILY_REMINDER_IDENTIFIER,
        content: {
          title,
          body,
          data: { screen: '/(app)/(tabs)/exercises' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: day1Date,
        },
      });
    }
  }

  // 2. INACTIVITY REMINDERS
  if (settings.dailyReminderEnabled) {
    const day3Date = getNextReminderDate(3, settings.dailyReminderTime);
    if (day3Date) {
      await Notifications.scheduleNotificationAsync({
        identifier: INACTIVITY_3_IDENTIFIER,
        content: {
          title: i18n.t('notifications:inactivity3.title', 'Seni Özledik 📚'),
          body: i18n.t('notifications:inactivity3.body', 'Bir süredir görüşmedik. Bugün kısa bir egzersizle devam edelim.'),
          data: { screen: '/(app)/(tabs)/' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: day3Date,
        },
      });
    }

    const day7Date = getNextReminderDate(7, settings.dailyReminderTime);
    if (day7Date) {
      await Notifications.scheduleNotificationAsync({
        identifier: INACTIVITY_7_IDENTIFIER,
        content: {
          title: i18n.t('notifications:inactivity7.title', 'Antrenmana Geri Dön! 🚀'),
          body: i18n.t('notifications:inactivity7.body', 'Okuma antrenmanına geri dönmeye hazır mısın?'),
          data: { screen: '/(app)/(tabs)/' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: day7Date,
        },
      });
    }
  }
}

export async function sendMilestoneNotification(days: number) {
  const settings = useSettingsStore.getState();
  
  if (!settings.notificationsEnabled || !settings.progressNotificationsEnabled) {
    return;
  }
  
  if (settings.notifiedMilestones.includes(days)) {
    return; // Daha önce gönderilmiş
  }

  const title = i18n.t('notifications:milestone.title', 'Tebrikler! 🎉');
  const body = i18n.t('notifications:milestone.body', `Harika! ${days} günlük seriye ulaştın. Böyle devam et!`, { days });

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { screen: '/(app)/(tabs)/statistics' },
    },
    trigger: null, // Hemen göster (Eğer app background\'da ise veya foreground kurallarına göre)
  });

  settings.addNotifiedMilestone(days);
}

/** Stable ID so re-scheduling replaces the existing request instead of stacking a duplicate. */
const WEEKLY_SUMMARY_IDENTIFIER = 'weekly-summary';
const WEEKLY_SUMMARY_SCREEN = '/(app)/weekly-summary';

/**
 * Schedules a generic native WEEKLY trigger that recurs every
 * Sunday 20:00 on-device forever, with no per-week rescheduling needed.
 * Content is static (no numbers) because it's set once, days before the
 * real numbers exist; the summary screen it deep-links to computes those
 * from live local data when opened.
 */
export async function scheduleWeeklySummaryNotification() {
  const settings = useSettingsStore.getState();

  if (!settings.notificationsEnabled || !settings.progressNotificationsEnabled) {
    await Notifications.cancelScheduledNotificationAsync(WEEKLY_SUMMARY_IDENTIFIER).catch(() => {});
    return;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: WEEKLY_SUMMARY_IDENTIFIER,
    content: {
      title: i18n.t('notifications:weeklySummaryReady.title', 'Haftalık Özetin Hazır 📊'),
      body: i18n.t('notifications:weeklySummaryReady.body', 'Bu haftaki okuma özetini görmek için dokun.'),
      data: { screen: WEEKLY_SUMMARY_SCREEN },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1, // expo-notifications: 1 = Sunday
      hour: 20,
      minute: 0,
    },
  });
}
