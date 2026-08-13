import { useCallback, useEffect, useRef } from 'react';

/**
 * `setTimeout` that is cancelled if the component unmounts first.
 *
 * The exercise engines schedule short round-advance delays (typically 500 ms
 * of "show the answer, then draw the next round"). A bare `setTimeout` there
 * keeps running after the user leaves mid-round, then calls setState and
 * `generateNewRound()` on a dead hook - harmless today only because React 19
 * stopped warning about it, and exactly the kind of thing the cleanup rule in
 * AGENTS.md exists to prevent.
 *
 * Returns a stable `schedule` so call sites can list it in a dependency array
 * without re-creating their callbacks on every render.
 */
export function useManagedTimeout() {
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(clearTimeout);
      timeouts.clear();
    };
  }, []);

  return useCallback((callback: () => void, delayMs: number) => {
    const id = setTimeout(() => {
      timeoutsRef.current.delete(id);
      callback();
    }, delayMs);
    timeoutsRef.current.add(id);
    return id;
  }, []);
}
