import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const mmkv = createMMKV({ id: 'hizli-okuma' });

/**
 * Ana (cihaz seviyesi) depolama adaptörü.
 */
export const globalStorageAdapter: StateStorage = {
  setItem: (name, value) => {
    return mmkv.set(name, value);
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
