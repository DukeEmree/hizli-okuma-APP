import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useAuth } from '@clerk/clerk-expo';

export function useSyncTimezone() {
  const { isLoaded, isSignedIn } = useAuth();
  const updateTimezone = useMutation(api.streaks.updateTimezone);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
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
  }, [isLoaded, isSignedIn, updateTimezone]);
}
