import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useAuth } from '@clerk/clerk-expo';
import { useRevenueCat } from '@/providers/RevenueCatProvider';

export function useSyncTimezone() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isPremium } = useRevenueCat();
  const updateTimezone = useMutation(api.streaks.updateTimezone);

  useEffect(() => {
    // Timezone is only used server-side for streak calc, which is premium-only.
    if (isLoaded && isSignedIn && isPremium) {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timeZone) {
          updateTimezone({ timezone: timeZone }).catch(e => {
            console.warn('Failed to sync timezone', e);
          });
        }
      } catch (error) {
        console.warn('Could not determine timezone', error);
      }
    }
  }, [isLoaded, isSignedIn, isPremium, updateTimezone]);
}
