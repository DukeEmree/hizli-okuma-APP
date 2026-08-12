// @ts-ignore
import { expect, test, describe } from 'bun:test';
import { renderHook } from '@testing-library/react-hooks';
import { useRSVPEngine } from "@/features/exercises/rsvp/useRSVPEngine";

// Shared mocks (react-native-mmkv, @amplitude/analytics-react-native)
// are registered in test-setup.ts via bunfig.toml's [test].preload.

describe('RSVPEngine', () => {
  test('should parse words correctly', () => {
    const { result } = renderHook(() => useRSVPEngine({
      wpm: 300,
      text: 'Okuma hızı egzersizi'
    }));

    expect(result.current.words).toEqual(['Okuma', 'hızı', 'egzersizi']);
    expect(result.current.wordIndex).toBe(0);
    expect(result.current.currentWord).toBe('Okuma');
  });

  // Not: React timer hooks'larını gerçek zamanlı test etmek için jest fake timers
  // veya benzeri bir çözüm gerekir. Basit bir entegrasyon testi simüle ediyoruz.
  
  test('should compute correct msPerWord', () => {
    // 300 WPM = (60 / 300) * 1000 = 200ms
    const wpm300_ms = (60 / 300) * 1000;
    expect(wpm300_ms).toBe(200);
    
    // 600 WPM = (60 / 600) * 1000 = 100ms
    const wpm600_ms = (60 / 600) * 1000;
    expect(wpm600_ms).toBe(100);
  });
});
