import { describe, expect, mock, test } from 'bun:test';
import { renderHook } from '@testing-library/react-hooks';

import { useManagedTimeout } from '../useManagedTimeout';

const tick = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('useManagedTimeout', () => {
  test('runs the callback when the component is still mounted', async () => {
    const spy = mock(() => {});
    const { result } = renderHook(() => useManagedTimeout());

    result.current(spy, 10);
    await tick(30);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('does not run the callback after unmount', async () => {
    const spy = mock(() => {});
    const { result, unmount } = renderHook(() => useManagedTimeout());

    result.current(spy, 30);
    unmount();
    await tick(60);

    expect(spy).not.toHaveBeenCalled();
  });

  test('cancels every pending callback, not just the last one', async () => {
    const first = mock(() => {});
    const second = mock(() => {});
    const { result, unmount } = renderHook(() => useManagedTimeout());

    result.current(first, 30);
    result.current(second, 40);
    unmount();
    await tick(70);

    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });

  test('leaving before the delay elapses is what cancels the interstitial paywall', async () => {
    // The behaviour this guarantees for the two interstitial triggers: the
    // prompt is queued behind the celebration, and both `markShown` (which
    // spends the four-day silence window) and the navigation live inside the
    // callback. Unmounting first must therefore leave the window unspent.
    const markShown = mock(() => {});
    const navigate = mock(() => {});
    const { result, unmount } = renderHook(() => useManagedTimeout());

    result.current(() => {
      markShown();
      navigate();
    }, 2000);
    unmount();
    await tick(30);

    expect(markShown).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
