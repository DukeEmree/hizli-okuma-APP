/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import { calculateWordsCount, calculateWPM, calculateDurationFromWPM } from "@/utils/reading";

describe('Reading Utilities', () => {
  describe('calculateWordsCount', () => {
    test('boş metin için 0 dönmeli', () => {
      expect(calculateWordsCount('')).toBe(0);
      expect(calculateWordsCount('   ')).toBe(0);
    });

    test('temel kelimeleri doğru saymalı', () => {
      expect(calculateWordsCount('Merhaba dünya')).toBe(2);
      expect(calculateWordsCount('Hızlı okuma bir ayrıcalık değil, sonradan kazanılabilen bir beceridir.')).toBe(9);
    });

    test('noktalama işaretlerini ve satır sonlarını ayıklamalı', () => {
      const text = `
        Bu birinci cümle!
        Bu da ikinci cümle...
        Peki ya üçüncü?
      `;
      expect(calculateWordsCount(text)).toBe(10);
    });

    test('tireli kelimeleri doğru işlemeli', () => {
      expect(calculateWordsCount('çek-yat kelimesi')).toBe(2); // 'çek-yat' (1) ve 'kelimesi' (1)
    });
  });

  describe('calculateWPM', () => {
    test('geçersiz süre ve kelime sayısında 0 dönmeli', () => {
      expect(calculateWPM(0, 1000)).toBe(0);
      expect(calculateWPM(100, 0)).toBe(0);
      expect(calculateWPM(-5, -10)).toBe(0);
    });

    test('1 dakikada 250 kelime okunursa 250 WPM dönmeli', () => {
      expect(calculateWPM(250, 60000)).toBe(250);
    });

    test('30 saniyede 150 kelime okunursa 300 WPM dönmeli', () => {
      expect(calculateWPM(150, 30000)).toBe(300);
    });

    test('küsuratları en yakın tam sayıya yuvarlamalı', () => {
      // 100 kelimeyi 45 saniyede (45000 ms) okumak -> 100 / (0.75) = 133.333
      expect(calculateWPM(100, 45000)).toBe(133);
    });
  });

  describe('calculateDurationFromWPM', () => {
    test('geçersiz WPM değerinde 0 dönmeli', () => {
      expect(calculateDurationFromWPM(100, 0)).toBe(0);
      expect(calculateDurationFromWPM(0, 200)).toBe(0);
    });

    test('250 WPM hedefiyle 500 kelimenin süresini doğru hesaplamalı', () => {
      // 500 / 250 = 2 dakika = 120000 ms
      expect(calculateDurationFromWPM(500, 250)).toBe(120000);
    });

    test('300 WPM hedefiyle 150 kelimenin süresini hesaplamalı', () => {
      // 150 / 300 = 0.5 dakika = 30000 ms
      expect(calculateDurationFromWPM(150, 300)).toBe(30000);
    });
  });
});
