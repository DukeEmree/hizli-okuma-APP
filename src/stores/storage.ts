import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

// Ana MMKV instance
export const mmkv = createMMKV({ id: 'hizli-okuma' });

/**
 * Mevcut giriş yapmış kullanıcının ID'si.
 * Bu ID, Clerk entegrasyonu (Faz 3) yapıldığında login/logout
 * işlemlerinde güncellenecektir.
 */
let activeUserId: string | null = 'guest';

export const setActiveUserId = (userId: string | null) => {
  activeUserId = userId;
};

export const getActiveUserId = () => activeUserId;

/**
 * Global (cihaz seviyesi) ayarlar için (tema, dil vb.)
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
 * Kullanıcıya özel veriler için (progress, stats vb.).
 * Key'leri `userId_` ile prefix'ler, böylece farklı kullanıcıların verileri izole edilir.
 */
export const userScopedStorageAdapter: StateStorage = {
  setItem: (name, value) => {
    const prefix = activeUserId || 'guest';
    return mmkv.set(`${prefix}_${name}`, value);
  },
  getItem: (name) => {
    const prefix = activeUserId || 'guest';
    const value = mmkv.getString(`${prefix}_${name}`);
    return value ?? null;
  },
  removeItem: (name) => {
    const prefix = activeUserId || 'guest';
    mmkv.remove(`${prefix}_${name}`);
  },
};
