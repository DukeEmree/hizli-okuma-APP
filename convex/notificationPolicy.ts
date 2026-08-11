// Pure event-type -> notification-content mapping. No Convex imports on
// purpose, so this stays trivially unit-testable and is the single place
// that decides whether a RevenueCat event is worth a push notification.

export type RevenueCatEventType =
  | 'INITIAL_PURCHASE'
  | 'RENEWAL'
  | 'CANCELLATION'
  | 'UNCANCELLATION'
  | 'EXPIRATION'
  | 'BILLING_ISSUE'
  | (string & {});

export interface NotificationContent {
  title: string;
  body: string;
  data: { screen: string };
}

// RENEWAL is intentionally silent — a notification on every successful
// renewal would be spam for an auto-renewing subscription.
export function decideNotification(eventType: RevenueCatEventType): NotificationContent | null {
  switch (eventType) {
    case 'INITIAL_PURCHASE':
      return {
        title: 'Premium Aktif! 🎉',
        body: 'Aboneliğin başladı, artık tüm özelliklere erişebilirsin.',
        data: { screen: '/(app)/(tabs)/settings' },
      };
    case 'CANCELLATION':
      return {
        title: 'Aboneliğin İptal Edildi',
        body: 'Premium erişimin mevcut dönem sonuna kadar devam edecek.',
        data: { screen: '/(app)/(tabs)/settings' },
      };
    case 'UNCANCELLATION':
      return {
        title: 'Aboneliğin Devam Ediyor',
        body: 'İptal işlemini geri aldın, aboneliğin yenilenmeye devam edecek.',
        data: { screen: '/(app)/(tabs)/settings' },
      };
    case 'EXPIRATION':
      return {
        title: 'Premium Süresi Doldu',
        body: 'Premium erişimin sona erdi. Kaldığın yerden devam etmek için yeniden abone olabilirsin.',
        data: { screen: '/(app)/(tabs)/settings' },
      };
    case 'BILLING_ISSUE':
      return {
        title: 'Ödeme Sorunu',
        body: 'Aboneliğinle ilgili bir ödeme sorunu oluştu. Lütfen ödeme yöntemini kontrol et.',
        data: { screen: '/(app)/(tabs)/settings' },
      };
    default:
      return null;
  }
}
