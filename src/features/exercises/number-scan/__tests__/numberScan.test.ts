/// <reference types="bun-types" />
import { expect, test, describe } from 'bun:test';
import { renderHook, act } from '@testing-library/react-hooks';
import { useNumberScanEngine } from "@/features/exercises/number-scan/useNumberScanEngine";

describe('NumberScanEngine', () => {
  test('başlangıçta sayaçlar 0 olmalı ve hedef 0 olmalı', () => {
    const { result } = renderHook(() => useNumberScanEngine({
      timeLimitMs: 30000,
    }));

    expect(result.current.correctCount).toBe(0);
    expect(result.current.totalAttempts).toBe(0);
    expect(result.current.isCompleted).toBe(false);
  });

  test('başlatıldığında ızgara sayıları ve hedef sayı oluşturulmalı', () => {
    const { result } = renderHook(() => useNumberScanEngine({
      timeLimitMs: 30000,
    }));

    act(() => {
      result.current.start();
    });

    expect(result.current.targetNumber).toBeGreaterThan(0);
    expect(result.current.gridNumbers.length).toBeGreaterThanOrEqual(9);
    expect(result.current.gridNumbers.includes(result.current.targetNumber)).toBe(true);
  });

  test('hedef sayı seçildiğinde correctCount ve totalAttempts artmalı', () => {
    const { result } = renderHook(() => useNumberScanEngine({
      timeLimitMs: 30000,
    }));

    act(() => {
      result.current.start();
    });

    const target = result.current.targetNumber;
    act(() => {
      result.current.handleSelection(target);
    });

    expect(result.current.correctCount).toBe(1);
    expect(result.current.totalAttempts).toBe(1);
  });

  test('yanlış sayı seçildiğinde sadece totalAttempts artmalı', () => {
    const { result } = renderHook(() => useNumberScanEngine({
      timeLimitMs: 30000,
    }));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.handleSelection(-9999);
    });

    expect(result.current.correctCount).toBe(0);
    expect(result.current.totalAttempts).toBe(1);
  });
});
