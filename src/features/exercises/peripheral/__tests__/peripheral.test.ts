/// <reference types="bun-types" />
import { expect, test, describe } from 'bun:test';
import { renderHook, act } from '@testing-library/react-hooks';
import { usePeripheralEngine } from "@/features/exercises/peripheral/usePeripheralEngine";

describe('PeripheralEngine', () => {
  test('başlangıçta sayaçlar 0 ve durum idle olmalı', () => {
    const { result } = renderHook(() => usePeripheralEngine({
      timeLimitMs: 30000,
      updateIntervalMs: 100,
    }));

    expect(result.current.correctCount).toBe(0);
    expect(result.current.totalAttempts).toBe(0);
    expect(result.current.isCompleted).toBe(false);
  });

  test('başlatıldığında hedef, seçenekler ve konum oluşturulmalı', () => {
    const { result } = renderHook(() => usePeripheralEngine({
      timeLimitMs: 30000,
      updateIntervalMs: 100,
    }));

    act(() => {
      result.current.start();
    });

    expect(result.current.currentTarget).toBeString();
    expect(result.current.currentTarget.length).toBeGreaterThan(0);
    expect(result.current.options.length).toBe(4);
    expect(['left', 'right', 'top', 'bottom'].includes(result.current.position)).toBe(true);
    expect(result.current.distance).toBeGreaterThanOrEqual(100);
  });

  test('doğru kelime seçildiğinde correctCount ve totalAttempts artmalı', () => {
    const { result } = renderHook(() => usePeripheralEngine({
      timeLimitMs: 30000,
      updateIntervalMs: 100,
    }));

    act(() => {
      result.current.start();
    });

    const target = result.current.currentTarget;
    act(() => {
      result.current.handleSelection(target);
    });

    expect(result.current.correctCount).toBe(1);
    expect(result.current.totalAttempts).toBe(1);
  });

  test('yanlış kelime seçildiğinde sadece totalAttempts artmalı', () => {
    const { result } = renderHook(() => usePeripheralEngine({
      timeLimitMs: 30000,
      updateIntervalMs: 100,
    }));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.handleSelection('WRONG_NON_EXISTENT_PERIPHERAL_TARGET');
    });

    expect(result.current.correctCount).toBe(0);
    expect(result.current.totalAttempts).toBe(1);
  });
});
