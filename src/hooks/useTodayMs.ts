import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { getLocalDateString } from '@/utils/streak';

/**
 * A timestamp that stays valid for "today" on a screen that never unmounts.
 *
 * Tab screens stay mounted for the life of the app, so a timestamp captured at
 * first render outlives the day it was taken on: an app left in the background
 * overnight comes back still calling yesterday "today". This re-takes it when
 * the app returns to the foreground, and only when the local date has actually
 * rolled over, so callers memoising on the value stay stable within a day.
 */
export function useTodayMs(timeZone: string): number {
  // eslint-disable-next-line react-hooks/purity
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (next) => {
      if (next !== 'active') return;
      setNow((prev) => {
        const fresh = Date.now();
        return getLocalDateString(fresh, timeZone) === getLocalDateString(prev, timeZone)
          ? prev
          : fresh;
      });
    });
    return () => subscription.remove();
  }, [timeZone]);

  return now;
}
