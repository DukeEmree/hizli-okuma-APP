import type { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

const memoryStore = new Map<string, string>();

let mmkvInstance: MMKV | null = null;
let mmkvInitAttempted = false;

function getNativeMMKV(): MMKV | null {
  if (mmkvInitAttempted) return mmkvInstance;
  mmkvInitAttempted = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createMMKV } = require('react-native-mmkv');
    mmkvInstance = createMMKV({ id: 'hizli-okuma' });
    return mmkvInstance;
  } catch {
    if (__DEV__) {
      console.warn(
        '[Storage] react-native-mmkv / NitroModules yerel modülü bulunamadı. Bellek içi (memory) depolamaya geçildi. (Kalıcı yerel MMKV için `bun run android` veya `bun run ios` ile dev client derlemesi yapın).'
      );
    }
    mmkvInstance = null;
    return null;
  }
}

/**
 * MMKV arayüzü ile uyumlu, yerel modül eksikliğinde (Expo Go / Web) çökmeyen güvenli storage sarmalayıcısı.
 */
export const mmkv = {
  set: (key: string, value: string | number | boolean | ArrayBuffer) => {
    const native = getNativeMMKV();
    if (native) {
      native.set(key, value);
    } else {
      memoryStore.set(key, String(value));
    }
  },
  getString: (key: string): string | undefined => {
    const native = getNativeMMKV();
    if (native) {
      return native.getString(key);
    }
    return memoryStore.get(key);
  },
  getNumber: (key: string): number | undefined => {
    const native = getNativeMMKV();
    if (native) {
      return native.getNumber(key);
    }
    const val = memoryStore.get(key);
    return val !== undefined ? Number(val) : undefined;
  },
  getBoolean: (key: string): boolean | undefined => {
    const native = getNativeMMKV();
    if (native) {
      return native.getBoolean(key);
    }
    const val = memoryStore.get(key);
    return val !== undefined ? val === 'true' : undefined;
  },
  remove: (key: string) => {
    const native = getNativeMMKV();
    if (native) {
      native.remove(key);
    } else {
      memoryStore.delete(key);
    }
  },
  clearAll: () => {
    const native = getNativeMMKV();
    if (native) {
      native.clearAll();
    } else {
      memoryStore.clear();
    }
  },
  getAllKeys: (): string[] => {
    const native = getNativeMMKV();
    if (native) {
      return native.getAllKeys();
    }
    return Array.from(memoryStore.keys());
  },
};

/**
 * Ana (cihaz seviyesi) depolama adaptörü.
 */
export const globalStorageAdapter: StateStorage = {
  setItem: (name, value) => {
    mmkv.set(name, value);
  },
  getItem: (name) => {
    const value = mmkv.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    mmkv.remove(name);
  },
};

/**
 * Historically prefixed per-user storage; now just an alias of
 * `globalStorageAdapter` since the app has no accounts and therefore only
 * ever one local user. Kept as a separate export so the stores that use it
 * don't need call-site changes.
 */
export const userScopedStorageAdapter: StateStorage = globalStorageAdapter;
