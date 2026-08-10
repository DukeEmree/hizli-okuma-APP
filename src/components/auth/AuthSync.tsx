import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { setActiveUserId } from "@/stores/storage";
import { migrateGuestDataToUser } from "@/utils/migration";
import { useUserProgressStore } from '@/stores/userProgressStore';
import { useSyncStore } from '@/stores/syncStore';
import { useStreakCacheStore } from '@/stores/streakCacheStore';
import { useExerciseProgressStore } from '@/stores/exerciseProgressStore';
import { useExerciseSettingsStore } from '@/stores/useExerciseSettingsStore';
import { analytics } from '@/lib/analytics';
import { setSentryUser } from '@/lib/sentry';

export function AuthSync() {
  const { isSignedIn, userId, isLoaded } = useAuth();
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (isSignedIn && userId) {
      // Migrate guest sessions and local progress to this new user account before changing activeUserId
      migrateGuestDataToUser(userId);
      
      // Convex tarafında kullanıcıyı kaydet veya güncelle
      storeUser().catch(err => console.error('Failed to sync user to Convex:', err));
      
      // Local storage izole işlemi için user id ayarla
      setActiveUserId(userId);
      
      // Bind identity for Observability
      analytics.identify(userId);
      setSentryUser(userId);
    } else {
      setActiveUserId(null);
      analytics.identify(null);
      setSentryUser(null);
    }
    
    // Rehydrate stores to reflect the newly active user's storage
    useUserProgressStore.persist.rehydrate();
    useSyncStore.persist.rehydrate();
    useStreakCacheStore.persist.rehydrate();
    useExerciseProgressStore.persist.rehydrate();
    useExerciseSettingsStore.persist.rehydrate();

  }, [isLoaded, isSignedIn, userId, storeUser]);

  return null;
}
