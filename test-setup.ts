import { mock } from 'bun:test';

// React Native code (and React itself, via react-test-renderer's `act`)
// reads the global __DEV__ flag that Metro normally injects at bundle time.
// bun's test runner never defines it, so any dev-mode-gated code path
// (e.g. React's act() internals) throws "ReferenceError: __DEV__ is not
// defined" unless we shim it here.
(globalThis as unknown as { __DEV__: boolean }).__DEV__ = true;

// Registered via bunfig.toml [test].preload, so these mocks are in place
// before any test file's static imports are resolved. bun's test runner
// parses a test file's whole static import graph up front - a mock.module()
// call placed inside the test file itself runs too late to intercept
// modules reached via top-level `import` statements (only dynamic imports
// made after that point would see it), so central preload is required here.
//
// react-native-mmkv/@amplitude's packages transitively require react-native's
// untranspiled (Flow-typed) source, which bun's parser cannot handle, so any
// test that imports app code using MMKV-backed storage or analytics needs
// these mocked out.

mock.module('react-native-mmkv', () => {
  const store = new Map<string, string>();
  return {
    createMMKV: () => ({
      set: (key: string, value: string) => store.set(key, value),
      getString: (key: string) => store.get(key),
      remove: (key: string) => store.delete(key),
    }),
  };
});

mock.module('@amplitude/analytics-react-native', () => ({
  init: () => {},
  track: () => {},
}));

mock.module('@/hooks/useAppState', () => ({
  useAppState: () => 'active',
}));

mock.module('react-native', () => ({
  Platform: { OS: 'ios' },
  AppState: {
    addEventListener: () => ({ remove: () => {} }),
  },
}));

mock.module('@sentry/react-native', () => ({
  init: () => {},
  withScope: (fn: (scope: { setExtra: () => void }) => void) => fn({ setExtra: () => {} }),
  captureException: () => {},
  setUser: () => {},
}));

mock.module('react-native-purchases', () => ({
  default: {
    configure: () => {},
    getCustomerInfo: () => Promise.resolve({}),
    getOfferings: () => Promise.resolve({}),
    addCustomerInfoUpdateListener: () => {},
    removeCustomerInfoUpdateListener: () => {},
    purchasePackage: () => Promise.resolve({}),
  }
}));
